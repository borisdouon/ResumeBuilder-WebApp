'use client';

import { FileText, Lightbulb } from 'lucide-react';
import { Textarea } from '@/components/ui';
import { useResumeStore } from '@/store/useResumeStore';
import SectionWrapper from './SectionWrapper';
import AIAssistant from '@/components/ai/AIAssistant';

export default function SummarySection() {
  const { content, updateSummary } = useResumeStore();

  const characterCount = content.summary.length;
  const maxChars = 400;
  const isOverLimit = characterCount > maxChars;

  return (
    <SectionWrapper
      id="summary"
      title="Professional Summary"
      subtitle="Write 2-4 short, energetic sentences about your background"
      icon={<FileText className="w-5 h-5" />}
      action={<AIAssistant section="summary" content={content.summary} onApply={(improved) => updateSummary(improved)} />}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Write 2-4 short, energetic sentences about how great you are. Mention the role and what you did. What were the big achievements? Describe your motivation and list your skills.
        </p>

        <div className="relative">
          <Textarea
            placeholder="e.g. Passionate software engineer with 5+ years of experience building scalable web applications. Led a team of 6 developers at TechCorp, increasing platform performance by 40%. Skilled in React, Node.js, and cloud architecture. Looking to leverage my expertise in a senior engineering role."
            value={content.summary}
            onChange={(e) => updateSummary(e.target.value)}
            rows={6}
            className="pr-16"
          />
          <div className={`absolute bottom-3 right-3 text-xs font-medium ${isOverLimit ? 'text-red-500' : 'text-gray-400'}`}>
            {characterCount}/{maxChars}
          </div>
        </div>

        {/* Tips */}
        <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">Pro tip</p>
            <p className="text-amber-700">
              Recruiters often skim resumes. A strong summary grabs their attention and highlights your value in seconds. Keep it concise and impactful.
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
