import { create } from 'zustand';

export const useResumeStore = create((set) => ({
    resumeData: {
        personalInfo: {
            fullName: '',
            email: '',
            phone: '',
            linkedin: '',
            github: '',
            portfolio: '',
            location: '',
        },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        references: [],
        customSections: [],
    },

    // Section order for reordering
    sectionOrder: ['summary', 'education', 'skills', 'experience', 'projects', 'certifications', 'customSections', 'references'],

    // Selected template
    selectedTemplate: 'classic',
    setSelectedTemplate: (template) => set({ selectedTemplate: template }),

    setSectionOrder: (order) => set({ sectionOrder: order }),

    moveSectionUp: (sectionId) =>
        set((state) => {
            const idx = state.sectionOrder.indexOf(sectionId);
            if (idx > 0) {
                const newOrder = [...state.sectionOrder];
                [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
                return { sectionOrder: newOrder };
            }
            return state;
        }),

    moveSectionDown: (sectionId) =>
        set((state) => {
            const idx = state.sectionOrder.indexOf(sectionId);
            if (idx < state.sectionOrder.length - 1) {
                const newOrder = [...state.sectionOrder];
                [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
                return { sectionOrder: newOrder };
            }
            return state;
        }),

    updatePersonalInfo: (data) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                personalInfo: { ...state.resumeData.personalInfo, ...data },
            },
        })),

    updateSummary: (summary) =>
        set((state) => ({
            resumeData: { ...state.resumeData, summary },
        })),

    addExperience: (experience) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                experience: [...state.resumeData.experience, { ...experience, id: crypto.randomUUID() }],
            },
        })),

    updateExperience: (id, data) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                experience: state.resumeData.experience.map((exp) => (exp.id === id ? { ...exp, ...data } : exp)),
            },
        })),

    removeExperience: (id) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                experience: state.resumeData.experience.filter((exp) => exp.id !== id),
            },
        })),

    addEducation: (education) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                education: [...state.resumeData.education, { ...education, id: crypto.randomUUID() }],
            },
        })),

    updateEducation: (id, data) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                education: state.resumeData.education.map((edu) => (edu.id === id ? { ...edu, ...data } : edu)),
            },
        })),

    removeEducation: (id) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                education: state.resumeData.education.filter((edu) => edu.id !== id),
            },
        })),

    addSkill: (skill) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                skills: [...state.resumeData.skills, skill],
            },
        })),

    removeSkill: (skill) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                skills: state.resumeData.skills.filter((s) => s !== skill),
            },
        })),

    addProject: (project) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                projects: [...state.resumeData.projects, { ...project, id: crypto.randomUUID() }],
            },
        })),

    updateProject: (id, data) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                projects: state.resumeData.projects.map((proj) => (proj.id === id ? { ...proj, ...data } : proj)),
            },
        })),

    removeProject: (id) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                projects: state.resumeData.projects.filter((proj) => proj.id !== id),
            },
        })),

    addCertification: (cert) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                certifications: [...state.resumeData.certifications, { ...cert, id: crypto.randomUUID() }],
            },
        })),

    updateCertification: (id, data) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                certifications: state.resumeData.certifications.map((c) => (c.id === id ? { ...c, ...data } : c)),
            },
        })),

    removeCertification: (id) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                certifications: state.resumeData.certifications.filter((c) => c.id !== id),
            },
        })),

    addReference: (ref) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                references: [...state.resumeData.references, { ...ref, id: crypto.randomUUID() }],
            },
        })),

    updateReference: (id, data) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                references: state.resumeData.references.map((r) => (r.id === id ? { ...r, ...data } : r)),
            },
        })),

    removeReference: (id) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                references: state.resumeData.references.filter((r) => r.id !== id),
            },
        })),

    addCustomSection: (title) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                customSections: [...state.resumeData.customSections, { id: crypto.randomUUID(), title, items: [] }],
            },
        })),

    updateCustomSectionTitle: (id, title) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                customSections: state.resumeData.customSections.map((s) => (s.id === id ? { ...s, title } : s)),
            },
        })),

    removeCustomSection: (id) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                customSections: state.resumeData.customSections.filter((s) => s.id !== id),
            },
        })),

    addCustomSectionItem: (sectionId, content) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                customSections: state.resumeData.customSections.map((s) =>
                    s.id === sectionId ? { ...s, items: [...s.items, { id: crypto.randomUUID(), content }] } : s
                ),
            },
        })),

    updateCustomSectionItem: (sectionId, itemId, content) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                customSections: state.resumeData.customSections.map((s) =>
                    s.id === sectionId
                        ? { ...s, items: s.items.map((i) => (i.id === itemId ? { ...i, content } : i)) }
                        : s
                ),
            },
        })),

    removeCustomSectionItem: (sectionId, itemId) =>
        set((state) => ({
            resumeData: {
                ...state.resumeData,
                customSections: state.resumeData.customSections.map((s) =>
                    s.id === sectionId ? { ...s, items: s.items.filter((i) => i.id !== itemId) } : s
                ),
            },
        })),

    setResumeData: (data) =>
        set(() => ({
            resumeData: {
                personalInfo: data.personalInfo || { fullName: '', email: '', phone: '', linkedin: '', github: '', portfolio: '', location: '' },
                summary: data.summary || '',
                experience: data.experience || [],
                education: data.education || [],
                skills: data.skills || [],
                projects: data.projects || [],
                certifications: data.certifications || [],
                references: data.references || [],
                customSections: data.customSections || [],
            },
        })),
}));
