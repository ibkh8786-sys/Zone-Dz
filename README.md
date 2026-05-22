# Zone DZ Local Server

This project includes a simple frontend and a local Node.js backend to store orders and support messages.

## Run locally

1. Open a terminal in `c:\Users\زكرياء\Desktop\test`
2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

4. Open the app in your browser:

```text
http://localhost:3000
```

## What it does

- Saves orders to `data/orders.json`
- Saves contact form messages to `data/contactMessages.json`
- Saves support chat messages to `data/supportMessages.json`
- Exposes API endpoints under `/api`

## Notes

- Orders are also stored locally in the browser for the admin panel to display.
- If the backend is unreachable, the frontend falls back to localStorage storage.
- Admin login credentials:
  - username: `admin`
  - password: `kiek2003`
