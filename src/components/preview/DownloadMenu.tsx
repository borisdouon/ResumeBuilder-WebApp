'use client';

import { useState } from 'react';
import { Download, FileText, File, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface DownloadMenuProps {
  onDownload: (format: 'pdf' | 'docx' | 'txt') => void;
  isGeneratingPDF?: boolean;
}

export default function DownloadMenu({ onDownload, isGeneratingPDF = false }: DownloadMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formats = [
    { id: 'pdf' as const, label: 'PDF Document', icon: FileText, description: 'Best for printing and sharing' },
    { id: 'docx' as const, label: 'Word Document', icon: File, description: 'Editable in Microsoft Word' },
    { id: 'txt' as const, label: 'Plain Text', icon: FileText, description: 'Simple text format' },
  ];

  const handleDownload = (format: 'pdf' | 'docx' | 'txt') => {
    onDownload(format);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="primary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="group"
        disabled={isGeneratingPDF}
      >
        {isGeneratingPDF ? (
          <>
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-1" />
            Download
            <ChevronDown className={cn(
              "w-4 h-4 ml-1 transition-transform duration-200",
              isOpen && "rotate-180"
            )} />
          </>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop to close menu */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
            <div className="p-2">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Export Format
                </p>
              </div>
              <div className="mt-1 space-y-1">
                {formats.map((format) => {
                  const Icon = format.icon;
                  return (
                    <button
                      key={format.id}
                      onClick={() => handleDownload(format.id)}
                      className={cn(
                        'w-full flex items-start gap-3 px-3 py-2.5 rounded-lg',
                        'hover:bg-blue-50 transition-colors text-left group'
                      )}
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {format.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {format.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
