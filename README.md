# Greetings & Wishes Web App

A production-quality custom greetings and wishes web application built for personalized image generation. This project was developed as an internship assessment submission, focusing on premium UI/UX and seamless image personalization using the HTML5 Canvas API.

## Features

- 🔐 **Firebase Authentication**: Secure Google Sign-In and a convenient Guest Mode.
- 🎨 **Image Personalization**: Real-time overlay of user names and profile pictures on curated greeting templates.
- 🖼️ **HTML5 Canvas Engine**: Custom-built engine for high-performance client-side image merging.
- 📱 **Responsive Design**: Fully optimized for mobile and desktop with a dark, premium aesthetic.
- ✨ **Premium Upsell**: Integrated premium template detection with an animated bottom-sheet upsell.
- 📤 **Social Sharing**: One-click download and Web Share API integration for instant sharing to WhatsApp, Instagram, etc.

## Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS v4 (with custom design tokens)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend/Auth**: Firebase (Auth, Firestore)
- **Graphics**: HTML5 Canvas API

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd greetings-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase**:
   Create a `.env` file in the root directory and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

## How Image Overlay Works

The core of the personalization engine lies in the `useCanvas` hook, which leverages the **HTML5 Canvas API** to perform client-side image manipulation. When a user selects a template, the app initializes an off-screen canvas. 

The drawing process follows a strict layering order: first, the high-resolution background template is rendered to fill the canvas. Next, a semi-transparent black overlay is drawn at the top to create a "glassmorphism" name banner, ensuring text legibility. The user's name is then centered within this banner using custom typography settings. Simultaneously, the user's profile picture is fetched, clipped into a circular path, and rendered with a high-contrast stroke border. 

This entire composition is converted into a high-quality PNG data URL using `canvas.toDataURL()`. This approach eliminates the need for server-side image processing, ensuring zero latency for the user and enabling instant downloads or sharing via the Web Share API.
