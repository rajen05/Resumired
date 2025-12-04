import React from 'react';

// Classic Template - Traditional with bold headers and underlines
export function ClassicTemplate({ data, sectionOrder }) {
    const { personalInfo, summary, experience, education, skills, projects, certifications, references, customSections } = data;

    const renderSection = (sectionId) => {
        switch (sectionId) {
            case 'summary':
                if (!summary) return null;
                return (
                    <div key="summary" className="mb-5">
                        <h2 className="text-sm font-bold uppercase tracking-wider border-b-2 border-black pb-1 mb-2">Summary</h2>
                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{summary}</p>
                    </div>
                );
            case 'education':
                if (!education?.length) return null;
                return (
                    <div key="education" className="mb-5">
                        <h2 className="text-sm font-bold uppercase tracking-wider border-b-2 border-black pb-1 mb-2">Education</h2>
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-2">
                                <div className="flex justify-between font-semibold text-xs">
                                    <span>{edu.school}</span>
                                    <span>{edu.startDate} – {edu.endDate}</span>
                                </div>
                                <div className="text-xs">{edu.degree}</div>
                            </div>
                        ))}
                    </div>
                );
            case 'skills':
                if (!skills?.length) return null;
                return (
                    <div key="skills" className="mb-5">
                        <h2 className="text-sm font-bold uppercase tracking-wider border-b-2 border-black pb-1 mb-2">Skills</h2>
                        <p className="text-xs">{skills.join(' • ')}</p>
                    </div>
                );
            case 'experience':
                if (!experience?.length) return null;
                return (
                    <div key="experience" className="mb-5">
                        <h2 className="text-sm font-bold uppercase tracking-wider border-b-2 border-black pb-1 mb-2">Experience</h2>
                        {experience.map((exp) => (
                            <div key={exp.id} className="mb-3">
                                <div className="flex justify-between font-semibold text-xs">
                                    <span>{exp.title} | {exp.company}</span>
                                    <span>{exp.startDate} – {exp.endDate}</span>
                                </div>
                                <p className="text-xs whitespace-pre-wrap mt-1">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'projects':
                if (!projects?.length) return null;
                return (
                    <div key="projects" className="mb-5">
                        <h2 className="text-sm font-bold uppercase tracking-wider border-b-2 border-black pb-1 mb-2">Projects</h2>
                        {projects.map((proj) => (
                            <div key={proj.id} className="mb-3">
                                <div className="flex justify-between font-semibold text-xs">
                                    <span>{proj.name} {proj.technologies && `| ${proj.technologies}`}</span>
                                    <span>{proj.date}</span>
                                </div>
                                <p className="text-xs whitespace-pre-wrap mt-1">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'certifications':
                if (!certifications?.length) return null;
                return (
                    <div key="certifications" className="mb-5">
                        <h2 className="text-sm font-bold uppercase tracking-wider border-b-2 border-black pb-1 mb-2">Certifications</h2>
                        <ul className="text-xs space-y-1">
                            {certifications.map((cert) => (
                                <li key={cert.id}>• {cert.name}{cert.issuer && ` – ${cert.issuer}`}</li>
                            ))}
                        </ul>
                    </div>
                );
            case 'customSections':
                if (!customSections?.length) return null;
                return customSections.map((section) => (
                    section.items?.length > 0 && (
                        <div key={section.id} className="mb-5">
                            <h2 className="text-sm font-bold uppercase tracking-wider border-b-2 border-black pb-1 mb-2">{section.title}</h2>
                            <ul className="text-xs space-y-1">
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
                    <div key="references" className="mb-5">
                        <h2 className="text-sm font-bold uppercase tracking-wider border-b-2 border-black pb-1 mb-2">References</h2>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            {references.map((ref) => (
                                <div key={ref.id}>
                                    <div className="font-semibold">{ref.name}</div>
                                    <div>{ref.title}{ref.organization && `, ${ref.organization}`}</div>
                                    {ref.email && <div>{ref.email}</div>}
                                    {ref.phone && <div>{ref.phone}</div>}
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
        <div className="bg-white p-8 text-black font-serif" id="resume-preview">
            {/* Header */}
            <div className="text-center mb-6 border-b-2 border-black pb-4">
                <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">{personalInfo.fullName}</h1>
                <div className="text-xs space-x-2">
                    {personalInfo.location && <span>{personalInfo.location}</span>}
                    {personalInfo.email && <span>• {personalInfo.email}</span>}
                    {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                </div>
                <div className="text-xs space-x-2 mt-1">
                    {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                    {personalInfo.github && <span>• {personalInfo.github}</span>}
                    {personalInfo.portfolio && <span>• {personalInfo.portfolio}</span>}
                </div>
            </div>
            {sectionOrder.map((id) => renderSection(id))}
        </div>
    );
}
