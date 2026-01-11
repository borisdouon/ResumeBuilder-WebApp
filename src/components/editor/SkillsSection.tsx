'use client';

import { Sparkles, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui';
import { useResumeStore } from '@/store/useResumeStore';
import SectionWrapper from './SectionWrapper';
import { Skill } from '@/types/resume';
import { cn } from '@/lib/utils';

const skillLevels: { value: Skill['level']; label: string; color: string }[] = [
  { value: 'beginner', label: 'Beginner', color: 'bg-gray-200' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-blue-300' },
  { value: 'advanced', label: 'Advanced', color: 'bg-blue-500' },
  { value: 'expert', label: 'Expert', color: 'bg-blue-700' },
];

const suggestedSkills = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
  'Communication', 'Leadership', 'Problem Solving', 'Team Management',
  'Data Analysis', 'Project Management', 'Agile', 'SQL', 'AWS'
];

export default function SkillsSection() {
  const { content, addSkill, updateSkill, removeSkill } = useResumeStore();
  const [newSkill, setNewSkill] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddSkill = (skillName?: string) => {
    const name = skillName || newSkill.trim();
    if (name) {
      addSkill();
      setTimeout(() => {
        const skills = useResumeStore.getState().content.skills;
        const lastSkill = skills[skills.length - 1];
        if (lastSkill) {
          updateSkill(lastSkill.id, { name });
        }
      }, 0);
      setNewSkill('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const existingSkillNames = content.skills.map(s => s.name.toLowerCase());
  const filteredSuggestions = suggestedSkills.filter(
    s => !existingSkillNames.includes(s.toLowerCase()) &&
    (newSkill === '' || s.toLowerCase().includes(newSkill.toLowerCase()))
  );

  return (
    <SectionWrapper
      id="skills"
      title="Skills"
      subtitle="Highlight your top skills and expertise"
      icon={<Sparkles className="w-5 h-5" />}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Choose 5 of the most important skills to show your talents! Make sure they match the keywords of the job listing.
        </p>

        {/* Skills Grid */}
        {content.skills.length > 0 && (
          <div className="grid gap-3">
            {content.skills.map((skill) => (
              <div
                key={skill.id}
                className="group flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                    className="w-full bg-transparent border-none outline-none text-sm font-medium text-gray-900"
                    placeholder="Skill name"
                  />
                </div>

                {/* Level Selector */}
                <div className="flex items-center gap-1">
                  {skillLevels.map((level, idx) => (
                    <button
                      key={level.value}
                      onClick={() => updateSkill(skill.id, { level: level.value })}
                      className={cn(
                        'w-6 h-2 rounded-full transition-all',
                        idx <= skillLevels.findIndex(l => l.value === skill.level)
                          ? 'bg-blue-500'
                          : 'bg-gray-200 hover:bg-gray-300'
                      )}
                      title={level.label}
                    />
                  ))}
                  <span className="ml-2 text-xs text-gray-500 w-20">
                    {skillLevels.find(l => l.value === skill.level)?.label || 'Intermediate'}
                  </span>
                </div>

                <button
                  onClick={() => removeSkill(skill.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Skill Input */}
        <div className="relative">
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill (e.g., JavaScript, Project Management)"
              value={newSkill}
              onChange={(e) => {
                setNewSkill(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="flex-1"
            />
            <button
              onClick={() => handleAddSkill()}
              disabled={!newSkill.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-12 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {filteredSuggestions.slice(0, 6).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleAddSkill(suggestion)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {content.skills.length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
            <Sparkles className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-3">No skills added yet</p>
            <p className="text-xs text-gray-400">Start typing to add your first skill</p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
