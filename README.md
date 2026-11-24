# ReceiptSong

Turn your favorite songs into a personalized, downloadable music receipt.
Inspired by Receiptify, but every song is entered manually — no Spotify
account required.

## Stack

- **Frontend:** React + Vite, Tailwind CSS, React Router DOM, Axios, React Icons, html-to-image, @hello-pangea/dnd (drag-and-drop)
- **Backend:** Python, Flask, Flask-CORS, PyMySQL, python-dotenv
- **Database:** MySQL

## Project structure

```
receiptsong/
├── backend/     # Flask REST API
└── frontend/    # React + Vite app
```

## 1. Database

Make sure MySQL is running locally, then either:

- Let the backend create the database and tables automatically on first run (default), or
- Run the schema yourself: `mysql -u root -p < backend/database/schema.sql`

## 2. Backend setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env           # then edit DB credentials if needed
python app.py
```

The API runs at `http://localhost:5000`. Health check: `GET /api/health`.

## 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env           # VITE_API_URL should point at the backend
npm run dev
```

The app runs at `http://localhost:5173`.

## API reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/receipts` | Create a receipt (optionally with initial `songs`) |
| GET | `/api/receipts/:id` | Get a receipt with its songs |
| PUT | `/api/receipts/:id` | Update receipt info/theme |
| DELETE | `/api/receipts/:id` | Delete a receipt (cascades to its songs) |
| POST | `/api/receipts/:id/songs` | Add a song |
| PUT | `/api/receipts/:id/songs/:song_id` | Update a song |
| DELETE | `/api/receipts/:id/songs/:song_id` | Delete a song |
| PUT | `/api/receipts/:id/songs/reorder` | Reorder songs (`{ "song_ids": [...] }`) |

## User flow

Landing → Create Receipt → Add Songs → Edit Songs → Customize → Live Preview → Generate Receipt → Download / Print

No login is required — a receipt is created in the database the moment you land on `/create`, and everything you do is saved automatically.
