'use client';

import { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Palette } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { ClassicTemplate, ModernTemplate } from '@/components/templates';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import DownloadMenu from './DownloadMenu';

const templates = [
  { id: 'modern', name: 'Modern', component: ModernTemplate },
  { id: 'classic', name: 'Classic', component: ClassicTemplate },
];

export default function PreviewPanel() {
  const { content, title, isSaving, lastSaved } = useResumeStore();
  const [zoom, setZoom] = useState(0.65);
  const [activeTemplate, setActiveTemplate] = useState('modern');
  const [showTemplates, setShowTemplates] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 1.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.4));

  const handleDownload = async (format: 'pdf' | 'docx' | 'txt') => {
    const fileName = `${title || 'resume'}.${format}`;
    
    if (format === 'pdf') {
      // Direct PDF download using html2pdf.js
      if (!resumeRef.current) {
        alert('Resume preview not ready. Please try again.');
        return;
      }
      
      setIsGeneratingPDF(true);
      
      try {
        // Dynamically import html2pdf.js - handle both default and named exports
        const html2pdfModule = await import('html2pdf.js');
        const html2pdf = html2pdfModule.default || html2pdfModule;
        
        // Clone the resume element to avoid affecting the UI
        const element = resumeRef.current.cloneNode(true) as HTMLElement;
        
        // Remove any transform/scale applied and prepare for PDF
        element.style.transform = 'none';
        element.style.width = '595pt';
        element.style.minHeight = '842pt';
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        
        // Temporarily add to DOM for rendering
        document.body.appendChild(element);
        
        const opt = {
          margin: [10, 10, 10, 10] as [number, number, number, number],
          filename: fileName,
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true,
            logging: false
          },
          jsPDF: { 
            unit: 'pt', 
            format: 'a4', 
            orientation: 'portrait' as const,
            compress: true
          },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        
        await html2pdf().set(opt).from(element).save();
        
        // Clean up
        document.body.removeChild(element);
      } catch (error: any) {
        console.error('Error generating PDF:', error);
        console.error('Error details:', error.message, error.stack);
        alert(`Failed to generate PDF: ${error.message || 'Unknown error'}. Please try again.`);
      } finally {
        setIsGeneratingPDF(false);
      }
    } else if (format === 'docx') {
      // For DOCX, create a basic Word document structure
      const docContent = generateDocxContent(content);
      downloadFile(docContent, fileName, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    } else if (format === 'txt') {
      // For TXT, create plain text version
      const txtContent = generateTextContent(content);
      downloadFile(txtContent, fileName, 'text/plain');
    }
  };

  const generateDocxContent = (content: any): string => {
    // Simple DOCX-like structure (in production, use docx library)
    let doc = `${content.personal.name || 'Your Name'}\n`;
    doc += `${content.personal.email || ''} | ${content.personal.phone || ''}\n`;
    doc += `${content.personal.location || ''}\n\n`;
    
    if (content.summary) {
      doc += `SUMMARY\n${content.summary}\n\n`;
    }
    
    if (content.experience?.length > 0) {
      doc += `EXPERIENCE\n`;
      content.experience.forEach((exp: any) => {
        doc += `${exp.role} at ${exp.company}\n`;
        doc += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
        doc += `${exp.description || ''}\n\n`;
      });
    }
    
    if (content.education?.length > 0) {
      doc += `EDUCATION\n`;
      content.education.forEach((edu: any) => {
        doc += `${edu.degree} in ${edu.field} - ${edu.school}\n`;
        doc += `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}\n\n`;
      });
    }
    
    return doc;
  };

  const generateTextContent = (content: any): string => {
    let txt = `${content.personal.name || 'Your Name'}\n`;
    txt += `${content.personal.email || ''} | ${content.personal.phone || ''}\n`;
    txt += `${content.personal.location || ''}\n`;
    txt += `${'='.repeat(60)}\n\n`;
    
    if (content.summary) {
      txt += `SUMMARY\n${'-'.repeat(60)}\n${content.summary}\n\n`;
    }
    
    if (content.experience?.length > 0) {
      txt += `EXPERIENCE\n${'-'.repeat(60)}\n`;
      content.experience.forEach((exp: any) => {
        txt += `${exp.role} at ${exp.company}\n`;
        txt += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
        txt += `${exp.description || ''}\n\n`;
      });
    }
    
    if (content.education?.length > 0) {
      txt += `EDUCATION\n${'-'.repeat(60)}\n`;
      content.education.forEach((edu: any) => {
        txt += `${edu.degree} in ${edu.field} - ${edu.school}\n`;
        txt += `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}\n\n`;
      });
    }
    
    if (content.skills?.length > 0) {
      txt += `SKILLS\n${'-'.repeat(60)}\n`;
      txt += content.skills.map((s: any) => s.name).join(', ') + '\n\n';
    }
    
    return txt;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    if (diff < 60000) return 'Saved just now';
    if (diff < 3600000) return `Saved ${Math.floor(diff / 60000)}m ago`;
    return `Saved at ${lastSaved.toLocaleTimeString()}`;
  };

  const ActiveTemplateComponent = templates.find(t => t.id === activeTemplate)?.component || ModernTemplate;

  return (
    <div className="h-full flex flex-col bg-gray-800">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700 no-print">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-white">Preview</h3>
          <span className="text-xs text-gray-400">
            {isSaving ? 'Saving...' : formatLastSaved()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Template Selector */}
          <div className="relative">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
            >
              <Palette className="w-4 h-4" />
              {templates.find(t => t.id === activeTemplate)?.name}
            </button>
            {showTemplates && (
              <div className="absolute top-full right-0 mt-1 w-36 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setActiveTemplate(template.id);
                      setShowTemplates(false);
                    }}
                    className={cn(
                      'w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors',
                      activeTemplate === template.id && 'bg-blue-50 text-blue-600 font-medium'
                    )}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center bg-gray-700 rounded-lg p-1" data-tour="zoom-controls">
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-600 rounded"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-sm text-gray-300 min-w-[50px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-600 rounded"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors" title="Full screen">
            <Maximize2 className="w-4 h-4" />
          </button>

          <DownloadMenu onDownload={handleDownload} isGeneratingPDF={isGeneratingPDF} />
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-6 no-print-bg">
        <div className="flex justify-center">
          <div
            ref={resumeRef}
            className={cn(
              'bg-white shadow-2xl resume-preview-container',
              'transition-transform duration-200'
            )}
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              width: '595pt', // A4 width
              minHeight: '842pt', // A4 height
            }}
          >
            <ActiveTemplateComponent content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}
