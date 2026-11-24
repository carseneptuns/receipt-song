"""
Data access layer for receipts.
Every function opens and closes its own connection to keep things simple
and stateless, which suits Flask's request-per-thread model.
"""
from database.connection import get_connection


def _row_to_dict(row):
    if not row:
        return None
    return {
        "id": row["id"],
        "title": row["title"],
        "name": row["name"],
        "store_name": row["store_name"],
        "date": row["receipt_date"],
        "time": row["receipt_time"],
        "footer": row["footer"],
        "theme": row["theme"],
        "created_at": str(row["created_at"]) if row.get("created_at") else None,
        "updated_at": str(row["updated_at"]) if row.get("updated_at") else None,
    }


def create_receipt(data):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO receipts
                    (title, name, store_name, receipt_date, receipt_time, footer, theme)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    data.get("title", "RECEIPTSONG"),
                    data.get("name", "Guest"),
                    data.get("store_name", "RECEIPTSONG"),
                    data.get("date", ""),
                    data.get("time", ""),
                    data.get("footer", "THANK YOU ♡"),
                    data.get("theme", "classic"),
                ),
            )
            new_id = cursor.lastrowid
        conn.commit()
        return get_receipt_by_id(new_id)
    finally:
        conn.close()


def get_receipt_by_id(receipt_id):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM receipts WHERE id = %s", (receipt_id,))
            row = cursor.fetchone()
        return _row_to_dict(row)
    finally:
        conn.close()


def update_receipt(receipt_id, data):
    conn = get_connection()
    try:
        existing = get_receipt_by_id(receipt_id)
        if not existing:
            return None
        merged = {**existing, **data}
        with conn.cursor() as cursor:
            cursor.execute(
                """
                UPDATE receipts
                SET title = %s, name = %s, store_name = %s, receipt_date = %s,
                    receipt_time = %s, footer = %s, theme = %s
                WHERE id = %s
                """,
                (
                    merged.get("title"),
                    merged.get("name"),
                    merged.get("store_name"),
                    merged.get("date"),
                    merged.get("time"),
                    merged.get("footer"),
                    merged.get("theme"),
                    receipt_id,
                ),
            )
        conn.commit()
        return get_receipt_by_id(receipt_id)
    finally:
        conn.close()


def delete_receipt(receipt_id):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM receipts WHERE id = %s", (receipt_id,))
            affected = cursor.rowcount
        conn.commit()
        return affected > 0
    finally:
        conn.close()
