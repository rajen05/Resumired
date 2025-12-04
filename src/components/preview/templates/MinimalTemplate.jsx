import React from 'react';

// Minimal Template - Clean and spacious
export function MinimalTemplate({ data, sectionOrder }) {
    const { personalInfo, summary, experience, education, skills, projects, certifications, references, customSections } = data;

    const renderSection = (sectionId) => {
        switch (sectionId) {
            case 'summary':
                if (!summary) return null;
                return (
                    <div key="summary" className="mb-6">
                        <p className="text-xs leading-relaxed text-gray-700 whitespace-pre-wrap">{summary}</p>
                    </div>
                );
            case 'education':
                if (!education?.length) return null;
                return (
                    <div key="education" className="mb-6">
                        <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Education</h2>
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-3">
                                <div className="text-xs font-medium">{edu.school}</div>
                                <div className="text-xs text-gray-600">{edu.degree} • {edu.startDate} – {edu.endDate}</div>
                            </div>
                        ))}
                    </div>
                );
            case 'skills':
                if (!skills?.length) return null;
                return (
                    <div key="skills" className="mb-6">
                        <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Skills</h2>
                        <p className="text-xs text-gray-700">{skills.join(', ')}</p>
                    </div>
                );
            case 'experience':
                if (!experience?.length) return null;
                return (
                    <div key="experience" className="mb-6">
                        <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Experience</h2>
                        {experience.map((exp) => (
                            <div key={exp.id} className="mb-4">
                                <div className="text-xs font-medium">{exp.title}</div>
                                <div className="text-xs text-gray-600 mb-1">{exp.company} • {exp.startDate} – {exp.endDate}</div>
                                <p className="text-xs text-gray-700 whitespace-pre-wrap">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'projects':
                if (!projects?.length) return null;
                return (
                    <div key="projects" className="mb-6">
                        <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Projects</h2>
                        {projects.map((proj) => (
                            <div key={proj.id} className="mb-4">
                                <div className="text-xs font-medium">{proj.name}</div>
                                <div className="text-xs text-gray-600 mb-1">{proj.technologies} • {proj.date}</div>
                                <p className="text-xs text-gray-700 whitespace-pre-wrap">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'certifications':
                if (!certifications?.length) return null;
                return (
                    <div key="certifications" className="mb-6">
                        <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Certifications</h2>
                        {certifications.map((cert) => (
                            <div key={cert.id} className="text-xs text-gray-700 mb-1">
                                {cert.name}{cert.issuer && ` — ${cert.issuer}`}
                            </div>
                        ))}
                    </div>
                );
            case 'customSections':
                if (!customSections?.length) return null;
                return customSections.map((section) => (
                    section.items?.length > 0 && (
                        <div key={section.id} className="mb-6">
                            <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-3">{section.title}</h2>
                            {section.items.map((item) => (
                                <div key={item.id} className="text-xs text-gray-700 mb-1">{item.content}</div>
                            ))}
                        </div>
                    )
                ));
            case 'references':
                if (!references?.length) return null;
                return (
                    <div key="references" className="mb-6">
                        <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-3">References</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {references.map((ref) => (
                                <div key={ref.id} className="text-xs">
                                    <div className="font-medium">{ref.name}</div>
                                    <div className="text-gray-600">{ref.title}</div>
                                    <div className="text-gray-500">{ref.email}</div>
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
        <div className="bg-white p-10 text-gray-900 font-sans" id="resume-preview">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-normal text-gray-900 mb-2">{personalInfo.fullName}</h1>
                <div className="text-xs text-gray-500 space-x-2">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                    {personalInfo.location && <span>• {personalInfo.location}</span>}
                </div>
                <div className="text-xs text-gray-500 space-x-2 mt-1">
                    {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                    {personalInfo.github && <span>• {personalInfo.github}</span>}
                    {personalInfo.portfolio && <span>• {personalInfo.portfolio}</span>}
                </div>
            </div>
            {sectionOrder.map((id) => renderSection(id))}
        </div>
    );
}
