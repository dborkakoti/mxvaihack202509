# Major tasks
* Create Google Cloud project & OAuth creds for n8n.
* Create the 4 Google Sheets + Drive folder + note IDs.
* Provision n8n (cloud recommended) and add Google + SendGrid credentials.
* Build & test Registration webhook → append to Registration sheet.
* Build File Upload webhook → Drive upload → update Registration sheet.
* Implement Cron reminder workflow that sends SendGrid mails and marks flags in sheet.
* Implement Poster + Animation workflows (use fallback if needed).
* Implement Chatbot workflow (embeddings stored in FAQ sheet) and rating workflow.
* Record the demo, collect required artifacts and email the organizer.

# Accounts

* Google Account: This is your primary account for Sheets and Drive. [x]
* n8n Cloud Account: Sign up at n8n.io. [x]
* ~~SendGrid Accoun~~ Resend: Sign up and create an API key for sending emails. [x]
* Google Cloud Platform (GCP) Credentials: This is the most critical setup step. To allow n8n to access your Google Sheets and Drive, you need to create service credentials. [ ]
    - Go to the Google Cloud Console. [ ]
    - Create a new project (e.g., "MXV Hackathon"). [ ]
    - Enable the Google Drive API and the Google Sheets API for this project. [ ]
    - Go to "Credentials," click "Create Credentials," and select "Service Account." [ ]
    - Give it a name (e.g., "n8n-accessor"), grant it "Editor" permissions for simplicity during the hackathon. [ ]
* Gemini API Key: Get this from Google AI Studio.


# N8N

Webhook node — frontend → n8n.
Google Sheets node — Append Row, Read Rows, Update Row.
Google Drive node — Upload File, Share Link.
SendGrid node — send transactional emails.
HTTP Request node — call Gemini APIs (text, embeddings, images, video).
Function / Code node — compute cosine similarity between vectors stored in Sheets (JS).
Cron node — scheduled checks for reminders and summariser.
SplitInBatches node — process multiple rows safely.
Wait node — (not recommended at scale) — leaves workflow running; better to use Cron + read-check logic.