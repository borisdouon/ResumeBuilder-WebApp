'use client';

import { Link2, Plus, Trash2, Linkedin, Github, Twitter, Globe, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui';
import { useResumeStore } from '@/store/useResumeStore';
import SectionWrapper, { DragHandle } from './SectionWrapper';
import { SocialLink } from '@/types/resume';
import { cn } from '@/lib/utils';

const platformIcons: Record<SocialLink['platform'], React.ReactNode> = {
  linkedin: <Linkedin className="w-4 h-4" />,
  github: <Github className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
  portfolio: <Globe className="w-4 h-4" />,
  other: <ExternalLink className="w-4 h-4" />,
};

const platformLabels: Record<SocialLink['platform'], string> = {
  linkedin: 'LinkedIn',
  github: 'GitHub',
  twitter: 'Twitter / X',
  portfolio: 'Portfolio',
  other: 'Other',
};

export default function LinksSection() {
  const { content, addLink, updateLink, removeLink } = useResumeStore();
  const { links } = content;

  return (
    <SectionWrapper
      id="links"
      title="Websites & Social Links"
      subtitle="Add links to your online presence"
      icon={<Link2 className="w-5 h-5" />}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          You can add links to websites you want hiring managers to see! Perhaps it's your portfolio, LinkedIn profile, or personal website.
        </p>

        {links.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
            <Link2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-3">No links added yet</p>
            <button
              onClick={addLink}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Link
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link, index) => (
              <div
                key={link.id}
                className="group flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                  <DragHandle />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Platform
                      </label>
                      <div className="relative">
                        <select
                          value={link.platform}
                          onChange={(e) =>
                            updateLink(link.id, {
                              platform: e.target.value as SocialLink['platform'],
                            })
                          }
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        >
                          {Object.entries(platformLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          {platformIcons[link.platform]}
                        </div>
                      </div>
                    </div>
                    <Input
                      label="Label (optional)"
                      placeholder="My Portfolio"
                      value={link.label || ''}
                      onChange={(e) => updateLink(link.id, { label: e.target.value })}
                    />
                  </div>
                  <Input
                    label="URL"
                    placeholder="https://..."
                    value={link.url}
                    onChange={(e) => updateLink(link.id, { url: e.target.value })}
                  />
                </div>

                <button
                  onClick={() => removeLink(link.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button
              onClick={addLink}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Add one more link</span>
            </button>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
