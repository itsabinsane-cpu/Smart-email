# SmartMail AI

## What it does & the problem it solves
Writing a proper, professional email can be surprisingly time-consuming — picking the right words, tone, and structure, especially for job applications, follow-ups, or formal requests. SmartMail AI solves this for students, job seekers, and professionals who need to send polished emails quickly: the user just enters a few basic details (email type, tone, recipient, and purpose), and the app generates a complete, ready-to-send professional email in seconds using AI. Generated emails can also be saved for later reuse.

## Live App
https://bucolic-tiramisu-12f844.netlify.app/

## Features
- Generate a full, professional email from just a few basic inputs (email type, tone, recipient name/email, subject, and context)
- Choose from multiple email types (e.g. Job Application, Follow-up, etc.)
- Choose from multiple tones (e.g. Professional & Direct, etc.)
- AI-generated email content powered by Google's Gemini API
- Save generated emails for later access
- Copy the generated email to clipboard or open it directly in your email client
- Remembers previously used recipient details for faster form-filling

## AI Feature
The core AI feature uses the Gemini API (gemini-2.0-flash model) to generate email content. When the user fills in the form (email type, tone, recipient, subject/purpose, and additional context), the app sends these details to Gemini with instructions to write a complete, well-structured, professional email matching the selected type and tone, including a proper greeting, body, and sign-off. The model returns the finished email text, which is displayed to the user and can be saved or copied.

## Tools, Services & AI Models Used
- Google AI Studio (used to build the app)
- Google Gemini API (gemini-2.0-flash) for AI email generation
- React + TypeScript + Vite (frontend)
- Node.js / Express (backend)
- Deployed on Netlify

## Screenshots
<img width="950" height="445" alt="Screenshot 2026-07-25 164909" src="https://github.com/user-attachments/assets/c4433ef1-48f9-4b6f-a62f-8c4217e9aa82" />
<img width="619" height="355" alt="Screenshot 2026-07-25 165258" src="https://github.com/user-attachments/assets/d813668c-e418-481e-bd9c-01fa9c43be6b" />
<img width="716" height="421" alt="Screenshot 2026-07-25 165421" src="https://github.com/user-attachments/assets/2b1bf253-53dc-4ef0-a825-7c06a4452880" />




## How to Run Locally
Prerequisites: Node.js installed

1. Clone this repo:
git clone https://github.com/itsabinsane-cpu/Smart-email.git
cd Smart-email

2. Install dependencies:
npm install

3. Create a .env file (copy .env.example) and add your own Gemini API key:
GEMINI_API_KEY=your_key_here

4. Run the app:
npm run dev

5. Open the local URL shown in your terminal (usually http://localhost:3000)
