'use client';

import { ResumeContent } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface ClassicTemplateProps {
  content: ResumeContent;
}

export default function ClassicTemplate({ content }: ClassicTemplateProps) {
  const { personal, summary, experience, education, skills, links, languages, sectionOrder } = content;
  const visibleSections = sectionOrder || [];

  return (
    <div className="w-full h-full bg-white text-gray-900 font-serif">
      {/* A4 Page Container - 595pt × 842pt with print-safe margins */}
      <div 
        className="mx-auto bg-white shadow-lg"
        style={{ 
          width: '595pt',
          minHeight: '842pt',
          padding: '48pt', // ~17mm margins for print safety
        }}
      >
        {/* Header - Personal Info */}
        <header className="text-center border-b-2 border-gray-800 pb-4 break-inside-avoid">
          <h1 className="text-3xl font-bold tracking-wide uppercase text-gray-900">
            {personal.name || 'Your Name'}
          </h1>
          {personal.jobTitle && (
            <p className="text-lg text-gray-600 mt-1">{personal.jobTitle}</p>
          )}
          
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-sm text-gray-600">
            {personal.email && (
              <span>{personal.email}</span>
            )}
            {personal.phone && (
              <span>{personal.phone}</span>
            )}
            {personal.location && (
              <span>{personal.location}</span>
            )}
          </div>

          {links && links.length > 0 && (
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
              {links.map((link) => (
                <span key={link.id}>{link.label || link.url}</span>
              ))}
            </div>
          )}
        </header>

        {/* Professional Summary */}
        {visibleSections.includes('summary') && summary && (
          <section className="break-inside-avoid">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
              Professional Summary
            </h2>
            <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {visibleSections.includes('experience') && experience.length > 0 && (
          <section className="break-inside-avoid-column">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{exp.role || 'Job Title'}</h3>
                      <p className="text-sm text-gray-600 italic">{exp.company || 'Company Name'}</p>
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-gray-700 mt-2 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {visibleSections.includes('education') && education.length > 0 && (
          <section className="break-inside-avoid-column">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="break-inside-avoid">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {edu.degree && edu.field
                          ? `${edu.degree} in ${edu.field}`
                          : edu.degree || edu.field || 'Degree'}
                      </h3>
                      <p className="text-sm text-gray-600 italic">{edu.school || 'School Name'}</p>
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(edu.startDate)} — {edu.current ? 'Present' : formatDate(edu.endDate)}
                    </span>
                  </div>
                  {edu.gpa && (
                    <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>
                  )}
                  {edu.description && (
                    <p className="text-sm text-gray-700 mt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {visibleSections.includes('skills') && skills.length > 0 && (
          <section className="break-inside-avoid">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={skill.id}
                  className="text-sm text-gray-700"
                >
                  {skill.name}
                  {idx < skills.length - 1 && ' •'}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {visibleSections.includes('languages') && languages && languages.length > 0 && (
          <section className="break-inside-avoid">
            <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
              Languages
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {languages.map((lang) => (
                <span key={lang.id} className="text-sm text-gray-700">
                  {lang.name} — <span className="text-gray-500 capitalize">{lang.proficiency}</span>
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
