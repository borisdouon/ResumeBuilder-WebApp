'use client';

import { useState, useRef } from 'react';
import { X, FileText, Linkedin, AlignLeft, Sparkles, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { parseResumeWithAI } from '@/lib/gemini';

interface ImportResumeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStartFromScratch: () => void;
  onImportComplete: (data: any) => void;
}

type ImportOption = 'file' | 'linkedin' | 'text' | 'scratch';

export default function ImportResumeDialog({
  isOpen,
  onClose,
  onStartFromScratch,
  onImportComplete,
}: ImportResumeDialogProps) {
  const [selectedOption, setSelectedOption] = useState<ImportOption | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pastedText, setPastedText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    try {
      let extractedText = '';
      
      console.log('Processing file:', file.name, 'Type:', file.type);
      
      // Extract text based on file type
      if (file.type === 'application/pdf') {
        console.log('Extracting text from PDF...');
        extractedText = await extractTextFromPDF(file);
        console.log('Extracted text length:', extractedText.length);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                 file.type === 'application/msword') {
        console.log('Extracting text from DOCX...');
        extractedText = await extractTextFromDOCX(file);
      } else if (file.type === 'text/plain') {
        console.log('Reading plain text file...');
        extractedText = await file.text();
      } else {
        throw new Error(`Unsupported file type: ${file.type}`);
      }
      
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No text could be extracted from the file');
      }
      
      console.log('Parsing text with AI...');
      // Parse the extracted text with AI
      const parsedData = await parseResumeText(extractedText);
      console.log('Parsed data:', parsedData);
      
      setIsProcessing(false);
      onImportComplete(parsedData);
      onClose();
    } catch (error: any) {
      console.error('Error processing file:', error);
      setIsProcessing(false);
      alert(`Failed to process the file: ${error.message || 'Unknown error'}. Please try another format or paste as plain text.`);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      
      // Set worker source - use the npm package worker
      if (typeof window !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
      }
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ 
        data: arrayBuffer,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true,
      }).promise;
      
      let fullText = '';
      
      // Extract text from each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      if (!fullText.trim()) {
        throw new Error('No text could be extracted from PDF');
      }
      
      return fullText;
    } catch (error: any) {
      console.error('Error extracting PDF text:', error);
      throw new Error('Failed to extract text from PDF. Please try another format.');
    }
  };

  const extractTextFromDOCX = async (file: File): Promise<string> => {
    // For now, read as text - in production, use mammoth.js library
    const text = await file.text();
    return text;
  };

  const parseResumeText = async (text: string): Promise<any> => {
    try {
      console.log('Attempting AI-powered parsing...');
      // Use AI-powered parsing for intelligent extraction
      const parsedData = await parseResumeWithAI(text);
      console.log('AI parsing successful');
      return parsedData;
    } catch (error: any) {
      console.error('AI parsing failed, falling back to basic parsing:', error);
      console.log('Error details:', error.message);
      
      // Fallback to basic parsing if AI fails
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
      const phoneRegex = /[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}/;
      
      const email = text.match(emailRegex)?.[0] || '';
      const phone = text.match(phoneRegex)?.[0] || '';
      
      const lines = text.split('\n').filter(line => line.trim());
      const name = lines[0]?.trim() || 'Your Name';
      
      console.log('Using basic parsing fallback');
      
      return {
        personal: { 
          name, 
          email, 
          phone,
          location: '',
          linkedin: '',
          website: ''
        },
        summary: text.substring(0, 300),
        experience: [],
        education: [],
        skills: []
      };
    }
  };

  const handleLinkedInImport = () => {
    // LinkedIn OAuth would be implemented here
    alert('LinkedIn import requires OAuth setup. This feature will be available soon. Please use "Paste Plain Text" or "Import Resume File" for now.');
  };

  const handleTextPaste = async () => {
    if (!pastedText.trim()) return;
    
    setIsProcessing(true);
    
    try {
      const parsedData = await parseResumeText(pastedText);
      setIsProcessing(false);
      onImportComplete(parsedData);
      onClose();
    } catch (error) {
      console.error('Error parsing text:', error);
      setIsProcessing(false);
      alert('Failed to parse resume text. Please try again.');
    }
  };

  const options = [
    {
      id: 'file' as ImportOption,
      icon: Upload,
      title: 'Import Resume File',
      description: 'Upload PDF, DOCX, or TXT file',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      id: 'linkedin' as ImportOption,
      icon: Linkedin,
      title: 'Import from LinkedIn',
      description: 'Connect and import your profile',
      gradient: 'from-blue-600 to-blue-700',
    },
    {
      id: 'text' as ImportOption,
      icon: AlignLeft,
      title: 'Paste Plain Text',
      description: 'Paste your resume as text',
      gradient: 'from-indigo-500 to-indigo-600',
    },
    {
      id: 'scratch' as ImportOption,
      icon: Sparkles,
      title: 'Start from Scratch',
      description: 'Build your resume from the ground up',
      gradient: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <h2 className="text-xl sm:text-2xl font-bold">Import Your Resume</h2>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <p className="text-sm sm:text-base text-blue-100">
            Choose how you&apos;d like to start building your resume
          </p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {!selectedOption && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {options.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      if (option.id === 'scratch') {
                        onStartFromScratch();
                        onClose();
                      } else {
                        setSelectedOption(option.id);
                      }
                    }}
                    className={cn(
                      'group relative p-4 sm:p-6 rounded-xl border-2 border-gray-200',
                      'hover:shadow-lg hover:border-blue-400',
                      'bg-white text-left cursor-pointer'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4',
                      'bg-gradient-to-br',
                      option.gradient
                    )}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                      {option.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">{option.description}</p>
                  </button>
                );
              })}
            </div>
          )}

          {/* File Upload View */}
          {selectedOption === 'file' && (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
              <button
                onClick={() => setSelectedOption(null)}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                ← Back
              </button>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Your Resume
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  We support PDF, DOCX, and TXT files
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  ref={fileInputRef}
                  id="resume-upload"
                  disabled={isProcessing}
                />
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleChooseFile}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Choose File'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* LinkedIn Import View */}
          {selectedOption === 'linkedin' && (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
              <button
                onClick={() => setSelectedOption(null)}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                ← Back
              </button>
              
              <div className="border border-gray-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Linkedin className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Connect LinkedIn
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  We'll securely import your profile data and populate your resume
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleLinkedInImport}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Linkedin className="w-4 h-4 mr-2" />
                      Connect LinkedIn
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Text Paste View */}
          {selectedOption === 'text' && (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
              <button
                onClick={() => setSelectedOption(null)}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                ← Back
              </button>
              
              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-2 block">
                    Paste Your Resume Text
                  </span>
                  <textarea
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste your resume content here... Our AI will analyze and extract the information automatically."
                    className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    disabled={isProcessing}
                  />
                </label>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleTextPaste}
                  disabled={isProcessing || !pastedText.trim()}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Import with AI
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
