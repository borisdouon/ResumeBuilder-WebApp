'use client';

import { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

interface SectionOption {
  id: string;
  label: string;
  description: string;
  icon: keyof typeof Icons;
  category: 'essential' | 'additional' | 'personal';
}

const availableSections: SectionOption[] = [
  {
    id: 'links',
    label: 'Websites & Social Links',
    description: 'Add your LinkedIn, GitHub, portfolio, and other links',
    icon: 'Link2',
    category: 'essential',
  },
  {
    id: 'languages',
    label: 'Languages',
    description: 'Show the languages you speak and your proficiency level',
    icon: 'Globe',
    category: 'additional',
  },
  {
    id: 'certifications',
    label: 'Certifications',
    description: 'Professional certifications and licenses',
    icon: 'Award',
    category: 'essential',
  },
  {
    id: 'projects',
    label: 'Projects',
    description: 'Personal or professional projects you\'ve worked on',
    icon: 'FolderGit2',
    category: 'essential',
  },
  {
    id: 'awards',
    label: 'Honors & Awards',
    description: 'Recognition and achievements you\'ve received',
    icon: 'Trophy',
    category: 'additional',
  },
  {
    id: 'volunteer',
    label: 'Volunteer Experience',
    description: 'Volunteer work and community service',
    icon: 'Heart',
    category: 'additional',
  },
  {
    id: 'publications',
    label: 'Publications',
    description: 'Research papers, articles, and books you\'ve authored',
    icon: 'BookOpen',
    category: 'additional',
  },
  {
    id: 'courses',
    label: 'Courses & Training',
    description: 'Relevant courses and professional training',
    icon: 'GraduationCap',
    category: 'additional',
  },
  {
    id: 'references',
    label: 'References',
    description: 'Professional references upon request',
    icon: 'Users',
    category: 'additional',
  },
  {
    id: 'hobbies',
    label: 'Hobbies & Interests',
    description: 'Personal interests that showcase your personality',
    icon: 'Palette',
    category: 'personal',
  },
];

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddSectionModal({ isOpen, onClose }: AddSectionModalProps) {
  const { content, addSection } = useResumeStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const addedSections = content.sectionOrder;
  const filteredSections = availableSections.filter(
    (section) =>
      selectedCategory === 'all' || section.category === selectedCategory
  );

  const handleAddSection = (sectionId: string) => {
    addSection(sectionId);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add Section</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Choose sections to add to your resume
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Sections' },
              { id: 'essential', label: 'Essential' },
              { id: 'additional', label: 'Additional' },
              { id: 'personal', label: 'Personal' },
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sections Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredSections.map((section) => {
              const isAdded = addedSections.includes(section.id);
              const IconComponent = Icons[section.icon] as React.ComponentType<{ className?: string }>;

              return (
                <button
                  key={section.id}
                  onClick={() => !isAdded && handleAddSection(section.id)}
                  disabled={isAdded}
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all',
                    isAdded
                      ? 'border-green-200 bg-green-50 cursor-default'
                      : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
                  )}
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                      isAdded ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'
                    )}
                  >
                    {isAdded ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={cn(
                        'font-semibold text-sm mb-0.5',
                        isAdded ? 'text-green-900' : 'text-gray-900'
                      )}
                    >
                      {section.label}
                    </h3>
                    <p
                      className={cn(
                        'text-xs line-clamp-2',
                        isAdded ? 'text-green-600' : 'text-gray-500'
                      )}
                    >
                      {isAdded ? 'Already added to your resume' : section.description}
                    </p>
                  </div>
                  {!isAdded && (
                    <Plus className="w-5 h-5 text-blue-600 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
