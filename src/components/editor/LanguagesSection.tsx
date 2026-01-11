'use client';

import { Globe, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui';
import { useResumeStore } from '@/store/useResumeStore';
import SectionWrapper, { DragHandle } from './SectionWrapper';
import { Language } from '@/types/resume';
import { cn } from '@/lib/utils';

const proficiencyLevels: { value: Language['proficiency']; label: string; width: string }[] = [
  { value: 'basic', label: 'Basic', width: '20%' },
  { value: 'intermediate', label: 'Intermediate', width: '40%' },
  { value: 'advanced', label: 'Advanced', width: '60%' },
  { value: 'fluent', label: 'Fluent', width: '80%' },
  { value: 'native', label: 'Native', width: '100%' },
];

export default function LanguagesSection() {
  const { content, addLanguage, updateLanguage, removeLanguage } = useResumeStore();
  const { languages } = content;

  const getProficiencyInfo = (proficiency: Language['proficiency']) => {
    return proficiencyLevels.find((l) => l.value === proficiency) || proficiencyLevels[2];
  };

  return (
    <SectionWrapper
      id="languages"
      title="Languages"
      subtitle="Add languages you speak"
      icon={<Globe className="w-5 h-5" />}
    >
      <div className="space-y-4">
        {languages.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
            <Globe className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-3">No languages added yet</p>
            <button
              onClick={addLanguage}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Language
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {languages.map((language) => (
              <div
                key={language.id}
                className="group flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                  <DragHandle />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Language"
                      placeholder="English"
                      value={language.name}
                      onChange={(e) =>
                        updateLanguage(language.id, { name: e.target.value })
                      }
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Proficiency
                      </label>
                      <select
                        value={language.proficiency}
                        onChange={(e) =>
                          updateLanguage(language.id, {
                            proficiency: e.target.value as Language['proficiency'],
                          })
                        }
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {proficiencyLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Proficiency Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">Level</span>
                      <span className="text-xs font-medium text-gray-700">
                        {getProficiencyInfo(language.proficiency).label}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                        style={{ width: getProficiencyInfo(language.proficiency).width }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeLanguage(language.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button
              onClick={addLanguage}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Add one more language</span>
            </button>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
