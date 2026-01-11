'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { Input, Button, Textarea } from '@/components/ui';
import SectionWrapper from './SectionWrapper';

export default function VolunteerSection() {
  const { content, addVolunteer, updateVolunteer, removeVolunteer } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const volunteers = content.volunteer || [];

  const handleAddVolunteer = () => {
    addVolunteer();
    const newVolunteer = content.volunteer[content.volunteer.length];
    if (newVolunteer) {
      setExpandedId(newVolunteer.id);
    }
  };

  return (
    <SectionWrapper id="volunteer" title="Volunteer Experience">
      <div className="space-y-4">
        {volunteers.map((vol) => (
          <div
            key={vol.id}
            className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Organization"
                    value={vol.organization}
                    onChange={(e) => updateVolunteer(vol.id, { organization: e.target.value })}
                    placeholder="e.g., Red Cross"
                  />
                  <Input
                    label="Role"
                    value={vol.role}
                    onChange={(e) => updateVolunteer(vol.id, { role: e.target.value })}
                    placeholder="e.g., Volunteer Coordinator"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="month"
                    value={vol.startDate}
                    onChange={(e) => updateVolunteer(vol.id, { startDate: e.target.value })}
                  />
                  <div>
                    <Input
                      label="End Date"
                      type="month"
                      value={vol.endDate || ''}
                      disabled={vol.current}
                      onChange={(e) => updateVolunteer(vol.id, { endDate: e.target.value })}
                    />
                    <label className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={vol.current}
                        onChange={(e) =>
                          updateVolunteer(vol.id, {
                            current: e.target.checked,
                            endDate: e.target.checked ? '' : vol.endDate,
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      Currently volunteer here
                    </label>
                  </div>
                </div>

                <Textarea
                  label="Description"
                  value={vol.description}
                  onChange={(e) => updateVolunteer(vol.id, { description: e.target.value })}
                  placeholder="Describe your volunteer work and impact..."
                  rows={3}
                />
              </div>

              <button
                onClick={() => removeVolunteer(vol.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove volunteer experience"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={handleAddVolunteer} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Volunteer Experience
        </Button>
      </div>
    </SectionWrapper>
  );
}
