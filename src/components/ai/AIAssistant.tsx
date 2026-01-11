'use client';

import { useState } from 'react';
import { Sparkles, Wand2, Target, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { improveResumeContent, matchJobDescription, generateSummary } from '@/lib/gemini';
import { useResumeStore } from '@/store/useResumeStore';
import { cn } from '@/lib/utils';

interface AIAssistantProps {
  section?: string;
  content?: string;
  onApply?: (improvedContent: string) => void;
}

export default function AIAssistant({ section, content, onApply }: AIAssistantProps) {
  const { content: resumeContent } = useResumeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'improve' | 'match' | 'summary'>('improve');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [jobDescription, setJobDescription] = useState('');

  const handleImprove = async () => {
    if (!content || !section) return;
    
    setIsProcessing(true);
    setResult(null);
    
    try {
      const improved = await improveResumeContent(section, content);
      setResult({ type: 'improved', content: improved });
    } catch (error) {
      setResult({ type: 'error', message: 'Failed to improve content. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMatchJob = async () => {
    if (!jobDescription.trim()) {
      setResult({ type: 'error', message: 'Please enter a job description.' });
      return;
    }
    
    setIsProcessing(true);
    setResult(null);
    
    try {
      const match = await matchJobDescription(resumeContent as any, jobDescription);
      setResult({ type: 'match', data: match });
    } catch (error) {
      setResult({ type: 'error', message: 'Failed to analyze job match. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateSummary = async () => {
    setIsProcessing(true);
    setResult(null);
    
    try {
      const summary = await generateSummary(resumeContent as any);
      setResult({ type: 'summary', content: summary });
    } catch (error) {
      setResult({ type: 'error', message: 'Failed to generate summary. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    if (result?.type === 'improved' && onApply) {
      onApply(result.content);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="group"
      >
        <Sparkles className="w-4 h-4 mr-1 text-purple-500" />
        AI Assistant
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute top-full right-0 mt-2 w-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <button
                onClick={() => setActiveTab('improve')}
                className={cn(
                  'flex-1 px-4 py-3 text-sm font-medium transition-colors',
                  activeTab === 'improve'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <Wand2 className="w-4 h-4 inline mr-1" />
                Improve
              </button>
              <button
                onClick={() => setActiveTab('match')}
                className={cn(
                  'flex-1 px-4 py-3 text-sm font-medium transition-colors',
                  activeTab === 'match'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <Target className="w-4 h-4 inline mr-1" />
                Job Match
              </button>
              <button
                onClick={() => setActiveTab('summary')}
                className={cn(
                  'flex-1 px-4 py-3 text-sm font-medium transition-colors',
                  activeTab === 'summary'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <Sparkles className="w-4 h-4 inline mr-1" />
                Summary
              </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {activeTab === 'improve' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Use AI to improve your {section || 'content'} with professional language and impact.
                  </p>
                  {content ? (
                    <Button
                      variant="primary"
                      onClick={handleImprove}
                      disabled={isProcessing}
                      className="w-full"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Improving...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Improve Content
                        </>
                      )}
                    </Button>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Add some content first to use AI improvement.
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'match' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Paste a job description to see how well your resume matches.
                  </p>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste job description here..."
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <Button
                    variant="primary"
                    onClick={handleMatchJob}
                    disabled={isProcessing || !jobDescription.trim()}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4 mr-2" />
                        Analyze Match
                      </>
                    )}
                  </Button>
                </div>
              )}

              {activeTab === 'summary' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Generate a professional summary based on your resume.
                  </p>
                  <Button
                    variant="primary"
                    onClick={handleGenerateSummary}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Summary
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Results */}
              {result && (
                <div className="mt-4 p-3 rounded-lg border">
                  {result.type === 'error' && (
                    <div className="flex items-start gap-2 text-red-600">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{result.message}</p>
                    </div>
                  )}

                  {result.type === 'improved' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-600 mb-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium text-sm">Improved Content</span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {result.content}
                      </p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleApply}
                        className="w-full"
                      >
                        Apply Changes
                      </Button>
                    </div>
                  )}

                  {result.type === 'match' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-gray-900">Match Score</span>
                        <span className={cn(
                          "text-2xl font-bold",
                          result.data.score >= 80 ? "text-green-600" :
                          result.data.score >= 60 ? "text-yellow-600" : "text-red-600"
                        )}>
                          {result.data.score}%
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Strengths</h4>
                        <ul className="space-y-1">
                          {result.data.strengths.map((strength: string, idx: number) => (
                            <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {result.data.gaps.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Gaps</h4>
                          <ul className="space-y-1">
                            {result.data.gaps.map((gap: string, idx: number) => (
                              <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                                <AlertCircle className="w-3 h-3 text-orange-500 flex-shrink-0 mt-0.5" />
                                {gap}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Suggestions</h4>
                        <ul className="space-y-1">
                          {result.data.suggestions.map((suggestion: string, idx: number) => (
                            <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                              <Sparkles className="w-3 h-3 text-purple-500 flex-shrink-0 mt-0.5" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {result.type === 'summary' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-600 mb-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium text-sm">Generated Summary</span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {result.content}
                      </p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          useResumeStore.getState().updateSummary(result.content);
                          setIsOpen(false);
                        }}
                        className="w-full"
                      >
                        Use This Summary
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
