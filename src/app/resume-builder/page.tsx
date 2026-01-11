'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, GripVertical } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { EditorPanel } from '@/components/editor';
import { PreviewPanel } from '@/components/preview';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import OnboardingTour from '@/components/onboarding/OnboardingTour';

export default function ResumeBuilderPage() {
  const { content, title, setTitle, isDirty, isSaving, updatePersonalInfo, updateSummary, resetResume } = useResumeStore();
  const { user } = useAuthStore();
  const [editorWidth, setEditorWidth] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check URL params for mode
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    
    if (mode === 'scratch') {
      // Reset to empty resume
      resetResume();
    } else if (mode === 'import') {
      // Load imported data
      const importedData = localStorage.getItem('imported-resume-data');
      if (importedData) {
        try {
          const data = JSON.parse(importedData);
          if (data.personal) {
            updatePersonalInfo(data.personal);
          }
          if (data.summary) {
            updateSummary(data.summary);
          }
          // Clear the imported data
          localStorage.removeItem('imported-resume-data');
        } catch (error) {
          console.error('Error loading imported data:', error);
        }
      }
    }
    
    // Check if user has seen the tour before
    const hasSeenTour = localStorage.getItem('hasSeenOnboardingTour');
    if (!hasSeenTour && mode !== 'import') {
      // Small delay to let the page render first
      setTimeout(() => setShowOnboarding(true), 500);
    }
  }, []);

  const handleTourComplete = () => {
    localStorage.setItem('hasSeenOnboardingTour', 'true');
    setShowOnboarding(false);
  };

  const handleTourSkip = () => {
    localStorage.setItem('hasSeenOnboardingTour', 'true');
    setShowOnboarding(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      // Constrain between 25% and 75%
      if (newWidth >= 25 && newWidth <= 75) {
        setEditorWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {showOnboarding && (
        <OnboardingTour onComplete={handleTourComplete} onSkip={handleTourSkip} />
      )}
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-base sm:text-lg font-bold text-gray-900 hidden sm:block">
              ResumeAI
            </span>
          </Link>

          <div className="h-5 sm:h-6 w-px bg-gray-200 hidden sm:block" />

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-sm sm:text-lg font-medium text-gray-900 bg-transparent border-none outline-none focus:ring-0 flex-1 min-w-0"
            placeholder="Untitled Resume"
            data-tour="resume-title"
          />

          {isDirty && (
            <span className="text-xs text-gray-400 hidden lg:block flex-shrink-0">
              Unsaved changes
            </span>
          )}
          {isSaving && (
            <span className="text-xs text-blue-500 hidden lg:block flex-shrink-0">
              Saving...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {user ? (
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                <span className="hidden sm:inline">Sign in to save</span>
                <span className="sm:hidden">Sign in</span>
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content - Split View with Resizable Panels */}
      <div ref={containerRef} className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Editor Panel - Left Side / Top on Mobile */}
        <div 
          className="overflow-hidden lg:overflow-auto h-1/2 lg:h-auto"
          style={{ width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${editorWidth}%` : '100%' }}
        >
          <EditorPanel />
        </div>

        {/* Draggable Resizer - Hidden on Mobile */}
        <div
          className={cn(
            'hidden lg:flex w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize items-center justify-center relative group transition-colors',
            isDragging && 'bg-blue-500'
          )}
          onMouseDown={handleMouseDown}
          data-tour="resize-bar"
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
          <div className="w-6 h-12 bg-gray-400 group-hover:bg-blue-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Preview Panel - Right Side / Bottom on Mobile */}
        <div 
          className="overflow-hidden flex-1 h-1/2 lg:h-auto"
        >
          <PreviewPanel />
        </div>
      </div>
    </div>
  );
}
