# Initiate
Create a minimal NextJS project for an app to manage conference registration. Use shadcn to get a beautiful interface.
Use these colors

/* CSS HEX */
--nyanza: #eaf4d3ff;
--vanilla: #dbd8aeff;
--rosy-brown: #ca907eff;
--chestnut: #994636ff;
--golden-brown: #895b1eff;

# Home page
Generate a React page component for the Home page. File should:
- Render top navigation tabs: Home / My Sessions / Poster / FAQ / Summary.
- Show a poster preview card that fetches the current user's registration record:
  - Read registration_id from localStorage key 'registration_id'. If missing show "Register" CTA linking to /register.
  - If registration_id present, call n8n using environment variable NEXT_PUBLIC_N8N_REGISTRATION_WEBHOOK_URL with registration_id=${id} to fetch registration row (assume JSON { id, name, poster_url, poster_video_url, event_time }).
  - Display poster thumbnail (poster_url) or placeholder.
- Show an Agenda poster block - pick the details from static/agenda.md
  - Hardcode agenda from annexure (converted to relative times from registration_time client-side) if user registered; otherwise show general agenda.
  - Render a poster-like visual using Tailwind (large heading, session list).
- Include a 3-image Carousel component (import Carousel) below agenda.
- If registration exists and feedback summary is available, show a Summary snippet (link to /summary).
- Provide loading states and error states.
- Minimal CSS with Tailwind classes, mobile-first responsive layout.
- Export default Home component.
- Create components fro the Carousel, NavBar, PosterViewer

# Registration page
Generate a registration form page:
- Uses React, useState, useEffect.
- Form fields: name, email, phone, branch, tshirt_size (S/M/L/XL), dietary (text).
- Client validation: required: name, email (regex), phone (basic digits), tshirt_size required.
- On submit:
  - POST JSON to n8n at NEXT_PUBLIC_N8N_GET_REGISTRATION_WEBHOOK_URL with body { name, email, phone, branch, tshirt_size, dietary }.
  - Handle response { registration_id, event_time } — store registration_id in localStorage under key 'registration_id' and registration record in localStorage 'registration_record'.
  - Redirect to /poster after success.
- Show success toast and show registration details on page after submit.
- Show helpful error messages on failures.
- Use Tailwind form styling and accessible labels.
- Export default Register.
- Extract components where relevant

## Registration form component
- Props: none. Pure form component used on /register.
- Render inputs: name, email, phone, branch, tshirt_size, dietary.
- On submit:
  - disable form and show spinner.
  - POST JSON to NEXT_PUBLIC_N8N_GET_REGISTRATION_WEBHOOK_URL
  - On success: store registration_id in localStorage and call an onSuccess callback if provided.
  - On error: show toast with error.
- Validate email regex and phone simple digits.
- Use Tailwind for form styling and accessible labels.
- Export default RegistrationForm.

## Registration sample post
Sample POST for registration
POST /registration
body: { name, email, phone, branch, tshirt_size, dietary }
response: { registration_id: "uuid-123", event_time: "2025-09-26T10:56:00Z" }

# Poster
/Poster
generate Poster — poster workflow page:
- Reads registration_id from localStorage; if missing, show link to /register.
- Shows current selfie_url, poster_url by picking value from { registration_record } in the localstore, if they are present.
- If poster available, render PosterViewer component (import PosterViewer) to show poster image and a Download button linking to poster_url. If poster_video_url exists, show video player (controls) and Download video button.
- Include Uploader component (import Uploader) for selfie upload.
<!-- - If video generation is async, show "Video processing — we will notify when done" and poll the GET registration endpoint every 5s until poster_video_url appears (timeout after 3 minutes). -->
- Provide accessible buttons: "Share" (copies Drive share link to clipboard).
- Use Tailwind styling, shadcn and a clear progress indicator.
- Export default Poster page.

## Poster uploader component
Generate src/components/Uploader.jsx:
- Props: registrationId (string), onUploaded(callback with selfie_url).
- Render: file input (accept="image/*") and Upload button.
- Provide "Generate Poster" button that POSTs { registration_id, name } to NEXT_PUBLIC_N8N_GENERATE_POSTER_WEBHOOK_URL; show spinner while the n8n workflow runs synchronously.
- On file select and upload:
  - Create FormData: form.append('file', file); form.append('registration_id', registrationId);
  - POST to NEXT_PUBLIC_N8N_GENERATE_POSTER_WEBHOOK_URL body = formData
  - Expect response { selfie_url, poster_url }, which should be updated in localStore { registration_record }
  - On success: call onUploaded(selfie_url) and show success message.
  - On error: show error message and retry button, with the earlier uploader button.
- Show upload progress bar using fetch xhr fallback or `onprogress` if using XHR. If using fetch, show spinner during upload.
- Use Tailwind and make it accessible.
- Export default Uploader.

## Poster Viewer component
- Props: registrationId.
- On mount:
  - From localStore { registration_record }` read { poster_url, poster_video_url }.
- Render:
  - If poster_url exists: show image with caption "Vintage Bollywood Poster for {name}" and a Download button linking to poster_url (download attribute).
  - If it doesn't exist: use the CTA "Generate Poster" that POSTs { registration_id, name } to `NEXT_PUBLIC_N8N_GENERATE_POSTER_WEBHOOK_URL`
- Provide copy-to-clipboard share link for poster
- Handle errors and show retry button for poster generation.
- Export default PosterViewer.

# My session
/my-session
Generate MySessions
- Reads registration_id from localStorage; fetch registration via GET n8n_get_registration.
- Load Session rows from a hardcoded client-side array derived from annexure OR call an n8n endpoint if available.
- Compute schedule relative to registration.registration_time: list sessions with computed start times.
- Highlight the next upcoming session (based on Date.now()) with title, speaker, description, start time and countdown timer.
- For sessions that have passed, show a RatingWidget (import RatingWidget) to submit a rating (1-5) and optional comment.
- RatingWidget should call POST NEXT_PUBLIC_N8N_RATING_WEBHOOK_URL with { sessionid, registrationid, rating, comment }.
- After rating, show 'Thank you' and disable further ratings for that session (UI-level check).
- Use Tailwind cards, a simple countdown (mm:ss), and mobile-friendly layout.
- Export default MySessions.

# My faq
/faq
Generate FAQ — chat page:
- Render ChatWidget component (import ChatWidget) centered on the page.
- ChatWidget should:
  - Maintain message list in state [{ from: 'user'|'bot', text, ts }].
  - Provide input box and Send button. Disable Send when empty.
  - On send, POST { registration_id, query } to NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL (application/json).
  - Expect response { answer } — append bot message to list and append whole exchange to local log and optionally call n8n GET to fetch chatlog if needed.
  - Show typing indicator while waiting.
  - Scroll to bottom on new messages.
- Provide quick-suggest buttons (common FAQs) that send a predefined query when clicked.
- Use Tailwind, accessible inputs, keyboard submit on Enter.
- Export default FAQ.

## Chat widget component
- Props: registrationId.
- State: messages array.
- UI:
  - Scrollable message list with user bubbles on right, bot bubbles on left.
  - Input area, Send button, and quick-suggest chips.
- Behavior:
  - On send, append user message to state, POST { registration_id, query } to `${import.meta.env.VITE_N8N_CHAT}`, show typing indicator, when response arrives append bot message.
  - Log each exchange to localStorage 'chat_history_{registrationId}' for offline persistence.
  - Show loading spinner while waiting.
  - On network error show a toast and allow retry.
- Export default ChatWidget.


# Summary
/summary
Generate Summary page:
- Calls an n8n endpoint or reads from a shared Google Sheets "Summary" via NEXT_PUBLIC_N8N_SUMMARY_WEBHOOK_URL (if not available, read from GET registration endpoint which returns summary for that registration).
- Display aggregated metrics:
  - Average rating per session, top 3 positive themes, top 3 negative themes, example quotes.
- If summary not ready, show a "Generate summary" button that hits an n8n webhook to run the summariser; show progress and then poll for results.
- Render summary as simple cards and a bulleted list; include a CSV download button that links to the SessionRatings sheet (provide the sheet link).
- Export default Summary page

## Rating widget
- Props: { sessionId, registrationId, onRated(optional) }.
- Render 5 clickable star icons (SVGs) and a textarea for optional comment.
- When user clicks a star and clicks Submit:
  - Disable input and POST { sessionid: sessionId, registrationid: registrationId, rating: n, comment } to NEXT_PUBLIC_N8N_RATING_WEBHOOK_URL.
  - Expect { ok: true } response. On success call onRated() and show "Thanks for rating!".
  - Prevent duplicate ratings client-side by storing rated sessions list in localStorage key `rated_sessions_{registrationId}`.
- Use accessible role="radio" pattern for stars so keyboard users can set rating.
- Export default RatingWidget.

