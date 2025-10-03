Scenario
You act as the supporting team for a large Indian company’s Sales Conference. Your job is to build a single web app that serves as the hub for all salespersons: registration, agenda, reminders, chatbot, personalized poster + animation, and deployment.
The app backend must run on n8n with Google Sheets as the central database. Frontend framework and platform can be of your choice.

Workflow Build & Scoring (100 points; 20 each, sequential)

Step 1: Core Registration + Reminder Emails (20 pts)
•	Collects: name, email, phone, branch/region, T-shirt size, dietary preference.
•	Data stored in Google Sheet.
•	Should be able to load the salesperson’s details even after app page refresh.
•	Reminder emails:
−	Event begins 5 minutes after registration.
−	Reminders sent 4 minutes and 2 minutes before.
−	Emails are 4–5 sentences, professional but with a playful/funny opener.

Step 2: Agenda & Home Screen (20 pts)
•	Home page includes:
−	Poster-style agenda of the sessions (all AI generated).
−	3-image carousel for sponsors/speakers/themes (all AI generated).
−	Navigation tabs: “My Sessions,” “FAQ,” “Poster.”
•	My Sessions tab: shows next/upcoming session(s) with title, speaker, description – as per agenda.
•	Attendees can rate the session (1–5) and leave optional feedback; all logged in Google Sheet.

Step 3: Personalized Bollywood Poster + Animation (20 pts)
•	After registration, attendees upload a selfie.
•	System generates a vintage Bollywood poster with their name indicating they are eager to attend.
•	Poster is animated into a 5–7s clip (simple effects like flicker or idle character).
•	Accessible via “Poster” tab on the home page, with download/share option.

Step 4: FAQ Chatbot (20 pts)
•	Embedded chatbot answers any salesperson’s question during the event as per the FAQs.
•	Answers must stay consistent with event voice and details.

Step 5: Summary + Deployment (20 pts)
•	Implement a feedback summariser for the leadership on the home screen that aggregates ratings/comments and surfaces recurring themes (e.g., “Customer session was great”, “Lunch logistics poor,” “Loved the workshop”) after the conference is concluded.
•	App deployed with a shareable Vercel link. 
What You Should Know (Supporting Annexures)

1.	Agenda sheet (annexure)

2.	FAQ chatbot sample Q&As (annexure)

3.	API Keys
−	Limited-time keys for image and video generation can be provided if needed. 
−	However, these will not be provided on request, but at a time of the organiser’s choosing.

4.	Guidance
−	You can request the organiser’s inputs once before 2 pm (wasted if not utilised) and once again before 6 pm, individually
−	The session will last a maximum of 5 mins over a virtual connect
−	The request for guidance sessions will be made in the Team MXV WhatsApp group with the message: “Abhishek, you’re my only hope!”
−	The sequence of connects will be decided based on the sequence of messages in the group and the organiser’s availability
−	Only individual connects are to be organised for guidance

5.	Submission Guide: You must provide over mail to the organiser
−	Vercel link of deployed app
−	A screen recording (with your voice inputs) link demonstrating all the steps listed above
−	Accessible Google Sheet showing activity logs
−	Poster + animation outputs for at least one test attendee
−	Screenshots of chatbot interactions and reminder emails
The above should be shared with the organiser before 6 pm.

6.	Grading:
−	Grading will be done on the steps shared above in the problem statement along with other hygiene requirements.
−	Grading will be discussed in the subsequent morning calls. More details to be shared later.


Happy Vibeworking!
 
Annexure

Agenda (for use in the app – starting from the time of registration)
•	5 mins 	Keynote: Winning the Market in 2025
•	1 min 		Workshop: Digital Tools for Smarter Selling
•	1 min		Tea Break
•	2 mins 	Panel: Customer-Centric Sales Strategies
•	2 mins 	Lunch
•	1 mins		Session: Data-Driven Prospecting and Pipeline Building
•	1 min	 	Closing Session: Celebrating Success and Growth Stories
