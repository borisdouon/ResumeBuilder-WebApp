'use client';

import { useState } from 'react';
import { Award, Plus, Trash2, ChevronDown } from 'lucide-react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Textarea } from '@/components/ui';
import { useResumeStore } from '@/store/useResumeStore';
import { Certification } from '@/types/resume';
import SectionWrapper, { DragHandle } from './SectionWrapper';
import { cn } from '@/lib/utils';

function CertificationItem({ cert, index }: { cert: Certification; index: number }) {
  const { updateCertification, removeCertification } = useResumeStore();
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cert.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const title = cert.name || `Certification ${index + 1}`;

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
          {cert.issuer && (
            <p className="text-sm text-gray-500 truncate">{cert.issuer}</p>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            removeCertification(cert.id);
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
                  label="Certification Name"
                  placeholder="AWS Certified Solutions Architect"
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                />
                <Input
                  label="Issuing Organization"
                  placeholder="Amazon Web Services"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Issue Date"
                  type="month"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                />
                <Input
                  label="Expiry Date (optional)"
                  type="month"
                  value={cert.expiryDate || ''}
                  onChange={(e) => updateCertification(cert.id, { expiryDate: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Credential ID (optional)"
                  placeholder="ABC123456"
                  value={cert.credentialId || ''}
                  onChange={(e) => updateCertification(cert.id, { credentialId: e.target.value })}
                />
                <Input
                  label="Credential URL (optional)"
                  placeholder="https://..."
                  value={cert.url || ''}
                  onChange={(e) => updateCertification(cert.id, { url: e.target.value })}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CertificationsSection() {
  const { content, addCertification } = useResumeStore();

  return (
    <SectionWrapper
      id="certifications"
      title="Certifications"
      subtitle="Professional certifications and licenses"
      icon={<Award className="w-5 h-5" />}
    >
      <div className="space-y-4">
        {content.certifications.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
            <Award className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-3">No certifications added yet</p>
            <button
              onClick={addCertification}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Certification
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {content.certifications.map((cert, index) => (
                <CertificationItem key={cert.id} cert={cert} index={index} />
              ))}
            </div>

            <button
              onClick={addCertification}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Add one more certification</span>
            </button>
          </>
        )}
      </div>
    </SectionWrapper>
  );
}
