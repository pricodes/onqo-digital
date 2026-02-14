# ONQO Digital Readiness Audit - Setup Guide

This guide explains how to set up the environment for the ONQO Digital Readiness Audit, including Vertex AI and SendGrid integration.

## 1. Local Development Setup

1.  **Install Dependencies:**
    ```bash
    npm run install:all
    ```

2.  **Environment Variables:**
    *   Navigate to the `server` directory.
    *   Copy `.env.example` to `.env`.
    *   Fill in the required values (see below).

    ```bash
    cd server
    cp .env.example .env
    ```

3.  **Start Development:**
    ```bash
    npm start
    ```
    *   Client: http://localhost:5173
    *   Server: http://localhost:3000

## 2. Real Integrations Setup

### Google Cloud Vertex AI (Gemini)

Required for generating the executive summary.

1.  **Google Cloud Project:**
    *   Ensure you have a Google Cloud Project.
    *   Enable the **Vertex AI API** in the Google Cloud Console.

2.  **Authentication (Local):**
    *   Install the [gcloud CLI](https://cloud.google.com/sdk/docs/install).
    *   Run `gcloud auth application-default login` to set up Application Default Credentials (ADC).
    *   This creates a local credential file that the Node.js client library will automatically use.

3.  **Environment Variables (`server/.env`):**
    *   `GOOGLE_CLOUD_PROJECT`: Your Project ID (e.g., `onqo-audit-123`).
    *   `VERTEX_LOCATION`: Region (default `us-central1`).
    *   `VERTEX_MODEL`: Model ID (default `gemini-1.5-flash-001` or `gemini-1.5-pro-001`).

### SendGrid Email

Required for delivering the report.

1.  **Create SendGrid Account:**
    *   Sign up for [SendGrid](https://sendgrid.com/).
    *   Create a Sender Identity (verify a domain or single sender email).

2.  **API Key:**
    *   Go to **Settings** > **API Keys**.
    *   Create a new API Key with "Mail Send" permissions (Restricted Access) or Full Access.
    *   Copy the key (starts with `SG.`).

3.  **Environment Variables (`server/.env`):**
    *   `SENDGRID_API_KEY`: The API key you just copied.
    *   `MAIL_FROM`: The verified sender email (e.g., `insights@onqo.in`).
    *   `MAIL_BCC`: (Optional) Email to receive a copy of all reports (default `priya@onqo.in`).

## 3. Cloud Run Deployment

When deploying to Google Cloud Run:

1.  **Service Account:**
    *   Ensure the Cloud Run service account (usually the default Compute Engine service account) has the **Vertex AI User** role (`roles/aiplatform.user`).
    *   This allows the code to access Vertex AI without a JSON key file.

2.  **Environment Variables:**
    *   Set the following environment variables in your Cloud Run service configuration:
        *   `GOOGLE_CLOUD_PROJECT`
        *   `VERTEX_LOCATION`
        *   `VERTEX_MODEL`
        *   `SENDGRID_API_KEY`
        *   `MAIL_FROM`
        *   `MAIL_BCC`

## Troubleshooting

*   **"Service not configured":** Check your `.env` file or Cloud Run environment variables. Both `GOOGLE_CLOUD_PROJECT` and `SENDGRID_API_KEY` are required.
*   **Vertex AI Permission Denied:** Ensure your local user (via `gcloud auth application-default login`) or the Cloud Run service account has the **Vertex AI User** role.
*   **Email not received:** Check SendGrid Activity Feed. Ensure `MAIL_FROM` is a verified sender in SendGrid.
