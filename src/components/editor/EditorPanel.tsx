'use client';

import { useState, useRef } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Menu, X } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import PersonalSection from './PersonalSection';
import SummarySection from './SummarySection';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import SkillsSection from './SkillsSection';
import LinksSection from './LinksSection';
import LanguagesSection from './LanguagesSection';
import CertificationsSection from './CertificationsSection';
import ProjectsSection from './ProjectsSection';
import AwardsSection from './AwardsSection';
import VolunteerSection from './VolunteerSection';
import CoursesSection from './CoursesSection';
import ReferencesSection from './ReferencesSection';
import HobbiesSection from './HobbiesSection';
import PublicationsSection from './PublicationsSection';
import EditorSidebar from './EditorSidebar';
import { cn } from '@/lib/utils';

const sectionComponents: Record<string, React.ComponentType> = {
  personal: PersonalSection,
  summary: SummarySection,
  experience: ExperienceSection,
  education: EducationSection,
  skills: SkillsSection,
  links: LinksSection,
  languages: LanguagesSection,
  certifications: CertificationsSection,
  projects: ProjectsSection,
  awards: AwardsSection,
  volunteer: VolunteerSection,
  courses: CoursesSection,
  references: ReferencesSection,
  hobbies: HobbiesSection,
  publications: PublicationsSection,
};

export default function EditorPanel() {
  const { content, reorderSections } = useResumeStore();
  const [activeSection, setActiveSection] = useState('personal');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = content.sectionOrder.indexOf(active.id as string);
      const newIndex = content.sectionOrder.indexOf(over.id as string);
      
      const newOrder = [...content.sectionOrder];
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, active.id as string);
      
      reorderSections(newOrder);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(`section-${sectionId}`);
    if (element && containerRef.current) {
      const containerTop = containerRef.current.getBoundingClientRect().top;
      const elementTop = element.getBoundingClientRect().top;
      const offset = elementTop - containerTop - 20;
      containerRef.current.scrollBy({ top: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-full flex bg-gray-50 relative">
      {/* Sidebar */}
      <div className={cn(
        'transition-all duration-300 ease-in-out',
        sidebarOpen ? 'w-56' : 'w-0'
      )}>
        <EditorSidebar
          activeSection={activeSection}
          onSectionClick={scrollToSection}
          sectionOrder={content.sectionOrder}
          isOpen={sidebarOpen}
        />
      </div>

      {/* Main Editor Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header with Burger Menu */}
        <div className="flex items-center gap-3 px-6 py-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
            title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            data-tour="burger-menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Edit Your Resume</h1>
            <p className="text-sm text-gray-500">
              Fill in your details below. Drag sections to reorder them.
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-y-auto"
        >
          <div className="max-w-3xl mx-auto p-6 space-y-4">
            {/* Sections */}
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext
                items={content.sectionOrder}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-5">
                  {content.sectionOrder.map((sectionId) => {
                    const Component = sectionComponents[sectionId];
                    if (!Component) return null;
                    return <Component key={sectionId} />;
                  })}
                </div>
              </SortableContext>
            </DndContext>

            {/* Bottom Spacing */}
            <div className="h-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
