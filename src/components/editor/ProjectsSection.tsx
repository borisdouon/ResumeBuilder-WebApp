'use client';

import { useState } from 'react';
import { FolderGit2, Plus, Trash2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Textarea } from '@/components/ui';
import { useResumeStore } from '@/store/useResumeStore';
import { Project } from '@/types/resume';
import SectionWrapper, { DragHandle } from './SectionWrapper';
import { cn } from '@/lib/utils';

function ProjectItem({ project, index }: { project: Project; index: number }) {
  const { updateProject, removeProject } = useResumeStore();
  const [isExpanded, setIsExpanded] = useState(true);

  const title = project.name || `Project ${index + 1}`;

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{title}</h4>
          {project.role && <p className="text-sm text-gray-500 truncate">{project.role}</p>}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            removeProject(project.id);
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
                  label="Project Name"
                  placeholder="E-commerce Platform"
                  value={project.name}
                  onChange={(e) => updateProject(project.id, { name: e.target.value })}
                />
                <Input
                  label="Your Role (optional)"
                  placeholder="Lead Developer"
                  value={project.role || ''}
                  onChange={(e) => updateProject(project.id, { role: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="month"
                  value={project.startDate}
                  onChange={(e) => updateProject(project.id, { startDate: e.target.value })}
                />
                <div>
                  <Input
                    label="End Date"
                    type="month"
                    value={project.endDate || ''}
                    disabled={project.current}
                    onChange={(e) => updateProject(project.id, { endDate: e.target.value })}
                  />
                  <label className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={project.current}
                      onChange={(e) =>
                        updateProject(project.id, {
                          current: e.target.checked,
                          endDate: e.target.checked ? '' : project.endDate,
                        })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Currently working on this
                  </label>
                </div>
              </div>

              <Input
                label="Project URL (optional)"
                placeholder="https://github.com/username/project"
                value={project.url || ''}
                onChange={(e) => updateProject(project.id, { url: e.target.value })}
              />

              <Textarea
                label="Description"
                placeholder="Describe the project, your contributions, and impact..."
                value={project.description}
                onChange={(e) => updateProject(project.id, { description: e.target.value })}
                rows={4}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProjectsSection() {
  const { content, addProject } = useResumeStore();

  return (
    <SectionWrapper
      id="projects"
      title="Projects"
      subtitle="Showcase your work and achievements"
      icon={<FolderGit2 className="w-5 h-5" />}
    >
      <div className="space-y-4">
        {content.projects.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
            <FolderGit2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-3">No projects added yet</p>
            <button
              onClick={addProject}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {content.projects.map((project, index) => (
                <ProjectItem key={project.id} project={project} index={index} />
              ))}
            </div>

            <button
              onClick={addProject}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Add one more project</span>
            </button>
          </>
        )}
      </div>
    </SectionWrapper>
  );
}
