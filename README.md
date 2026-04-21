# CanadaCitizenTest.ca (MVP)

This repository is organized into separate backend and frontend folders for easier maintenance and updates.

## Project structure

- `backend/src/server.js` - HTTP server entrypoint.
- `backend/src/routes` - API route handlers.
- `backend/src/data` - in-memory dummy data.
- `backend/src/utils` - shared helpers (HTTP + summary logic).
- `frontend/public` - static web app assets (`index.html`, `styles.css`, `app.js`).

## Run locally

```bash
npm install
npm run dev
```

Or:

```bash
npm start
```

Then open `http://localhost:3000`.

## Verify

```bash
npm run check
```
