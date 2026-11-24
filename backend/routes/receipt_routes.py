"""
Receipt endpoints: create, read, update, delete.
Nested song routes are registered separately in song_routes.py.
"""
from flask import Blueprint, request, jsonify
from datetime import datetime
import models.receipt_model as ReceiptModel
import models.song_model as SongModel

receipt_bp = Blueprint("receipts", __name__, url_prefix="/api/receipts")


@receipt_bp.post("")
def create_receipt():
    body = request.get_json(silent=True) or {}
    now = datetime.now()
    data = {
        "title": (body.get("title") or "RECEIPTSONG").strip() or "RECEIPTSONG",
        "name": (body.get("name") or "Guest").strip() or "Guest",
        "store_name": (body.get("store_name") or "RECEIPTSONG").strip() or "RECEIPTSONG",
        "date": body.get("date") or now.strftime("%d/%m/%Y"),
        "time": body.get("time") or now.strftime("%H:%M"),
        "footer": (body.get("footer") or "THANK YOU ♡"),
        "theme": body.get("theme") or "classic",
    }
    receipt = ReceiptModel.create_receipt(data)

    songs = body.get("songs") or []
    for index, song in enumerate(songs):
        if not song.get("title") or not song.get("artist"):
            continue
        song["position"] = index
        SongModel.add_song(receipt["id"], song)

    receipt["songs"] = SongModel.get_songs_by_receipt(receipt["id"])
    return jsonify(receipt), 201


@receipt_bp.get("/<int:receipt_id>")
def get_receipt(receipt_id):
    receipt = ReceiptModel.get_receipt_by_id(receipt_id)
    if not receipt:
        return jsonify({"error": "Receipt not found."}), 404
    receipt["songs"] = SongModel.get_songs_by_receipt(receipt_id)
    return jsonify(receipt), 200


@receipt_bp.put("/<int:receipt_id>")
def update_receipt(receipt_id):
    body = request.get_json(silent=True) or {}
    receipt = ReceiptModel.update_receipt(receipt_id, body)
    if not receipt:
        return jsonify({"error": "Receipt not found."}), 404
    receipt["songs"] = SongModel.get_songs_by_receipt(receipt_id)
    return jsonify(receipt), 200


@receipt_bp.delete("/<int:receipt_id>")
def delete_receipt(receipt_id):
    deleted = ReceiptModel.delete_receipt(receipt_id)
    if not deleted:
        return jsonify({"error": "Receipt not found."}), 404
    return jsonify({"message": "Receipt deleted."}), 200
