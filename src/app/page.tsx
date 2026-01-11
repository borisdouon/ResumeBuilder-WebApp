'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, Sparkles, Zap, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout';
import ImportResumeDialog from '@/components/dialogs/ImportResumeDialog';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Content',
    description: 'Get intelligent suggestions for your resume content that highlight your achievements.',
  },
  {
    icon: Zap,
    title: 'Real-Time Preview',
    description: 'See your changes instantly with our live preview editor. No waiting, no guessing.',
  },
  {
    icon: Shield,
    title: 'ATS-Friendly',
    description: 'Our templates are designed to pass Applicant Tracking Systems with ease.',
  },
];

const steps = [
  { number: '01', title: 'Choose a Template', description: 'Start with a professional, ATS-optimized template.' },
  { number: '02', title: 'Fill Your Details', description: 'Add your experience, education, and skills easily.' },
  { number: '03', title: 'Download & Apply', description: 'Export your resume as PDF and start applying.' },
];

export default function Home() {
  const router = useRouter();
  const [showImportDialog, setShowImportDialog] = useState(false);

  const handleStartFromScratch = () => {
    // Clear any existing resume data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('resume-store');
    }
    router.push('/resume-builder?mode=scratch');
  };

  const handleImportComplete = (data: any) => {
    // Store imported data temporarily
    if (typeof window !== 'undefined') {
      localStorage.setItem('imported-resume-data', JSON.stringify(data));
    }
    router.push('/resume-builder?mode=import');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <ImportResumeDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onStartFromScratch={handleStartFromScratch}
        onImportComplete={handleImportComplete}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-20 pb-16 sm:pt-28 sm:pb-20 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/20 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center lg:text-left lg:max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs sm:text-sm mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>AI-Powered Resume Builder</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Build a Resume That
              <span className="block text-blue-200">Gets You Hired</span>
            </h1>
            
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-blue-100 max-w-xl mx-auto lg:mx-0">
              Create professional, ATS-friendly resumes in minutes. Our intuitive builder 
              and real-time preview make resume creation effortless.
            </p>
            
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <button
                onClick={() => setShowImportDialog(true)}
                className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Build Your Resume
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-sm sm:text-base"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-8 sm:mt-12 flex flex-wrap items-center gap-4 sm:gap-8 justify-center lg:justify-start text-white/80 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <span>ATS-optimized</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative resume preview */}
        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[650px] bg-white rounded-l-2xl shadow-2xl transform rotate-3 opacity-90">
          <div className="p-8">
            <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
            <div className="h-4 w-32 bg-gray-100 rounded mb-8" />
            <div className="space-y-3">
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-5/6 bg-gray-100 rounded" />
              <div className="h-3 w-4/6 bg-gray-100 rounded" />
            </div>
            <div className="mt-8 h-4 w-24 bg-blue-100 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-5/6 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 px-4">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Our resume builder is packed with features to help you create the perfect resume.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 px-4">
              Create Your Resume in 3 Easy Steps
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-blue-100" />
                )}
                <div className="relative bg-white p-6 sm:p-8 rounded-2xl border border-gray-100">
                  <div className="text-4xl sm:text-5xl font-bold text-blue-100 mb-3 sm:mb-4">{step.number}</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 px-4">
            Ready to Build Your Perfect Resume?
          </h2>
          <p className="text-base sm:text-lg text-blue-100 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
            Join thousands of job seekers who have landed their dream jobs with our resume builder.
          </p>
          <button
            onClick={() => setShowImportDialog(true)}
            className="inline-flex items-center justify-center px-8 py-3 sm:px-10 sm:py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-lg text-base sm:text-lg"
          >
            Start Building Now
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">ResumeAI</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm">
              <Link href="/resume-builder" className="hover:text-white transition-colors">
                Resume Builder
              </Link>
              <Link href="/login" className="hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/signup" className="hover:text-white transition-colors">
                Sign Up
              </Link>
            </div>
            <p className="text-xs sm:text-sm text-center">
              © {new Date().getFullYear()} ResumeAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
