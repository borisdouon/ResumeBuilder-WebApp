'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { Input, Button, Textarea } from '@/components/ui';
import SectionWrapper from './SectionWrapper';

export default function PublicationsSection() {
  const { content, addPublication, updatePublication, removePublication } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const publications = content.publications || [];

  const handleAddPublication = () => {
    addPublication();
    const newPublication = content.publications[content.publications.length];
    if (newPublication) {
      setExpandedId(newPublication.id);
    }
  };

  return (
    <SectionWrapper id="publications" title="Publications">
      <div className="space-y-4">
        {publications.map((pub) => (
          <div
            key={pub.id}
            className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <Input
                  label="Publication Title"
                  value={pub.title}
                  onChange={(e) => updatePublication(pub.id, { title: e.target.value })}
                  placeholder="e.g., Research Paper Title"
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Publisher / Journal"
                    value={pub.publisher}
                    onChange={(e) => updatePublication(pub.id, { publisher: e.target.value })}
                    placeholder="e.g., IEEE, Nature"
                  />
                  <Input
                    label="Publication Date"
                    type="month"
                    value={pub.date}
                    onChange={(e) => updatePublication(pub.id, { date: e.target.value })}
                  />
                </div>

                <Input
                  label="Authors (optional)"
                  value={pub.authors || ''}
                  onChange={(e) => updatePublication(pub.id, { authors: e.target.value })}
                  placeholder="e.g., John Doe, Jane Smith"
                />

                <Input
                  label="URL (optional)"
                  type="url"
                  value={pub.url || ''}
                  onChange={(e) => updatePublication(pub.id, { url: e.target.value })}
                  placeholder="https://"
                />

                <Textarea
                  label="Description (optional)"
                  value={pub.description || ''}
                  onChange={(e) => updatePublication(pub.id, { description: e.target.value })}
                  placeholder="Brief description of the publication..."
                  rows={2}
                />
              </div>

              <button
                onClick={() => removePublication(pub.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove publication"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={handleAddPublication} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Publication
        </Button>
      </div>
    </SectionWrapper>
  );
}
