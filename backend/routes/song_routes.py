"""
Song endpoints, nested under a receipt: add, update, delete, reorder.
"""
from flask import Blueprint, request, jsonify
import models.song_model as SongModel
import models.receipt_model as ReceiptModel

song_bp = Blueprint("songs", __name__, url_prefix="/api/receipts/<int:receipt_id>/songs")


def _validate_song(body, partial=False):
    errors = {}
    if not partial or "title" in body:
        if not (body.get("title") or "").strip():
            errors["title"] = "Please enter a song title."
    if not partial or "artist" in body:
        if not (body.get("artist") or "").strip():
            errors["artist"] = "Please enter an artist."
    if not partial or "duration" in body:
        duration = (body.get("duration") or "").strip()
        if not duration:
            errors["duration"] = "Please enter a duration."
        else:
            parts = duration.split(":")
            valid = all(p.isdigit() for p in parts) and len(parts) in (2, 3)
            if not valid:
                errors["duration"] = "Duration must look like mm:ss or h:mm:ss."
    return errors


@song_bp.post("")
def add_song(receipt_id):
    if not ReceiptModel.get_receipt_by_id(receipt_id):
        return jsonify({"error": "Receipt not found."}), 404

    body = request.get_json(silent=True) or {}
    errors = _validate_song(body)
    if errors:
        return jsonify({"errors": errors}), 400

    song = SongModel.add_song(receipt_id, body)
    return jsonify(song), 201


@song_bp.put("/reorder")
def reorder_songs(receipt_id):
    if not ReceiptModel.get_receipt_by_id(receipt_id):
        return jsonify({"error": "Receipt not found."}), 404

    body = request.get_json(silent=True) or {}
    ordered_ids = body.get("song_ids")
    if not isinstance(ordered_ids, list) or not ordered_ids:
        return jsonify({"error": "song_ids must be a non-empty list."}), 400

    songs = SongModel.reorder_songs(receipt_id, ordered_ids)
    return jsonify(songs), 200


@song_bp.put("/<int:song_id>")
def update_song(receipt_id, song_id):
    body = request.get_json(silent=True) or {}
    errors = _validate_song(body, partial=True)
    if errors:
        return jsonify({"errors": errors}), 400

    song = SongModel.update_song(receipt_id, song_id, body)
    if not song:
        return jsonify({"error": "Song not found."}), 404
    return jsonify(song), 200


@song_bp.delete("/<int:song_id>")
def delete_song(receipt_id, song_id):
    deleted = SongModel.delete_song(receipt_id, song_id)
    if not deleted:
        return jsonify({"error": "Song not found."}), 404
    return jsonify({"message": "Song deleted."}), 200
