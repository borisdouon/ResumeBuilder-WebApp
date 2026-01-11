'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { Input, Button, Textarea } from '@/components/ui';
import SectionWrapper from './SectionWrapper';

export default function CoursesSection() {
  const { content, addCourse, updateCourse, removeCourse } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const courses = content.courses || [];

  const handleAddCourse = () => {
    addCourse();
    const newCourse = content.courses[content.courses.length];
    if (newCourse) {
      setExpandedId(newCourse.id);
    }
  };

  return (
    <SectionWrapper id="courses" title="Courses & Training">
      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <Input
                  label="Course Name"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, { name: e.target.value })}
                  placeholder="e.g., Advanced Data Science"
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Institution / Provider"
                    value={course.institution}
                    onChange={(e) => updateCourse(course.id, { institution: e.target.value })}
                    placeholder="e.g., Coursera, University Name"
                  />
                  <Input
                    label="Completion Date"
                    type="month"
                    value={course.completionDate}
                    onChange={(e) => updateCourse(course.id, { completionDate: e.target.value })}
                  />
                </div>

                <Textarea
                  label="Description (optional)"
                  value={course.description || ''}
                  onChange={(e) => updateCourse(course.id, { description: e.target.value })}
                  placeholder="Key topics or skills learned..."
                  rows={2}
                />
              </div>

              <button
                onClick={() => removeCourse(course.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove course"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={handleAddCourse} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Button>
      </div>
    </SectionWrapper>
  );
}
