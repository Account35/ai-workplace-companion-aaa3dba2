# AI Workplace Companion

AI Workplace Productivity Assistant — Lovable Build Prompt

Build a modern, responsive SaaS-style web application called AI Workplace Productivity Assistant.

The application helps professionals use AI for workplace communication and productivity.

Core Features

1. Smart Email Generator

Allow users to generate professional emails using AI.

Inputs:

Recipient/Audience

Email purpose

Key points

Tone: Formal, Friendly, or Persuasive

The AI must generate a unique, context-aware email based on the user's inputs.

Display:

Subject

Email body

The generated content must be editable and include:

Copy

Regenerate

Clear

Do not use hardcoded or generic responses.

2. Meeting Notes Summarizer

Allow users to paste lengthy meeting notes.

The AI must analyze the actual notes and generate:

Meeting Summary

Key Decisions

Action Items

Deadlines

The AI must only extract information available in the user's notes and must not invent people, decisions, or deadlines.

Make the output editable and include:

Copy

Regenerate

Clear

3. AI Workplace Assistant

Create an interactive AI chatbot.

Users can ask workplace-related questions and receive real AI-generated responses based on their prompts.

Include suggested prompts such as:

Draft a professional email

Create a meeting agenda

Organize my tasks

Improve this message

Summarize these notes

Do not use predetermined chatbot responses.

Dashboard & Navigation

Create a modern dashboard with a left sidebar containing:

Dashboard

Email Generator

Meeting Summarizer

AI Assistant

Settings

Responsible AI

The dashboard should contain three feature cards linking to the main tools.

Design

Use a clean, professional SaaS design.

Colors

Use primarily:

Light grey

White

Dark charcoal

Black/dark grey text

Use subtle borders, shadows, rounded cards, modern typography, and good spacing.

The design must be fully responsive for:

Desktop

Laptop

Tablet

Mobile

Authentication & User Access

There must be NO registration and NO sign-in.

When a user opens the application, they should immediately access the dashboard.

Do not create:

Login page

Registration page

Authentication

User accounts

Password functionality

Backend & Database

Do NOT create a backend or database.

The application should be frontend-focused.

Do not add:

Supabase database

User database

Backend server

User authentication

Persistent user accounts

AI functionality should work through an AI API integration from the frontend/application environment where supported.

Structure the AI integration so the email generator, meeting summarizer, and chatbot send the actual user's input to an AI model and return the AI-generated response.

AI Requirements

This is an AI-powered application, not a static UI demo.

The three AI features must generate responses dynamically from the user's input.

Never use hardcoded example responses as the actual AI functionality.

Use structured prompts for:

Email generation

Meeting summarization

Workplace assistant

Include loading, error, and empty states.

Responsible AI

Include this disclaimer:

"AI-generated content may contain errors or inaccuracies. Always review AI-generated information before using it in professional communication or making decisions."

Also remind users not to enter confidential or sensitive workplace information.

Final Requirements

The final application must:

Open directly without login or registration.

Have no backend.

Have no database.

Generate real AI responses from user inputs.

Never rely on generic/hardcoded responses.

Have editable AI outputs.

Include copy, regenerate, and clear actions.

Have a modern professional dashboard.

Be fully responsive.

Include responsible AI messaging.

Keep the application simple and focused on the three core AI productivity features.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2b3af1c5-7b74-401b-bb02-6769b389e07a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
