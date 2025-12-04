import React from 'react';

// Professional Template - Executive style with elegant typography
export function ProfessionalTemplate({ data, sectionOrder }) {
    const { personalInfo, summary, experience, education, skills, projects, certifications, references, customSections } = data;

    const renderSection = (sectionId) => {
        switch (sectionId) {
            case 'summary':
                if (!summary) return null;
                return (
                    <div key="summary" className="mb-6">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Professional Summary</h2>
                        <p className="text-xs leading-relaxed text-gray-800 whitespace-pre-wrap">{summary}</p>
                    </div>
                );
            case 'education':
                if (!education?.length) return null;
                return (
                    <div key="education" className="mb-6">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Education</h2>
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-2">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-xs text-gray-900">{edu.degree}</span>
                                    <span className="text-xs text-gray-600">{edu.startDate} – {edu.endDate}</span>
                                </div>
                                <div className="text-xs text-gray-700">{edu.school}</div>
                            </div>
                        ))}
                    </div>
                );
            case 'skills':
                if (!skills?.length) return null;
                return (
                    <div key="skills" className="mb-6">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Core Competencies</h2>
                        <div className="grid grid-cols-3 gap-1 text-xs text-gray-800">
                            {skills.map((skill, i) => (
                                <span key={i}>• {skill}</span>
                            ))}
                        </div>
                    </div>
                );
            case 'experience':
                if (!experience?.length) return null;
                return (
                    <div key="experience" className="mb-6">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Professional Experience</h2>
                        {experience.map((exp) => (
                            <div key={exp.id} className="mb-4">
                                <div className="flex justify-between items-baseline">
                                    <span className="font-bold text-xs text-gray-900">{exp.title}</span>
                                    <span className="text-xs text-gray-600">{exp.startDate} – {exp.endDate}</span>
                                </div>
                                <div className="text-xs text-gray-700 italic mb-1">{exp.company}</div>
                                <p className="text-xs text-gray-800 whitespace-pre-wrap">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'projects':
                if (!projects?.length) return null;
                return (
                    <div key="projects" className="mb-6">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Key Projects</h2>
                        {projects.map((proj) => (
                            <div key={proj.id} className="mb-3">
                                <div className="flex justify-between items-baseline">
                                    <span className="font-bold text-xs text-gray-900">{proj.name}</span>
                                    <span className="text-xs text-gray-600">{proj.date}</span>
                                </div>
                                <div className="text-xs text-gray-600 mb-1">{proj.technologies}</div>
                                <p className="text-xs text-gray-800 whitespace-pre-wrap">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'certifications':
                if (!certifications?.length) return null;
                return (
                    <div key="certifications" className="mb-6">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Certifications</h2>
                        <div className="space-y-1">
                            {certifications.map((cert) => (
                                <div key={cert.id} className="text-xs text-gray-800">
                                    <span className="font-medium">{cert.name}</span>
                                    {cert.issuer && <span className="text-gray-600"> | {cert.issuer}</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'customSections':
                if (!customSections?.length) return null;
                return customSections.map((section) => (
                    section.items?.length > 0 && (
                        <div key={section.id} className="mb-6">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{section.title}</h2>
                            <ul className="text-xs space-y-1 text-gray-800">
                                {section.items.map((item) => (
                                    <li key={item.id}>• {item.content}</li>
                                ))}
                            </ul>
                        </div>
                    )
                ));
            case 'references':
                if (!references?.length) return null;
                return (
                    <div key="references" className="mb-6">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">References</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {references.map((ref) => (
                                <div key={ref.id} className="text-xs">
                                    <div className="font-semibold text-gray-900">{ref.name}</div>
                                    <div className="text-gray-700">{ref.title}{ref.organization && `, ${ref.organization}`}</div>
                                    <div className="text-gray-600">{ref.email} | {ref.phone}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white p-8 text-gray-900" id="resume-preview">
            {/* Header */}
            <div className="text-center mb-6 pb-4">
                <h1 className="text-3xl font-light tracking-wide text-gray-900 mb-2">{personalInfo.fullName}</h1>
                <div className="w-16 h-0.5 bg-gray-400 mx-auto mb-3"></div>
                <div className="text-xs text-gray-600 space-x-3">
                    {personalInfo.location && <span>{personalInfo.location}</span>}
                    {personalInfo.email && <span>| {personalInfo.email}</span>}
                    {personalInfo.phone && <span>| {personalInfo.phone}</span>}
                </div>
                <div className="text-xs text-gray-600 space-x-3 mt-1">
                    {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                    {personalInfo.github && <span>| {personalInfo.github}</span>}
                    {personalInfo.portfolio && <span>| {personalInfo.portfolio}</span>}
                </div>
            </div>
            {sectionOrder.map((id) => renderSection(id))}
        </div>
    );
}
