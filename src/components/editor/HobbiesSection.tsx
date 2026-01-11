'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { Input, Button, Textarea } from '@/components/ui';
import SectionWrapper from './SectionWrapper';

export default function HobbiesSection() {
  const { content, addHobby, updateHobby, removeHobby } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const hobbies = content.hobbies || [];

  const handleAddHobby = () => {
    addHobby();
    const newHobby = content.hobbies[content.hobbies.length];
    if (newHobby) {
      setExpandedId(newHobby.id);
    }
  };

  return (
    <SectionWrapper id="hobbies" title="Hobbies & Interests">
      <div className="space-y-4">
        {hobbies.map((hobby) => (
          <div
            key={hobby.id}
            className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <Input
                  label="Hobby / Interest"
                  value={hobby.name}
                  onChange={(e) => updateHobby(hobby.id, { name: e.target.value })}
                  placeholder="e.g., Photography, Hiking, Coding"
                />

                <Textarea
                  label="Description (optional)"
                  value={hobby.description || ''}
                  onChange={(e) => updateHobby(hobby.id, { description: e.target.value })}
                  placeholder="Brief description of your interest..."
                  rows={2}
                />
              </div>

              <button
                onClick={() => removeHobby(hobby.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove hobby"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={handleAddHobby} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Hobby / Interest
        </Button>
      </div>
    </SectionWrapper>
  );
}
