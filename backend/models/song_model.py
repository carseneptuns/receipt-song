"""
Data access layer for songs belonging to a receipt.
"""
from database.connection import get_connection


def _row_to_dict(row):
    if not row:
        return None
    return {
        "id": row["id"],
        "receipt_id": row["receipt_id"],
        "title": row["title"],
        "artist": row["artist"],
        "album": row["album"],
        "duration": row["duration"],
        "album_cover": row["album_cover"],
        "position": row["position"],
    }


def get_songs_by_receipt(receipt_id):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM songs WHERE receipt_id = %s ORDER BY position ASC, id ASC",
                (receipt_id,),
            )
            rows = cursor.fetchall()
        return [_row_to_dict(r) for r in rows]
    finally:
        conn.close()


def get_song_by_id(receipt_id, song_id):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM songs WHERE id = %s AND receipt_id = %s",
                (song_id, receipt_id),
            )
            row = cursor.fetchone()
        return _row_to_dict(row)
    finally:
        conn.close()


def add_song(receipt_id, data):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT COALESCE(MAX(position), -1) + 1 AS next_pos FROM songs WHERE receipt_id = %s",
                (receipt_id,),
            )
            next_pos = cursor.fetchone()["next_pos"]

            cursor.execute(
                """
                INSERT INTO songs
                    (receipt_id, title, artist, album, duration, album_cover, position)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    receipt_id,
                    data.get("title", "").strip(),
                    data.get("artist", "").strip(),
                    data.get("album", "").strip(),
                    data.get("duration", "").strip(),
                    data.get("album_cover", ""),
                    data.get("position", next_pos),
                ),
            )
            new_id = cursor.lastrowid
        conn.commit()
        return get_song_by_id(receipt_id, new_id)
    finally:
        conn.close()


def update_song(receipt_id, song_id, data):
    conn = get_connection()
    try:
        existing = get_song_by_id(receipt_id, song_id)
        if not existing:
            return None
        merged = {**existing, **data}
        with conn.cursor() as cursor:
            cursor.execute(
                """
                UPDATE songs
                SET title = %s, artist = %s, album = %s, duration = %s,
                    album_cover = %s, position = %s
                WHERE id = %s AND receipt_id = %s
                """,
                (
                    merged.get("title"),
                    merged.get("artist"),
                    merged.get("album"),
                    merged.get("duration"),
                    merged.get("album_cover"),
                    merged.get("position"),
                    song_id,
                    receipt_id,
                ),
            )
        conn.commit()
        return get_song_by_id(receipt_id, song_id)
    finally:
        conn.close()


def delete_song(receipt_id, song_id):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "DELETE FROM songs WHERE id = %s AND receipt_id = %s",
                (song_id, receipt_id),
            )
            affected = cursor.rowcount
        conn.commit()
        return affected > 0
    finally:
        conn.close()


def reorder_songs(receipt_id, ordered_song_ids):
    """ordered_song_ids: list of song ids in the new desired order."""
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            for index, song_id in enumerate(ordered_song_ids):
                cursor.execute(
                    "UPDATE songs SET position = %s WHERE id = %s AND receipt_id = %s",
                    (index, song_id, receipt_id),
                )
        conn.commit()
        return get_songs_by_receipt(receipt_id)
    finally:
        conn.close()
