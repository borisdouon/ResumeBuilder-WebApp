'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { Input, Button, Textarea } from '@/components/ui';
import SectionWrapper from './SectionWrapper';

export default function AwardsSection() {
  const { content, addAward, updateAward, removeAward } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const awards = content.awards || [];

  const handleAddAward = () => {
    addAward();
    const newAward = content.awards[content.awards.length];
    if (newAward) {
      setExpandedId(newAward.id);
    }
  };

  return (
    <SectionWrapper id="awards" title="Honors & Awards">
      <div className="space-y-4">
        {awards.map((award) => (
          <div
            key={award.id}
            className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <Input
                  label="Award Title"
                  value={award.title}
                  onChange={(e) => updateAward(award.id, { title: e.target.value })}
                  placeholder="e.g., Employee of the Year"
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Issuer / Organization"
                    value={award.issuer}
                    onChange={(e) => updateAward(award.id, { issuer: e.target.value })}
                    placeholder="e.g., Company Name"
                  />
                  <Input
                    label="Date"
                    type="month"
                    value={award.date}
                    onChange={(e) => updateAward(award.id, { date: e.target.value })}
                  />
                </div>

                <Textarea
                  label="Description (optional)"
                  value={award.description || ''}
                  onChange={(e) => updateAward(award.id, { description: e.target.value })}
                  placeholder="Brief description of the achievement..."
                  rows={2}
                />
              </div>

              <button
                onClick={() => removeAward(award.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove award"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={handleAddAward} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Award
        </Button>
      </div>
    </SectionWrapper>
  );
}
