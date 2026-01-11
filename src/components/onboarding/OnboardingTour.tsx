'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, Menu, ZoomIn, Plus, Edit3, Check, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const tourSteps = [
  {
    id: 'welcome',
    title: 'Welcome to ResumeAI',
    description: 'Let\'s take a quick tour to help you get started. This will only take 30 seconds.',
    position: 'center',
    highlightSelector: null,
  },
  {
    id: 'sidebar',
    title: 'Toggle Sidebar',
    description: 'Click the burger menu to hide/show the sidebar and get more editing space.',
    position: 'left',
    highlightSelector: '[data-tour="burger-menu"]',
    icon: Menu,
  },
  {
    id: 'resize',
    title: 'Resize Editor & Preview',
    description: 'Drag the vertical bar between editor and preview to adjust their sizes to your preference.',
    position: 'left',
    highlightSelector: '[data-tour="resize-bar"]',
    icon: GripVertical,
  },
  {
    id: 'zoom',
    title: 'Zoom Preview',
    description: 'Use zoom controls to magnify or reduce the resume preview size.',
    position: 'right',
    highlightSelector: '[data-tour="zoom-controls"]',
    icon: ZoomIn,
  },
  {
    id: 'sections',
    title: 'Add More Sections',
    description: 'Click "Add Section" to include additional sections like Awards, Volunteer Experience, and more.',
    position: 'right',
    highlightSelector: '[data-tour="add-section"]',
    icon: Plus,
  },
  {
    id: 'title',
    title: 'Edit Resume Title',
    description: 'Click on the title at the top to rename your resume project.',
    position: 'top',
    highlightSelector: '[data-tour="resume-title"]',
    icon: Edit3,
  },
  {
    id: 'complete',
    title: 'You\'re All Set',
    description: 'You\'re ready to create an amazing resume. Start editing and watch the live preview update in real-time!',
    position: 'center',
    highlightSelector: null,
    icon: Check,
  },
];

export default function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const step = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;
  const isCenterStep = step.position === 'center';

  useEffect(() => {
    // Highlight the current element
    if (step.highlightSelector) {
      const element = document.querySelector(step.highlightSelector);
      if (element) {
        element.classList.add('tour-highlight');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // Cleanup previous highlights
    return () => {
      document.querySelectorAll('.tour-highlight').forEach((el) => {
        el.classList.remove('tour-highlight');
      });
    };
  }, [currentStep, step.highlightSelector]);

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const getTooltipStyle = (): React.CSSProperties => {
    if (isCenterStep) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const element = step.highlightSelector
      ? document.querySelector(step.highlightSelector)
      : null;

    if (!element) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const rect = element.getBoundingClientRect();
    const tooltipWidth = 448; // max-w-md = 28rem = 448px
    const tooltipHeight = 250; // approximate height
    const margin = 20;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let style: React.CSSProperties = {
      position: 'fixed',
    };

    switch (step.position) {
      case 'left': {
        // Position to the left of element
        const preferredRight = viewportWidth - rect.left + margin + 20;
        const preferredTop = rect.top + rect.height / 2;
        
        // Check if tooltip would go off-screen
        const tooltipLeft = viewportWidth - preferredRight - tooltipWidth;
        const tooltipTop = preferredTop - tooltipHeight / 2;
        
        // Adjust horizontal position if needed
        if (tooltipLeft < margin) {
          // Not enough space on left, try centering horizontally
          style.left = `${Math.max(margin, (viewportWidth - tooltipWidth) / 2)}px`;
        } else {
          style.right = `${preferredRight}px`;
        }
        
        // Adjust vertical position if needed
        if (tooltipTop < margin) {
          style.top = `${margin}px`;
        } else if (tooltipTop + tooltipHeight > viewportHeight - margin) {
          style.bottom = `${margin}px`;
        } else {
          style.top = `${preferredTop}px`;
          style.transform = 'translateY(-50%)';
        }
        break;
      }
      case 'right': {
        // Position to the right of element
        const preferredLeft = rect.right + margin + 30;
        const preferredTop = rect.top + rect.height / 2;
        
        // Check if tooltip would go off-screen
        const tooltipTop = preferredTop - tooltipHeight / 2;
        
        // Adjust horizontal position if needed
        if (preferredLeft + tooltipWidth > viewportWidth - margin) {
          // Not enough space on right, try centering horizontally
          style.left = `${Math.max(margin, (viewportWidth - tooltipWidth) / 2)}px`;
        } else {
          style.left = `${preferredLeft}px`;
        }
        
        // Adjust vertical position if needed
        if (tooltipTop < margin) {
          style.top = `${margin}px`;
        } else if (tooltipTop + tooltipHeight > viewportHeight - margin) {
          style.bottom = `${margin}px`;
        } else {
          style.top = `${preferredTop}px`;
          style.transform = 'translateY(-50%)';
        }
        break;
      }
      case 'top': {
        // Position above element
        const preferredBottom = viewportHeight - rect.top + margin;
        const preferredLeft = rect.left + rect.width / 2;
        
        // Check if tooltip would go off-screen
        const tooltipLeft = preferredLeft - tooltipWidth / 2;
        
        // Adjust horizontal position if needed
        if (tooltipLeft < margin) {
          style.left = `${margin}px`;
        } else if (tooltipLeft + tooltipWidth > viewportWidth - margin) {
          style.right = `${margin}px`;
        } else {
          style.left = `${preferredLeft}px`;
          style.transform = 'translateX(-50%)';
        }
        
        // Adjust vertical position if needed
        if (preferredBottom + tooltipHeight > viewportHeight - margin) {
          // Not enough space above, position below
          style.top = `${rect.bottom + margin}px`;
        } else {
          style.bottom = `${preferredBottom}px`;
        }
        break;
      }
      default:
        return {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
    }

    return style;
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[100] animate-in fade-in duration-300" />

      {/* Tooltip Card */}
      <div
        className={cn(
          'z-[101] w-full max-w-md mx-4',
          isAnimating && 'opacity-0',
          !isAnimating && 'animate-in duration-300'
        )}
        style={getTooltipStyle()}
      >
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-500 overflow-hidden mx-4">
          {/* Progress Bar */}
          <div className="h-1 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
            />
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Icon */}
            {step.icon && !isCenterStep && (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                <step.icon className="w-6 h-6 text-white" />
              </div>
            )}

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {step.description}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {tourSteps.map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300',
                      idx === currentStep
                        ? 'w-8 bg-blue-500'
                        : idx < currentStep
                        ? 'w-1.5 bg-blue-500'
                        : 'w-1.5 bg-gray-300'
                    )}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {!isLastStep && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                  >
                    Skip Tour
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNext}
                  className="group"
                >
                  {isLastStep ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Get Started
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Pointer Arrow for non-center steps */}
        {!isCenterStep && step.highlightSelector && (
          <div
            className={cn(
              'absolute w-0 h-0',
              step.position === 'left' && step.id === 'sidebar' && 'top-1/2 -translate-y-1/2 -right-3 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[12px] border-l-white',
              step.position === 'left' && step.id === 'resize' && 'top-1/2 -translate-y-1/2 -right-3 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[12px] border-l-white',
              step.position === 'right' && step.id === 'zoom' && 'top-1/2 -translate-y-1/2 -left-3 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[12px] border-r-white',
              step.position === 'right' && step.id === 'sections' && 'top-1/2 -translate-y-1/2 -left-3 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[12px] border-r-white',
              step.position === 'top' && '-bottom-3 left-1/2 -translate-x-1/2 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white'
            )}
          />
        )}
      </div>

      {/* Skip button in corner */}
      <button
        onClick={handleSkip}
        className="fixed top-4 right-4 z-[102] p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors"
        title="Skip tour"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Inject tour highlight styles */}
      <style jsx global>{`
        .tour-highlight {
          position: relative;
          z-index: 101;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5),
                      0 0 0 8px rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          animation: pulse-highlight 2s ease-in-out infinite;
        }

        @keyframes pulse-highlight {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5),
                        0 0 0 8px rgba(59, 130, 246, 0.2);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.8),
                        0 0 0 12px rgba(59, 130, 246, 0.3);
          }
        }
      `}</style>
    </>
  );
}
