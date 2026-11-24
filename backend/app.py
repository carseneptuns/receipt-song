"""
ReceiptSong backend entrypoint.
Boots Flask, enables CORS for the frontend origin, initializes the
MySQL schema, and registers the receipt/song blueprints.
"""
from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from database.connection import init_db
from routes.receipt_routes import receipt_bp
from routes.song_routes import song_bp


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": Config.CORS_ORIGIN}})

    app.register_blueprint(receipt_bp)
    app.register_blueprint(song_bp)

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok", "service": "receiptsong-api"}), 200

    @app.errorhandler(404)
    def not_found(_e):
        return jsonify({"error": "Not found."}), 404

    @app.errorhandler(500)
    def server_error(_e):
        return jsonify({"error": "Something went wrong on the server."}), 500

    return app


app = create_app()

if __name__ == "__main__":
    try:
        init_db()
        print("Database ready.")
    except Exception as exc:  # noqa: BLE001
        print(f"Could not initialize database: {exc}")

    app.run(host="0.0.0.0", port=Config.FLASK_PORT, debug=Config.FLASK_DEBUG)
