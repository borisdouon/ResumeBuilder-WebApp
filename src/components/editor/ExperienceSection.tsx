'use client';

import { useState } from 'react';
import { Briefcase, Plus, Trash2, ChevronDown } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Button, Textarea } from '@/components/ui';
import { useResumeStore } from '@/store/useResumeStore';
import { Experience } from '@/types/resume';
import SectionWrapper, { DragHandle } from './SectionWrapper';
import { cn } from '@/lib/utils';

function ExperienceItem({ experience, index }: { experience: Experience; index: number }) {
  const { updateExperience, removeExperience } = useResumeStore();
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: experience.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const title = experience.role || experience.company || `Experience ${index + 1}`;
  const subtitle = experience.role && experience.company ? experience.company : '';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-gray-50 rounded-xl border border-gray-200 overflow-hidden',
        'transition-all duration-200',
        isDragging && 'shadow-xl z-50 scale-[1.02] opacity-95'
      )}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <DragHandle />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{title}</h4>
          {subtitle && (
            <p className="text-sm text-gray-500 truncate">{subtitle}</p>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            removeExperience(experience.id);
          }}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 pt-4">
                <Input
                  label="Job Title"
                  placeholder="Software Engineer"
                  value={experience.role}
                  onChange={(e) =>
                    updateExperience(experience.id, { role: e.target.value })
                  }
                />
                <Input
                  label="Company"
                  placeholder="Google"
                  value={experience.company}
                  onChange={(e) =>
                    updateExperience(experience.id, { company: e.target.value })
                  }
                />
              </div>

              <Input
                label="Location"
                placeholder="San Francisco, CA"
                value={experience.location || ''}
                onChange={(e) =>
                  updateExperience(experience.id, { location: e.target.value })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="month"
                  value={experience.startDate}
                  onChange={(e) => updateExperience(experience.id, { startDate: e.target.value })}
                />
                <div>
                  <Input
                    label="End Date"
                    type="month"
                    value={experience.endDate || ''}
                    disabled={experience.current}
                    onChange={(e) => updateExperience(experience.id, { endDate: e.target.value })}
                  />
                  <label className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={experience.current}
                      onChange={(e) =>
                        updateExperience(experience.id, {
                          current: e.target.checked,
                          endDate: e.target.checked ? '' : experience.endDate,
                        })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Currently working here
                  </label>
                </div>
              </div>

              <Textarea
                label="Description"
                placeholder="Describe your responsibilities and achievements..."
                value={experience.description}
                onChange={(e) =>
                  updateExperience(experience.id, { description: e.target.value })
                }
                rows={4}
                hint="Use bullet points to highlight key achievements"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ExperienceSection() {
  const { content, addExperience, reorderExperience } = useResumeStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = content.experience.findIndex((e) => e.id === active.id);
      const newIndex = content.experience.findIndex((e) => e.id === over.id);
      reorderExperience(oldIndex, newIndex);
    }
  };

  return (
    <SectionWrapper
      id="experience"
      title="Employment History"
      subtitle="Show your relevant experience"
      icon={<Briefcase className="w-5 h-5" />}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Show your relevant experience (last 10 years). Use bullet points to note your achievements.
        </p>

        {content.experience.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
            <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-3">No experience added yet</p>
            <button
              onClick={addExperience}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Employment
            </button>
          </div>
        ) : (
          <>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext
                items={content.experience.map((e) => e.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {content.experience.map((exp, index) => (
                    <ExperienceItem key={exp.id} experience={exp} index={index} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <button
              onClick={addExperience}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Add one more employment</span>
            </button>
          </>
        )}
      </div>
    </SectionWrapper>
  );
}
