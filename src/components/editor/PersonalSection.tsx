'use client';

import { useRef, useState } from 'react';
import { User, Camera, X } from 'lucide-react';
import { Input } from '@/components/ui';
import { useResumeStore } from '@/store/useResumeStore';
import SectionWrapper from './SectionWrapper';
import { cn } from '@/lib/utils';

export default function PersonalSection() {
  const { content, updatePersonalInfo } = useResumeStore();
  const { personal } = content;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(personal.photo || null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPhotoPreview(base64);
        updatePersonalInfo({ photo: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    updatePersonalInfo({ photo: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <SectionWrapper
      id="personal"
      title="Personal Details"
      subtitle="Add your personal information"
      icon={<User className="w-5 h-5" />}
      dragEnabled={false}
    >
      <div className="space-y-6">
        {/* Photo Upload */}
        <div className="flex items-start gap-6">
          <div className="relative group">
            <div
              className={cn(
                'w-24 h-24 rounded-full overflow-hidden border-2 border-dashed',
                'flex items-center justify-center cursor-pointer',
                'transition-all duration-200',
                photoPreview
                  ? 'border-transparent'
                  : 'border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50'
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-8 h-8 text-gray-400" />
              )}
            </div>
            {photoPreview && (
              <button
                onClick={removePhoto}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
          <div className="flex-1 pt-2">
            <p className="text-sm font-medium text-gray-700 mb-1">Profile Photo</p>
            <p className="text-xs text-gray-500">
              Upload a professional photo. Square images work best.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {photoPreview ? 'Change photo' : 'Upload photo'}
            </button>
          </div>
        </div>

        {/* Name and Job Title */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={personal.name}
            onChange={(e) => updatePersonalInfo({ name: e.target.value })}
          />
          <Input
            label="Job Title"
            placeholder="Software Engineer"
            value={personal.jobTitle}
            onChange={(e) => updatePersonalInfo({ jobTitle: e.target.value })}
          />
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={personal.email}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={personal.phone}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
          />
        </div>

        {/* Location */}
        <Input
          label="Location"
          placeholder="San Francisco, CA"
          value={personal.location}
          onChange={(e) => updatePersonalInfo({ location: e.target.value })}
        />
      </div>
    </SectionWrapper>
  );
}
