# TMDB React App (with Firebase Authentication)

A React-based web application that allows users to browse movies and TV shows using the TMDB API.  
Users can sign up / log in using Firebase Authentication and save favourites and custom lists.

This project is designed to run locally and can be easily cloned from GitHub.  
Environment variables are required for Firebase and TMDB configuration.

---

## Features

- Browse movies and TV shows (Discover, Search, Details)
- Firebase Authentication (Email/Password and Google if enabled)
- User-specific data storage (favourites, lists, etc.) via Firestore
- Works for both authenticated and guest users
- Local development + GitHub friendly setup
- `.env.example` included for easy installation

---

## Tech Stack

- React (Vite or CRA)
- Firebase Authentication
- Cloud Firestore
- TMDB API (read-only)
- Optional: serverless functions for secure proxying

---

## Folder Structure (high-level)

```
/
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── hooks/
│   └── App.js or App.jsx
├── .env.example
├── .env.local (NOT committed)
├── README.md
├── package.json
└── docs/ (optional — wireframes, notes)
```

---

## Getting Started (Local Development)

### 1. Clone the repository

```
git clone <REPO_URL>
cd <PROJECT_FOLDER>
```

### 2. Install dependencies

```
npm install
```

### 3. Create your environment file

Duplicate `.env.example` and name it `.env.local`:

```
cp .env.example .env.local
```

Fill `.env.local` with your **Firebase Web App config** and **TMDB API key**.

> **Never commit `.env.local`** — it contains secrets.

### 4. Start the development server

For Create React App:

```
npm start
```

For Vite:

```
npm run dev
```

The app will run at:

[http://localhost:3000](http://localhost:3000)

---

## Firebase Setup (Required)

### 1. Create Firebase project

Go to: <https://console.firebase.google.com/>

### 2. Add a Web App to Firebase

Copy the config values into `.env.local`.

### 3. Enable Authentication providers

Firebase Console → Authentication → Sign-in method  

Enable:

- Email/Password
- Google (optional)

### 4. Add Authorized Domains

Firebase Console → Authentication → Settings → Authorized domains  

Add:

- `localhost`
- `localhost:3000`

These are required for Firebase Auth to work locally.

---

## TMDB Setup (Required)

1. Create an account at <https://www.themoviedb.org/>
2. Go to **API** section and request a developer API key.
3. Put the key inside `.env.local` under `REACT_APP_TMDB_API_KEY`.

---

## Building for Production (Optional)

```
npm run build
```

---

## Environment Variables

These are required (see `.env.example`):

```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_TMDB_API_KEY=
```

---

## Notes

- Commit `.env.example` but NOT `.env.local`.
- Firebase config can be public, but TMDB key should ideally be proxied later when you add a backend.
- Firestore rules should restrict access so each user only reads/writes their own data.

---

## License

MIT License