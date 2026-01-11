'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { Input, Button } from '@/components/ui';
import SectionWrapper from './SectionWrapper';

export default function ReferencesSection() {
  const { content, addReference, updateReference, removeReference } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const references = content.references || [];

  const handleAddReference = () => {
    addReference();
    const newReference = content.references[content.references.length];
    if (newReference) {
      setExpandedId(newReference.id);
    }
  };

  return (
    <SectionWrapper id="references" title="References">
      <div className="space-y-4">
        {references.map((ref) => (
          <div
            key={ref.id}
            className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <Input
                  label="Full Name"
                  value={ref.name}
                  onChange={(e) => updateReference(ref.id, { name: e.target.value })}
                  placeholder="e.g., John Doe"
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Position"
                    value={ref.position}
                    onChange={(e) => updateReference(ref.id, { position: e.target.value })}
                    placeholder="e.g., Senior Manager"
                  />
                  <Input
                    label="Company"
                    value={ref.company}
                    onChange={(e) => updateReference(ref.id, { company: e.target.value })}
                    placeholder="e.g., Company Name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Email"
                    type="email"
                    value={ref.email}
                    onChange={(e) => updateReference(ref.id, { email: e.target.value })}
                    placeholder="reference@email.com"
                  />
                  <Input
                    label="Phone (optional)"
                    type="tel"
                    value={ref.phone || ''}
                    onChange={(e) => updateReference(ref.id, { phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <button
                onClick={() => removeReference(ref.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove reference"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={handleAddReference} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Reference
        </Button>
      </div>
    </SectionWrapper>
  );
}
