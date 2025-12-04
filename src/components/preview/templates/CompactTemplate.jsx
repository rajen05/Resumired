import React from 'react';

// Compact Template - Dense layout for experienced professionals
export function CompactTemplate({ data, sectionOrder }) {
    const { personalInfo, summary, experience, education, skills, projects, certifications, references, customSections } = data;

    const renderSection = (sectionId) => {
        switch (sectionId) {
            case 'summary':
                if (!summary) return null;
                return (
                    <div key="summary" className="mb-3">
                        <h2 className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-0.5 mb-1">Summary</h2>
                        <p className="text-[10px] leading-tight whitespace-pre-wrap px-1">{summary}</p>
                    </div>
                );
            case 'education':
                if (!education?.length) return null;
                return (
                    <div key="education" className="mb-3">
                        <h2 className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-0.5 mb-1">Education</h2>
                        <div className="px-1 space-y-1">
                            {education.map((edu) => (
                                <div key={edu.id} className="flex justify-between text-[10px]">
                                    <span><strong>{edu.school}</strong> — {edu.degree}</span>
                                    <span className="text-gray-600">{edu.startDate}–{edu.endDate}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'skills':
                if (!skills?.length) return null;
                return (
                    <div key="skills" className="mb-3">
                        <h2 className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-0.5 mb-1">Technical Skills</h2>
                        <p className="text-[10px] px-1">{skills.join(' | ')}</p>
                    </div>
                );
            case 'experience':
                if (!experience?.length) return null;
                return (
                    <div key="experience" className="mb-3">
                        <h2 className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-0.5 mb-1">Experience</h2>
                        <div className="px-1 space-y-2">
                            {experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between text-[10px]">
                                        <span><strong>{exp.title}</strong> — {exp.company}</span>
                                        <span className="text-gray-600">{exp.startDate}–{exp.endDate}</span>
                                    </div>
                                    <p className="text-[10px] leading-tight whitespace-pre-wrap text-gray-700">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'projects':
                if (!projects?.length) return null;
                return (
                    <div key="projects" className="mb-3">
                        <h2 className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-0.5 mb-1">Projects</h2>
                        <div className="px-1 space-y-2">
                            {projects.map((proj) => (
                                <div key={proj.id}>
                                    <div className="flex justify-between text-[10px]">
                                        <span><strong>{proj.name}</strong> — {proj.technologies}</span>
                                        <span className="text-gray-600">{proj.date}</span>
                                    </div>
                                    <p className="text-[10px] leading-tight whitespace-pre-wrap text-gray-700">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'certifications':
                if (!certifications?.length) return null;
                return (
                    <div key="certifications" className="mb-3">
                        <h2 className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-0.5 mb-1">Certifications</h2>
                        <div className="px-1 text-[10px] columns-2">
                            {certifications.map((cert) => (
                                <div key={cert.id}>• {cert.name}</div>
                            ))}
                        </div>
                    </div>
                );
            case 'customSections':
                if (!customSections?.length) return null;
                return customSections.map((section) => (
                    section.items?.length > 0 && (
                        <div key={section.id} className="mb-3">
                            <h2 className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-0.5 mb-1">{section.title}</h2>
                            <div className="px-1 text-[10px]">
                                {section.items.map((item) => (
                                    <div key={item.id}>• {item.content}</div>
                                ))}
                            </div>
                        </div>
                    )
                ));
            case 'references':
                if (!references?.length) return null;
                return (
                    <div key="references" className="mb-3">
                        <h2 className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-0.5 mb-1">References</h2>
                        <div className="px-1 grid grid-cols-2 gap-2 text-[10px]">
                            {references.map((ref) => (
                                <div key={ref.id}>
                                    <strong>{ref.name}</strong> — {ref.title}<br />
                                    {ref.email} | {ref.phone}
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
        <div className="bg-white p-4 text-gray-900 font-sans" id="resume-preview">
            {/* Header */}
            <div className="mb-3 border-b border-gray-300 pb-2">
                <div className="flex justify-between items-baseline">
                    <h1 className="text-lg font-bold">{personalInfo.fullName}</h1>
                    <div className="text-[10px] text-gray-600">
                        {personalInfo.email} | {personalInfo.phone}
                    </div>
                </div>
                <div className="text-[10px] text-gray-600 flex justify-between">
                    <span>{personalInfo.location}</span>
                    <span>
                        {personalInfo.linkedin} {personalInfo.github && `| ${personalInfo.github}`} {personalInfo.portfolio && `| ${personalInfo.portfolio}`}
                    </span>
                </div>
            </div>
            {sectionOrder.map((id) => renderSection(id))}
        </div>
    );
}
