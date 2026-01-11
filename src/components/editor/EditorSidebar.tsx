'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  Link2,
  Globe,
  Award,
  FolderGit2,
  Trophy,
  Heart,
  BookOpen,
  Users,
  Palette,
  Plus,
  Minus,
} from 'lucide-react';
import AddSectionModal from './AddSectionModal';
import { useResumeStore } from '@/store/useResumeStore';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  removable: boolean;
}

const allSidebarItems: SidebarItem[] = [
  { id: 'personal', label: 'Personal Details', icon: <User className="w-4 h-4" />, removable: false },
  { id: 'summary', label: 'Professional Summary', icon: <FileText className="w-4 h-4" />, removable: false },
  { id: 'experience', label: 'Employment History', icon: <Briefcase className="w-4 h-4" />, removable: false },
  { id: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4" />, removable: false },
  { id: 'skills', label: 'Skills', icon: <Sparkles className="w-4 h-4" />, removable: false },
  { id: 'links', label: 'Websites & Links', icon: <Link2 className="w-4 h-4" />, removable: true },
  { id: 'languages', label: 'Languages', icon: <Globe className="w-4 h-4" />, removable: true },
  { id: 'certifications', label: 'Certifications', icon: <Award className="w-4 h-4" />, removable: true },
  { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-4 h-4" />, removable: true },
  { id: 'awards', label: 'Honors & Awards', icon: <Trophy className="w-4 h-4" />, removable: true },
  { id: 'volunteer', label: 'Volunteer Experience', icon: <Heart className="w-4 h-4" />, removable: true },
  { id: 'publications', label: 'Publications', icon: <BookOpen className="w-4 h-4" />, removable: true },
  { id: 'courses', label: 'Courses', icon: <GraduationCap className="w-4 h-4" />, removable: true },
  { id: 'references', label: 'References', icon: <Users className="w-4 h-4" />, removable: true },
  { id: 'hobbies', label: 'Hobbies & Interests', icon: <Palette className="w-4 h-4" />, removable: true },
];

interface EditorSidebarProps {
  activeSection: string;
  onSectionClick: (id: string) => void;
  sectionOrder: string[];
  isOpen: boolean;
}

export default function EditorSidebar({
  activeSection,
  onSectionClick,
  sectionOrder,
  isOpen,
}: EditorSidebarProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const { removeSection } = useResumeStore();

  const visibleItems = allSidebarItems.filter((item) =>
    sectionOrder.includes(item.id)
  );

  if (!isOpen) return null;

  return (
    <>
      <div className="w-full h-full flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Sections
          </h3>
          <nav className="space-y-1">
            {visibleItems.map((item) => (
              <div key={item.id} className="group relative">
                <button
                  onClick={() => onSectionClick(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <span
                    className={cn(
                      'transition-colors',
                      activeSection === item.id ? 'text-blue-600' : 'text-gray-400'
                    )}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.removable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSection(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                      title="Remove section"
                    >
                      <Minus className="w-3 h-3 text-red-500" />
                    </button>
                  )}
                </button>
              </div>
            ))}
          </nav>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <button 
              onClick={() => setShowAddModal(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
              data-tour="add-section"
            >
              <Plus className="w-4 h-4" />
              Add Section
            </button>
          </div>
        </div>
      </div>

      <AddSectionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </>
  );
}
