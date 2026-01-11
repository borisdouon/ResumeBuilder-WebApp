export interface PersonalInfo {
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  photo?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface SocialLink {
  id: string;
  platform: 'linkedin' | 'github' | 'twitter' | 'portfolio' | 'other';
  url: string;
  label?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';
}

export interface Course {
  id: string;
  name: string;
  institution: string;
  completionDate: string;
  description?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Project {
  id: string;
  name: string;
  role?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  technologies?: string[];
  url?: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface Volunteer {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  authors?: string;
  url?: string;
  description?: string;
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone?: string;
}

export interface Hobby {
  id: string;
  name: string;
  description?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
}

export interface ResumeSection {
  id: string;
  type: 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'custom';
  title: string;
  visible: boolean;
  order: number;
}

export interface ResumeContent {
  personal: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  links: SocialLink[];
  languages: Language[];
  courses: Course[];
  certifications: Certification[];
  projects: Project[];
  awards: Award[];
  volunteer: Volunteer[];
  publications: Publication[];
  references: Reference[];
  hobbies: Hobby[];
  customSections: CustomSection[];
  sectionOrder: string[];
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  template: string;
  content: ResumeContent;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
}

export const defaultResumeContent: ResumeContent = {
  personal: {
    name: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  links: [],
  languages: [],
  courses: [],
  certifications: [],
  projects: [],
  awards: [],
  volunteer: [],
  publications: [],
  references: [],
  hobbies: [],
  customSections: [],
  sectionOrder: ['personal', 'summary', 'experience', 'education', 'skills'],
};

export const createNewExperience = (): Experience => ({
  id: crypto.randomUUID(),
  company: '',
  role: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  highlights: [],
});

export const createNewEducation = (): Education => ({
  id: crypto.randomUUID(),
  school: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  current: false,
});

export const createNewSkill = (): Skill => ({
  id: crypto.randomUUID(),
  name: '',
  level: 'intermediate',
});

export const createNewLink = (): SocialLink => ({
  id: crypto.randomUUID(),
  platform: 'linkedin',
  url: '',
});

export const createNewLanguage = (): Language => ({
  id: crypto.randomUUID(),
  name: '',
  proficiency: 'intermediate',
});

export const createNewCourse = (): Course => ({
  id: crypto.randomUUID(),
  name: '',
  institution: '',
  completionDate: '',
});

export const createNewCertification = (): Certification => ({
  id: crypto.randomUUID(),
  name: '',
  issuer: '',
  date: '',
});

export const createNewProject = (): Project => ({
  id: crypto.randomUUID(),
  name: '',
  startDate: '',
  current: false,
  description: '',
});

export const createNewAward = (): Award => ({
  id: crypto.randomUUID(),
  title: '',
  issuer: '',
  date: '',
});

export const createNewVolunteer = (): Volunteer => ({
  id: crypto.randomUUID(),
  organization: '',
  role: '',
  startDate: '',
  current: false,
  description: '',
});

export const createNewPublication = (): Publication => ({
  id: crypto.randomUUID(),
  title: '',
  publisher: '',
  date: '',
});

export const createNewReference = (): Reference => ({
  id: crypto.randomUUID(),
  name: '',
  position: '',
  company: '',
  email: '',
});

export const createNewHobby = (): Hobby => ({
  id: crypto.randomUUID(),
  name: '',
});

export const createNewCustomSection = (): CustomSection => ({
  id: crypto.randomUUID(),
  title: 'Custom Section',
  items: [],
});

export const createNewCustomSectionItem = (): CustomSectionItem => ({
  id: crypto.randomUUID(),
  title: '',
});
