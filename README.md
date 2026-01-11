# ResumeAI - Professional Resume Builder

A modern, production-ready resume builder web application built with Next.js 16 and Firebase. Features a real-time preview editor similar to Resume.io and Enhancv.

## 👨‍💻 Author & Developer

**BORIS DOUON** - AI Software Engineer

🚀 **Ready to collaborate and help you build your SaaS!**  
I'm passionate about building innovative AI-powered applications and helping entrepreneurs and developers create successful SaaS products. Let's connect and build something amazing together!

📱 **Contact me for collaborations:**
- 📧 **LinkedIn**: [boris-douon](https://www.linkedin.com/in/boris-douon/)
- 💬 **WhatsApp**: +225 07 88 23 36 47
- 🤝 **Open to collaborations**: Let's build your SaaS and get wealthy together!

---

## Features

- **Two-Panel Editor** - Edit on the left, preview in real-time on the right
- **Drag & Drop Sections** - Reorder resume sections with intuitive drag-and-drop
- **Real-Time Preview** - See changes instantly as you type
- **Auto-Save** - Never lose your work with automatic saving
- **Firebase Auth** - Secure authentication with email/password and Google sign-in
- **Dashboard** - Manage multiple resumes with CRUD operations
- **ATS-Friendly Template** - Professional, clean design that passes ATS scans
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Animations**: Framer Motion
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project

### Installation

1. Clone the repository and install dependencies:

```bash
cd resume-builder
npm install
```

2. Set up Firebase:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password and Google providers)
   - Create a Firestore database
   - Copy your Firebase config

3. Configure environment variables:

```bash
cp env.example .env.local
```

Edit `.env.local` with your Firebase credentials:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /resumes/{resumeId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── dashboard/         # Protected dashboard routes
│   ├── resume-builder/    # Public resume builder
│   └── page.tsx           # Landing page
├── components/
│   ├── editor/            # Resume editor components
│   ├── preview/           # Preview panel components
│   ├── templates/         # Resume templates
│   ├── layout/            # Layout components
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and Firebase config
├── store/                 # Zustand stores
└── types/                 # TypeScript types
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Sign in page |
| `/signup` | Create account page |
| `/resume-builder` | Public resume builder (no save) |
| `/dashboard` | User's resumes list |
| `/dashboard/resume/[id]` | Edit specific resume |

## ✨ Features Implemented

- [x] Multiple resume templates (Modern, Classic)
- [x] PDF export with high-quality rendering
- [x] AI writing assistance with Google Gemini
- [x] PDF import with text extraction
- [x] Resume sharing capabilities
- [x] Import from LinkedIn (planned)

## 🚀 Future Enhancements

- [ ] Cover letter builder
- [ ] More advanced AI features
- [ ] Team collaboration features
- [ ] Analytics dashboard
- [ ] Custom domain support

## Deploy on Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## License

MIT License

---

## 👨‍💻 About the Author

**BORIS DOUON** - AI Software Engineer

🚀 **Ready to collaborate and help you build your SaaS!**  
I'm passionate about building innovative AI-powered applications and helping entrepreneurs and developers create successful SaaS products. Let's connect and build something amazing together!

📱 **Contact me for collaborations:**
- 📧 **LinkedIn**: [boris-douon](https://www.linkedin.com/in/boris-douon/)
- 💬 **WhatsApp**: +225 07 88 23 36 47
- 🤝 **Open to collaborations**: Let's build your SaaS and get wealthy together!

*Built with ❤️ and cutting-edge AI technology*
