# ONQO Digital Readiness Audit - Setup Guide

This guide explains how to set up the environment for the ONQO Digital Readiness Audit, including Vertex AI and Email integration.

## Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Server
PORT=3000

# Google Cloud (Vertex AI)
# Required for AI generation. If missing, the system uses a mock fallback.
GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account-key.json"
GOOGLE_CLOUD_PROJECT="your-project-id"
GOOGLE_CLOUD_LOCATION="us-central1"

# Email (Nodemailer)
# Required for sending emails. If missing, email sending is simulated in console logs.
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM='"ONQO Audit" <audit@onqo.digital>'
```

## 1. Google Cloud Setup (Vertex AI)

To enable the "Consultant-Grade" AI summary generation:

1.  **Create a Google Cloud Project:**
    *   Go to [Google Cloud Console](https://console.cloud.google.com/).
    *   Create a new project (e.g., `onqo-audit`).

2.  **Enable APIs:**
    *   Enable the **Vertex AI API**.

3.  **Create Service Account:**
    *   Go to **IAM & Admin** > **Service Accounts**.
    *   Create a new service account.
    *   Grant the role **Vertex AI User** (roles/aiplatform.user).
    *   Create a JSON key for this account and download it.
    *   Save it as `server/serviceAccountKey.json` (or update `.env` path).

## 2. Email Setup (Simplest Option: Gmail)

To enable email delivery:

1.  **Use Gmail:**
    *   Go to your Google Account > Security.
    *   Enable **2-Step Verification**.
    *   Search for **App Passwords**.
    *   Create a new App Password for "Mail" / "Server".
    *   Copy the 16-character password.

2.  **Update `.env`:**
    *   `EMAIL_HOST=smtp.gmail.com`
    *   `EMAIL_USER=your-email@gmail.com`
    *   `EMAIL_PASS=your-app-password`

## 3. Deployment (GCP Cloud Run)

To deploy this application:

1.  **Containerize:**
    *   The project already includes a `Dockerfile` (verify it builds `client` and serves via `server`).
    *   Or deploy `server` and `client` separately if preferred, but monorepo deployment is simpler.

2.  **Environment Variables:**
    *   When deploying to Cloud Run, add the environment variables defined above in the Cloud Run configuration.
    *   For `GOOGLE_APPLICATION_CREDENTIALS`, typically the Cloud Run service account has permissions if granted, so you might not need the JSON file if the service identity has `Vertex AI User` role. Just set `GOOGLE_CLOUD_PROJECT`.

## 4. Running Locally

1.  **Install Dependencies:**
    ```bash
    npm run install:all
    ```

2.  **Start Development:**
    ```bash
    npm start
    ```
    *   Client: http://localhost:5173
    *   Server: http://localhost:3000

## Troubleshooting

*   **AI is mocking:** Check if `GOOGLE_CLOUD_PROJECT` is set in `.env` and `server/server.js` can read it.
*   **Email not sending:** Check console logs. If "Email configuration missing" appears, check `.env`. If error occurs, check SMTP settings.
