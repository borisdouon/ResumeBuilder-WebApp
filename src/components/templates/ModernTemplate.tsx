'use client';

import { ResumeContent } from '@/types/resume';
import { formatDate } from '@/lib/utils';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink } from 'lucide-react';

interface ModernTemplateProps {
  content: ResumeContent;
}

const platformIcons: Record<string, React.ReactNode> = {
  linkedin: <Linkedin className="w-3 h-3" />,
  github: <Github className="w-3 h-3" />,
  portfolio: <Globe className="w-3 h-3" />,
  twitter: <ExternalLink className="w-3 h-3" />,
  other: <ExternalLink className="w-3 h-3" />,
};

export default function ModernTemplate({ content }: ModernTemplateProps) {
  const { personal, summary, experience, education, skills, links, languages, sectionOrder } = content;
  const visibleSections = sectionOrder || [];

  return (
    <div className="w-full h-full bg-white text-gray-800 font-sans">
      {/* A4 Page Container - 595pt × 842pt */}
      <div 
        className="mx-auto bg-white shadow-lg"
        style={{ 
          width: '595pt',
          minHeight: '842pt',
        }}
      >
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-10">
          <div className="flex items-start gap-6">
            {/* Photo */}
            {personal.photo && (
              <div className="flex-shrink-0">
                <img
                  src={personal.photo}
                  alt={personal.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white/30"
                />
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">
                {personal.name || 'Your Name'}
              </h1>
              {personal.jobTitle && (
                <p className="text-xl text-blue-100 mt-1 font-medium">
                  {personal.jobTitle}
                </p>
              )}
              
              {/* Contact Info */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-blue-100">
                {personal.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    {personal.email}
                  </span>
                )}
                {personal.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    {personal.phone}
                  </span>
                )}
                {personal.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {personal.location}
                  </span>
                )}
              </div>

              {/* Links */}
              {links && links.length > 0 && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-blue-100">
                  {links.map((link) => (
                    <span key={link.id} className="flex items-center gap-1.5">
                      {platformIcons[link.platform] || platformIcons.other}
                      {link.label || link.url}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="px-8 py-8 space-y-6">
          {/* Professional Summary */}
          {visibleSections.includes('summary') && summary && (
            <section className="break-inside-avoid">
              <h2 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-blue-600"></span>
                Profile
              </h2>
              <p className="text-sm leading-relaxed text-gray-600">{summary}</p>
            </section>
          )}

          {/* Work Experience */}
          {visibleSections.includes('experience') && experience.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-blue-600"></span>
                Experience
              </h2>
              <div className="space-y-5">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l-2 border-gray-200">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-600"></div>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-gray-900">{exp.role || 'Job Title'}</h3>
                        <p className="text-sm text-blue-600 font-medium">{exp.company || 'Company'}</p>
                        {exp.location && (
                          <p className="text-xs text-gray-500">{exp.location}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                        {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-line">
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
              <h2 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-blue-600"></span>
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="relative pl-4 border-l-2 border-gray-200 break-inside-avoid">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-600"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {edu.degree && edu.field
                            ? `${edu.degree} in ${edu.field}`
                            : edu.degree || edu.field || 'Degree'}
                        </h3>
                        <p className="text-sm text-blue-600 font-medium">{edu.school || 'School'}</p>
                        {edu.location && (
                          <p className="text-xs text-gray-500">{edu.location}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                        {formatDate(edu.startDate)} — {edu.current ? 'Present' : formatDate(edu.endDate)}
                      </span>
                    </div>
                    {edu.gpa && (
                      <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>
                    )}
                    {edu.description && (
                      <p className="text-sm text-gray-600 mt-1">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-2 gap-8">
            {/* Skills */}
            {visibleSections.includes('skills') && skills.length > 0 && (
              <section className="break-inside-avoid">
                <h2 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-blue-600"></span>
                  Skills
                </h2>
                <div className="space-y-2">
                  {skills.map((skill) => {
                    const skillLevelIndex = ['beginner', 'intermediate', 'advanced', 'expert'].indexOf(skill.level || 'intermediate') + 1;
                    return (
                      <div key={skill.id} className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 flex-1">{skill.name}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`w-3 h-3 rounded-full ${
                                level <= skillLevelIndex ? 'bg-blue-600' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Languages */}
            {visibleSections.includes('languages') && languages && languages.length > 0 && (
              <section className="break-inside-avoid">
                <h2 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-blue-600"></span>
                  Languages
                </h2>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{lang.name}</span>
                      <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-0.5 rounded">
                        {lang.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
