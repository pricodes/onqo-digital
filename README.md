# ONQO Digital Web App

A "Premium Dark" React application for digital readiness audits, backed by Node.js and Firestore.

## Prerequisites

- Node.js (v18 or v20+)
- npm

## Local Development

1.  **Install Dependencies**
    ```bash
    npm run install:all
    ```
    (Or install manually in `root`, `client`, and `server` directories).

2.  **Run Development Servers**
    ```bash
    npm start
    ```
    This will run both the Client (`localhost:5173`) and Server (`localhost:3000`) concurrently.

## Backend & Firestore Setup

The backend uses Firebase Admin SDK to connect to Firestore.

1.  **Firebase Project**: Create a project in the Firebase Console.
2.  **Service Account**:
    - Go to Project Settings > Service Accounts.
    - Generate a new private key.
    - Save the file as `serviceAccountKey.json` in the `server/` directory.
3.  **Environment Variables** (Optional):
    - You can also set `GOOGLE_APPLICATION_CREDENTIALS` to the path of your key file.

**Fallback**: If no credentials are found, the server will default to **In-Memory Storage**. Data will be lost on restart.

## Deployment to Cloud Run

1.  **Build the Container**
    ```bash
    gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/onqo-app
    ```

2.  **Deploy**
    ```bash
    gcloud run deploy onqo-app \
      --image gcr.io/YOUR_PROJECT_ID/onqo-app \
      --platform managed \
      --region us-west1 \
      --allow-unauthenticated
    ```

## Project Structure

- `client/`: React + Vite + Tailwind CSS
- `server/`: Node.js + Express + PDFKit
- `Dockerfile`: Multi-stage build for production

## Features

- **Digital Readiness Audit**: Multi-step wizard with conditional logic.
- **AI Report Generation**: Generates scores, summaries, gaps, and recommendations (Mocked logic for demo).
- **PDF Export**: Server-side PDF generation using `pdfkit`.
- **Premium Dark Mode**: Custom Tailwind configuration.
