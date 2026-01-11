'use client';

import { useState } from 'react';
import { GraduationCap, Plus, Trash2, ChevronDown } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Button, Textarea, DatePicker } from '@/components/ui';
import { useResumeStore } from '@/store/useResumeStore';
import { Education } from '@/types/resume';
import SectionWrapper, { DragHandle } from './SectionWrapper';
import { cn } from '@/lib/utils';

function EducationItem({ education, index }: { education: Education; index: number }) {
  const { updateEducation, removeEducation } = useResumeStore();
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: education.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const title = education.degree && education.field
    ? `${education.degree} in ${education.field}`
    : education.school || `Education ${index + 1}`;
  const subtitle = education.degree && education.field ? education.school : '';

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
            removeEducation(education.id);
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
              <div className="pt-4">
                <Input
                  label="School / University"
                  placeholder="Harvard University"
                  value={education.school}
                  onChange={(e) =>
                    updateEducation(education.id, { school: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Degree"
                  placeholder="Bachelor's"
                  value={education.degree}
                  onChange={(e) =>
                    updateEducation(education.id, { degree: e.target.value })
                  }
                />
                <Input
                  label="Field of Study"
                  placeholder="Computer Science"
                  value={education.field}
                  onChange={(e) =>
                    updateEducation(education.id, { field: e.target.value })
                  }
                />
              </div>

              <Input
                label="Location"
                placeholder="Cambridge, MA"
                value={education.location || ''}
                onChange={(e) =>
                  updateEducation(education.id, { location: e.target.value })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <DatePicker
                  label="Start Date"
                  value={education.startDate}
                  onChange={(e) =>
                    updateEducation(education.id, { startDate: e.target.value })
                  }
                />
                <div>
                  <DatePicker
                    label="End Date"
                    value={education.endDate || ''}
                    disabled={education.current}
                    onChange={(e) =>
                      updateEducation(education.id, { endDate: e.target.value })
                    }
                  />
                  <label className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={education.current}
                      onChange={(e) =>
                        updateEducation(education.id, {
                          current: e.target.checked,
                          endDate: e.target.checked ? '' : education.endDate,
                        })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Currently studying here
                  </label>
                </div>
              </div>

              <Input
                label="GPA (optional)"
                placeholder="3.8 / 4.0"
                value={education.gpa || ''}
                onChange={(e) =>
                  updateEducation(education.id, { gpa: e.target.value })
                }
              />

              <Textarea
                label="Description (optional)"
                placeholder="Relevant coursework, achievements, activities..."
                value={education.description || ''}
                onChange={(e) =>
                  updateEducation(education.id, { description: e.target.value })
                }
                rows={3}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function EducationSection() {
  const { content, addEducation, reorderEducation } = useResumeStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = content.education.findIndex((e) => e.id === active.id);
      const newIndex = content.education.findIndex((e) => e.id === over.id);
      reorderEducation(oldIndex, newIndex);
    }
  };

  return (
    <SectionWrapper
      id="education"
      title="Education"
      subtitle="A varied education on your resume adds value"
      icon={<GraduationCap className="w-5 h-5" />}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Include your most recent educational achievements and relevant certifications.
        </p>

        {content.education.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
            <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-3">No education added yet</p>
            <button
              onClick={addEducation}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Education
            </button>
          </div>
        ) : (
          <>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext
                items={content.education.map((e) => e.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {content.education.map((edu, index) => (
                    <EducationItem key={edu.id} education={edu} index={index} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <button
              onClick={addEducation}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Add one more education</span>
            </button>
          </>
        )}
      </div>
    </SectionWrapper>
  );
}
