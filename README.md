# ResumeAI - Professional Resume Builder

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12-orange)](https://firebase.google.com/)

A cutting-edge, AI-powered resume builder web application that transforms the way professionals create and manage their resumes. Built with modern web technologies and featuring real-time preview, drag-and-drop editing, and intelligent AI assistance.

## 🌟 Live Demo

**Coming Soon** - Deploying to Vercel

## 🚀 What This Project Does

ResumeAI is a comprehensive resume building platform that enables users to:

- **Create Professional Resumes** with modern, ATS-friendly templates
- **Edit in Real-Time** with a split-panel interface (editor + live preview)
- **Import Existing Resumes** from PDF files with AI-powered text extraction
- **Export to Multiple Formats** (PDF, DOCX, TXT) with high-quality rendering
- **Get AI Assistance** for content improvement and optimization
- **Manage Multiple Resumes** with secure cloud storage
- **Collaborate and Share** resumes with public links

## 📸 Screenshots & Features

### Main Features Showcase

#### 🎨 Modern Interface
- **Split-panel design** - Edit on the left, preview on the right
- **Drag-and-drop sections** - Reorder resume components intuitively
- **Responsive design** - Works seamlessly on desktop and mobile
- **Dark/light themes** - Comfortable editing experience

#### 🤖 AI-Powered Features
- **Smart text extraction** from PDF imports using advanced OCR
- **Content optimization** with Google Gemini AI
- **Resume scoring** and improvement suggestions
- **Auto-formatting** for professional appearance

#### 📄 Template System
- **Modern Template** - Clean, contemporary design
- **Classic Template** - Traditional, professional layout
- **Custom styling** - Personalized colors and fonts
- **Print-optimized** - Perfect for physical copies

#### 🔐 User Management
- **Firebase Authentication** - Secure login/signup
- **Google OAuth** - One-click authentication
- **Resume Dashboard** - Manage all your resumes
- **Auto-save** - Never lose your work

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

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Modern icon library

### Backend & Services
- **Firebase Firestore** - NoSQL database
- **Firebase Auth** - Authentication service
- **Google Gemini AI** - Content generation and analysis
- **PDF.js** - PDF text extraction
- **html2pdf.js** - PDF generation

### State Management & Tools
- **Zustand** - Lightweight state management
- **@dnd-kit** - Drag and drop functionality
- **React Hook Form** - Form management
- **ESLint & Prettier** - Code quality

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ResumeAI Architecture                    │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Next.js)                                         │
│  ├── App Router                                            │
│  │   ├── Landing Page                                      │
│  │   ├── Authentication (/auth)                            │
│  │   ├── Dashboard (/dashboard)                             │
│  │   └── Resume Builder (/resume-builder)                  │
│  │                                                          │
│  ├── Components                                            │
│  │   ├── Editor Panel (Drag & Drop)                        │
│  │   ├── Preview Panel (Real-time)                         │
│  │   ├── Templates (Modern, Classic)                       │
│  │   └── UI Components (Buttons, Forms, etc.)              │
│  │                                                          │
│  ├── State Management (Zustand)                           │
│  │   ├── Auth Store                                        │
│  │   └── Resume Store                                      │
│  │                                                          │
│  └── Services                                               │
│      ├── Firebase Integration                              │
│      ├── AI Services (Gemini)                              │
│      └── PDF Processing                                     │
├─────────────────────────────────────────────────────────────┤
│  Backend Services                                           │
│  ├── Firebase Auth (Authentication)                        │
│  ├── Firestore (Database)                                  │
│  └── Google Gemini AI (Content Processing)                  │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Patterns

1. **Component-Driven Architecture**
   - Modular, reusable components
   - Clear separation of concerns
   - Type-safe props with TypeScript

2. **State Management Strategy**
   - Zustand for global state
   - Local state for UI interactions
   - Persistent storage with Firebase

3. **API Integration**
   - RESTful patterns with Firebase
   - AI service integration
   - Error handling and retry logic

4. **Performance Optimization**
   - Lazy loading components
   - Optimized PDF generation
   - Efficient state updates

## 👨‍💻 My Personal Contributions

**BORIS DOUON** - AI Software Engineer & Full-Stack Developer

As the sole developer of ResumeAI, I implemented:

### 🎯 Core Features
- **Complete Next.js Application** - Built from scratch with modern architecture
- **AI Integration** - Implemented Google Gemini for intelligent resume parsing
- **PDF Processing** - Created robust PDF import/export functionality
- **Real-time Editor** - Developed split-panel interface with live preview
- **Drag & Drop System** - Implemented intuitive section reordering

### 🛠️ Technical Implementation
- **TypeScript Architecture** - Designed type-safe data structures and interfaces
- **State Management** - Implemented Zustand stores for complex data flow
- **Firebase Integration** - Set up authentication, database, and security rules
- **Component Library** - Created reusable UI components with Tailwind CSS
- **Performance Optimization** - Implemented lazy loading and efficient rendering

### 🎨 Design & UX
- **Modern UI/UX** - Designed professional, user-friendly interface
- **Responsive Design** - Ensured mobile and desktop compatibility
- **Accessibility** - Implemented ARIA labels and keyboard navigation
- **Animation System** - Added smooth transitions with Framer Motion

### 🔧 DevOps & Infrastructure
- **Project Setup** - Configured build tools, linting, and development environment
- **Deployment Pipeline** - Set up production-ready deployment configuration
- **Error Handling** - Implemented comprehensive error boundaries and logging
- **Testing Strategy** - Designed component testing architecture

### 📚 Technical Challenges Solved
1. **PDF Text Extraction** - Overcame PDF.js worker configuration issues
2. **AI Integration** - Successfully integrated Gemini API with proper error handling
3. **State Synchronization** - Managed complex state between editor and preview
4. **Performance** - Optimized PDF generation and real-time updates

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google account (for Firebase)

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/borisdouon/ResumeBuilder-WebApp.git
cd ResumeBuilder-WebApp
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Firebase**
   - Visit [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication (Email/Password + Google)
   - Create Firestore Database
   - Get your configuration keys

4. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

5. **Set up Firestore security rules**
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

6. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Deployment

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

#### Docker
```bash
docker build -t resumeai .
docker run -p 3000:3000 resumeai
```

#### Manual Build
```bash
npm run build
npm start
```

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

## 🚀 Future Improvements

### Short-term (Next 2-4 weeks)
- [ ] **Cover Letter Builder** - Extend platform to cover letters
- [ ] **More Templates** - Add industry-specific templates
- [ ] **Resume Analytics** - Track views and downloads
- [ ] **Collaboration Features** - Real-time editing with comments

### Medium-term (1-3 months)
- [ ] **Advanced AI Features** - Job description matching, skill gap analysis
- [ ] **Team Management** - Multi-user accounts for teams
- [ ] **Custom Domains** - White-label solutions for companies
- [ ] **Mobile App** - React Native companion app

### Long-term (3-6 months)
- [ ] **Enterprise Features** - SSO, advanced analytics, compliance
- [ ] **API Platform** - Public API for third-party integrations
- [ ] **Marketplace** - Template and service marketplace
- [ ] **Internationalization** - Multi-language support

## 🤝 Contributing

I'm open to collaborations! Here's how you can contribute:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Ensure responsive design

## 📞 Contact & Collaboration

**BORIS DOUON** - AI Software Engineer

🚀 **Ready to collaborate and help you build your SaaS!**  
I'm passionate about building innovative AI-powered applications and helping entrepreneurs and developers create successful SaaS products.

📱 **Let's Connect:**
- 📧 **LinkedIn**: [boris-douon](https://www.linkedin.com/in/boris-douon/)
- 💬 **WhatsApp**: +225 07 88 23 36 47
- 📧 **Email**: contact@borisdouon.com
- 🤝 **Open to collaborations**: Let's build your SaaS and get wealthy together!

## ⭐ Show Your Support

If you find this project helpful, please give it a ⭐ on GitHub! It helps others discover the project and encourages me to continue developing amazing features.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ and cutting-edge AI technology by BORIS DOUON*

