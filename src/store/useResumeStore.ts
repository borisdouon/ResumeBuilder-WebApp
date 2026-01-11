import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  ResumeContent,
  Experience,
  Education,
  Skill,
  SocialLink,
  Language,
  Course,
  Certification,
  Project,
  Award,
  Volunteer,
  Publication,
  Reference,
  Hobby,
  PersonalInfo,
  defaultResumeContent,
  createNewExperience,
  createNewEducation,
  createNewSkill,
  createNewLink,
  createNewLanguage,
  createNewCourse,
  createNewCertification,
  createNewProject,
  createNewAward,
  createNewVolunteer,
  createNewPublication,
  createNewReference,
  createNewHobby,
} from '@/types/resume';

interface ResumeState {
  resumeId: string | null;
  title: string;
  template: string;
  content: ResumeContent;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;

  // Actions
  setResumeId: (id: string | null) => void;
  setTitle: (title: string) => void;
  setTemplate: (template: string) => void;
  setContent: (content: ResumeContent) => void;
  resetResume: () => void;
  loadResume: (resume: { id: string; title: string; template: string; content: ResumeContent }) => void;

  // Personal Info
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;

  // Summary
  updateSummary: (summary: string) => void;

  // Experience
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (fromIndex: number, toIndex: number) => void;

  // Education
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (fromIndex: number, toIndex: number) => void;

  // Skills
  addSkill: () => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  removeSkill: (id: string) => void;

  // Links
  addLink: () => void;
  updateLink: (id: string, data: Partial<SocialLink>) => void;
  removeLink: (id: string) => void;

  // Languages
  addLanguage: () => void;
  updateLanguage: (id: string, data: Partial<Language>) => void;
  removeLanguage: (id: string) => void;

  // Courses
  addCourse: () => void;
  updateCourse: (id: string, data: Partial<Course>) => void;
  removeCourse: (id: string) => void;

  // Certifications
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  removeCertification: (id: string) => void;

  // Projects
  addProject: () => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;

  // Awards
  addAward: () => void;
  updateAward: (id: string, data: Partial<Award>) => void;
  removeAward: (id: string) => void;

  // Volunteer
  addVolunteer: () => void;
  updateVolunteer: (id: string, data: Partial<Volunteer>) => void;
  removeVolunteer: (id: string) => void;

  // Publications
  addPublication: () => void;
  updatePublication: (id: string, data: Partial<Publication>) => void;
  removePublication: (id: string) => void;

  // References
  addReference: () => void;
  updateReference: (id: string, data: Partial<Reference>) => void;
  removeReference: (id: string) => void;

  // Hobbies
  addHobby: () => void;
  updateHobby: (id: string, data: Partial<Hobby>) => void;
  removeHobby: (id: string) => void;

  // Sections
  addSection: (sectionId: string) => void;
  removeSection: (sectionId: string) => void;
  reorderSections: (sectionOrder: string[]) => void;

  // Save state
  markDirty: () => void;
  markSaving: (saving: boolean) => void;
  markSaved: () => void;
}

export const useResumeStore = create<ResumeState>()(
  subscribeWithSelector((set, get) => ({
    resumeId: null,
    title: 'Untitled Resume',
    template: 'classic',
    content: { ...defaultResumeContent },
    isDirty: false,
    isSaving: false,
    lastSaved: null,

    setResumeId: (id) => set({ resumeId: id }),
    setTitle: (title) => set({ title, isDirty: true }),
    setTemplate: (template) => set({ template, isDirty: true }),
    setContent: (content) => set({ content, isDirty: true }),

    resetResume: () =>
      set({
        resumeId: null,
        title: 'Untitled Resume',
        template: 'classic',
        content: { ...defaultResumeContent },
        isDirty: false,
        isSaving: false,
        lastSaved: null,
      }),

    loadResume: (resume) =>
      set({
        resumeId: resume.id,
        title: resume.title,
        template: resume.template,
        content: resume.content,
        isDirty: false,
      }),

    updatePersonalInfo: (info) =>
      set((state) => ({
        content: {
          ...state.content,
          personal: { ...state.content.personal, ...info },
        },
        isDirty: true,
      })),

    updateSummary: (summary) =>
      set((state) => ({
        content: { ...state.content, summary },
        isDirty: true,
      })),

    addExperience: () =>
      set((state) => ({
        content: {
          ...state.content,
          experience: [...state.content.experience, createNewExperience()],
        },
        isDirty: true,
      })),

    updateExperience: (id, data) =>
      set((state) => ({
        content: {
          ...state.content,
          experience: state.content.experience.map((exp) =>
            exp.id === id ? { ...exp, ...data } : exp
          ),
        },
        isDirty: true,
      })),

    removeExperience: (id) =>
      set((state) => ({
        content: {
          ...state.content,
          experience: state.content.experience.filter((exp) => exp.id !== id),
        },
        isDirty: true,
      })),

    reorderExperience: (fromIndex, toIndex) =>
      set((state) => {
        const experience = [...state.content.experience];
        const [removed] = experience.splice(fromIndex, 1);
        experience.splice(toIndex, 0, removed);
        return {
          content: { ...state.content, experience },
          isDirty: true,
        };
      }),

    addEducation: () =>
      set((state) => ({
        content: {
          ...state.content,
          education: [...state.content.education, createNewEducation()],
        },
        isDirty: true,
      })),

    updateEducation: (id, data) =>
      set((state) => ({
        content: {
          ...state.content,
          education: state.content.education.map((edu) =>
            edu.id === id ? { ...edu, ...data } : edu
          ),
        },
        isDirty: true,
      })),

    removeEducation: (id) =>
      set((state) => ({
        content: {
          ...state.content,
          education: state.content.education.filter((edu) => edu.id !== id),
        },
        isDirty: true,
      })),

    reorderEducation: (fromIndex, toIndex) =>
      set((state) => {
        const education = [...state.content.education];
        const [removed] = education.splice(fromIndex, 1);
        education.splice(toIndex, 0, removed);
        return {
          content: { ...state.content, education },
          isDirty: true,
        };
      }),

    addSkill: () =>
      set((state) => ({
        content: {
          ...state.content,
          skills: [...state.content.skills, createNewSkill()],
        },
        isDirty: true,
      })),

    updateSkill: (id, data) =>
      set((state) => ({
        content: {
          ...state.content,
          skills: state.content.skills.map((skill) =>
            skill.id === id ? { ...skill, ...data } : skill
          ),
        },
        isDirty: true,
      })),

    removeSkill: (id) =>
      set((state) => ({
        content: {
          ...state.content,
          skills: state.content.skills.filter((skill) => skill.id !== id),
        },
        isDirty: true,
      })),

    // Links
    addLink: () =>
      set((state) => ({
        content: {
          ...state.content,
          links: [...state.content.links, createNewLink()],
        },
        isDirty: true,
      })),

    updateLink: (id, data) =>
      set((state) => ({
        content: {
          ...state.content,
          links: state.content.links.map((link) =>
            link.id === id ? { ...link, ...data } : link
          ),
        },
        isDirty: true,
      })),

    removeLink: (id) =>
      set((state) => ({
        content: {
          ...state.content,
          links: state.content.links.filter((link) => link.id !== id),
        },
        isDirty: true,
      })),

    // Languages
    addLanguage: () =>
      set((state) => ({
        content: {
          ...state.content,
          languages: [...state.content.languages, createNewLanguage()],
        },
        isDirty: true,
      })),

    updateLanguage: (id, data) =>
      set((state) => ({
        content: {
          ...state.content,
          languages: state.content.languages.map((lang) =>
            lang.id === id ? { ...lang, ...data } : lang
          ),
        },
        isDirty: true,
      })),

    removeLanguage: (id) =>
      set((state) => ({
        content: {
          ...state.content,
          languages: state.content.languages.filter((lang) => lang.id !== id),
        },
        isDirty: true,
      })),

    // Courses
    addCourse: () =>
      set((state) => ({
        content: {
          ...state.content,
          courses: [...state.content.courses, createNewCourse()],
        },
        isDirty: true,
      })),

    updateCourse: (id, data) =>
      set((state) => ({
        content: {
          ...state.content,
          courses: state.content.courses.map((course) =>
            course.id === id ? { ...course, ...data } : course
          ),
        },
        isDirty: true,
      })),

    removeCourse: (id) =>
      set((state) => ({
        content: {
          ...state.content,
          courses: state.content.courses.filter((course) => course.id !== id),
        },
        isDirty: true,
      })),

    // Certifications
    addCertification: () =>
      set((state) => ({
        content: {
          ...state.content,
          certifications: [...state.content.certifications, createNewCertification()],
        },
        isDirty: true,
      })),

    updateCertification: (id, data) =>
      set((state) => ({
        content: {
          ...state.content,
          certifications: state.content.certifications.map((cert) =>
            cert.id === id ? { ...cert, ...data } : cert
          ),
        },
        isDirty: true,
      })),

    removeCertification: (id) =>
      set((state) => ({
        content: {
          ...state.content,
          certifications: state.content.certifications.filter((cert) => cert.id !== id),
        },
        isDirty: true,
      })),

    // Projects
    addProject: () =>
      set((state) => ({
        content: {
          ...state.content,
          projects: [...state.content.projects, createNewProject()],
        },
        isDirty: true,
      })),

    updateProject: (id, data) =>
      set((state) => ({
        content: {
          ...state.content,
          projects: state.content.projects.map((project) =>
            project.id === id ? { ...project, ...data } : project
          ),
        },
        isDirty: true,
      })),

    removeProject: (id) =>
      set((state) => ({
        content: {
          ...state.content,
          projects: state.content.projects.filter((project) => project.id !== id),
        },
        isDirty: true,
      })),

    // Awards
    addAward: () =>
      set((state) => ({
        content: {
          ...state.content,
          awards: [...state.content.awards, createNewAward()],
        },
        isDirty: true,
      })),

    updateAward: (id, data) =>
      set((state) => ({
        content: {
          ...state.content,
          awards: state.content.awards.map((award) =>
            award.id === id ? { ...award, ...data } : award
          ),
        },
        isDirty: true,
      })),

    removeAward: (id) =>
      set((state) => ({
        content: {
          ...state.content,
          awards: state.content.awards.filter((award) => award.id !== id),
        },
        isDirty: true,
      })),

    // Volunteer
    addVolunteer: () =>
      set((state) => ({
        content: {
          ...state.content,
          volunteer: [...state.content.volunteer, createNewVolunteer()],
        },
        isDirty: true,
      })),

    updateVolunteer: (id, data) =>
      set((state) => ({
        content: {
          ...state.content,
          volunteer: state.content.volunteer.map((vol) =>
            vol.id === id ? { ...vol, ...data } : vol
          ),
        },
        isDirty: true,
      })),

    removeVolunteer: (id) =>
      set((state) => ({
        content: {
          ...state.content,
          volunteer: state.content.volunteer.filter((vol) => vol.id !== id),
        },
        isDirty: true,
      })),

    // Publications
    addPublication: () =>
      set((state) => ({
        content: {
          ...state.content,
          publications: [...state.content.publications, createNewPublication()],
        },
        isDirty: true,
      })),

    updatePublication: (id, data) =>
      set((state) => ({
        content: {
          ...state.content,
          publications: state.content.publications.map((pub) =>
            pub.id === id ? { ...pub, ...data } : pub
          ),
        },
        isDirty: true,
      })),

    removePublication: (id) =>
      set((state) => ({
        content: {
          ...state.content,
          publications: state.content.publications.filter((pub) => pub.id !== id),
        },
        isDirty: true,
      })),

    // References
    addReference: () =>
      set((state) => ({
        content: {
          ...state.content,
          references: [...state.content.references, createNewReference()],
        },
        isDirty: true,
      })),

    updateReference: (id, data) =>
      set((state) => ({
        content: {
          ...state.content,
          references: state.content.references.map((ref) =>
            ref.id === id ? { ...ref, ...data } : ref
          ),
        },
        isDirty: true,
      })),

    removeReference: (id) =>
      set((state) => ({
        content: {
          ...state.content,
          references: state.content.references.filter((ref) => ref.id !== id),
        },
        isDirty: true,
      })),

    // Hobbies
    addHobby: () =>
      set((state) => ({
        content: {
          ...state.content,
          hobbies: [...state.content.hobbies, createNewHobby()],
        },
        isDirty: true,
      })),

    updateHobby: (id, data) =>
      set((state) => ({
        content: {
          ...state.content,
          hobbies: state.content.hobbies.map((hobby) =>
            hobby.id === id ? { ...hobby, ...data } : hobby
          ),
        },
        isDirty: true,
      })),

    removeHobby: (id) =>
      set((state) => ({
        content: {
          ...state.content,
          hobbies: state.content.hobbies.filter((hobby) => hobby.id !== id),
        },
        isDirty: true,
      })),

    // Section Management
    addSection: (sectionId) =>
      set((state) => {
        if (state.content.sectionOrder.includes(sectionId)) {
          return state;
        }
        return {
          content: {
            ...state.content,
            sectionOrder: [...state.content.sectionOrder, sectionId],
          },
          isDirty: true,
        };
      }),

    removeSection: (sectionId) =>
      set((state) => ({
        content: {
          ...state.content,
          sectionOrder: state.content.sectionOrder.filter((id) => id !== sectionId),
        },
        isDirty: true,
      })),

    reorderSections: (sectionOrder) =>
      set((state) => ({
        content: { ...state.content, sectionOrder },
        isDirty: true,
      })),

    markDirty: () => set({ isDirty: true }),
    markSaving: (saving) => set({ isSaving: saving }),
    markSaved: () => set({ isDirty: false, isSaving: false, lastSaved: new Date() }),
  }))
);
