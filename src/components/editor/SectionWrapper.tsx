'use client';

import { useState, ReactNode, forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  id: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
  dragEnabled?: boolean;
  action?: ReactNode;
}

function DragHandle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-col gap-[3px] p-1.5 cursor-grab active:cursor-grabbing rounded hover:bg-gray-100 transition-colors',
        className
      )}
      {...props}
    >
      <div className="flex gap-[3px]">
        <span className="w-1 h-1 rounded-full bg-gray-400" />
        <span className="w-1 h-1 rounded-full bg-gray-400" />
      </div>
      <div className="flex gap-[3px]">
        <span className="w-1 h-1 rounded-full bg-gray-400" />
        <span className="w-1 h-1 rounded-full bg-gray-400" />
      </div>
      <div className="flex gap-[3px]">
        <span className="w-1 h-1 rounded-full bg-gray-400" />
        <span className="w-1 h-1 rounded-full bg-gray-400" />
      </div>
    </div>
  );
}

export { DragHandle };

export default function SectionWrapper({
  id,
  title,
  subtitle,
  icon,
  children,
  defaultExpanded = true,
  dragEnabled = true,
  action,
}: SectionWrapperProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !dragEnabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      id={`section-${id}`}
      className={cn(
        'bg-white rounded-2xl border border-gray-200 overflow-hidden',
        'transition-all duration-200',
        isDragging ? 'shadow-2xl z-50 scale-[1.02] opacity-95' : 'shadow-sm hover:shadow-md'
      )}
    >
      <div
        className={cn(
          'flex items-center gap-3 px-5 py-4',
          'cursor-pointer select-none group'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {dragEnabled && (
          <div
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <DragHandle />
          </div>
        )}
        
        <div className="flex-1 flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {action && (
          <div onClick={(e) => e.stopPropagation()}>
            {action}
          </div>
        )}

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
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
