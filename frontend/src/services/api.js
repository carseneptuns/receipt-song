/**
 * Thin Axios wrapper around the ReceiptSong REST API.
 * Base URL comes from VITE_API_URL so it's never hardcoded.
 */
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

function unwrap(promise) {
  return promise.then((res) => res.data).catch((err) => {
    const message =
      err.response?.data?.error ||
      err.response?.data?.errors ||
      "Could not reach the server. Please try again.";
    const wrapped = new Error(
      typeof message === "string" ? message : "Please check the form for errors."
    );
    wrapped.fieldErrors = typeof message === "object" ? message : null;
    wrapped.original = err;
    throw wrapped;
  });
}

export const ReceiptAPI = {
  create: (payload) => unwrap(client.post("/receipts", payload)),
  get: (id) => unwrap(client.get(`/receipts/${id}`)),
  update: (id, payload) => unwrap(client.put(`/receipts/${id}`, payload)),
  remove: (id) => unwrap(client.delete(`/receipts/${id}`)),
};

export const SongAPI = {
  add: (receiptId, payload) =>
    unwrap(client.post(`/receipts/${receiptId}/songs`, payload)),
  update: (receiptId, songId, payload) =>
    unwrap(client.put(`/receipts/${receiptId}/songs/${songId}`, payload)),
  remove: (receiptId, songId) =>
    unwrap(client.delete(`/receipts/${receiptId}/songs/${songId}`)),
  reorder: (receiptId, songIds) =>
    unwrap(
      client.put(`/receipts/${receiptId}/songs/reorder`, { song_ids: songIds })
    ),
};

export default client;
