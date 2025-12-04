import React from 'react';

// Modern Template - Clean with blue accent line
export function ModernTemplate({ data, sectionOrder }) {
    const { personalInfo, summary, experience, education, skills, projects, certifications, references, customSections } = data;

    const renderSection = (sectionId) => {
        switch (sectionId) {
            case 'summary':
                if (!summary) return null;
                return (
                    <div key="summary" className="mb-5">
                        <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-blue-600"></span> Summary
                        </h2>
                        <p className="text-xs leading-relaxed text-gray-700 whitespace-pre-wrap">{summary}</p>
                    </div>
                );
            case 'education':
                if (!education?.length) return null;
                return (
                    <div key="education" className="mb-5">
                        <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-blue-600"></span> Education
                        </h2>
                        {education.map((edu) => (
                            <div key={edu.id} className="mb-2 pl-4 border-l-2 border-gray-200">
                                <div className="font-medium text-xs">{edu.school}</div>
                                <div className="text-xs text-gray-600">{edu.degree}</div>
                                <div className="text-xs text-gray-500">{edu.startDate} – {edu.endDate}</div>
                            </div>
                        ))}
                    </div>
                );
            case 'skills':
                if (!skills?.length) return null;
                return (
                    <div key="skills" className="mb-5">
                        <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-blue-600"></span> Skills
                        </h2>
                        <div className="flex flex-wrap gap-1">
                            {skills.map((skill, i) => (
                                <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded">{skill}</span>
                            ))}
                        </div>
                    </div>
                );
            case 'experience':
                if (!experience?.length) return null;
                return (
                    <div key="experience" className="mb-5">
                        <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-blue-600"></span> Experience
                        </h2>
                        {experience.map((exp) => (
                            <div key={exp.id} className="mb-3 pl-4 border-l-2 border-gray-200">
                                <div className="font-medium text-xs">{exp.title}</div>
                                <div className="text-xs text-gray-600">{exp.company} • {exp.startDate} – {exp.endDate}</div>
                                <p className="text-xs text-gray-700 whitespace-pre-wrap mt-1">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'projects':
                if (!projects?.length) return null;
                return (
                    <div key="projects" className="mb-5">
                        <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-blue-600"></span> Projects
                        </h2>
                        {projects.map((proj) => (
                            <div key={proj.id} className="mb-3 pl-4 border-l-2 border-gray-200">
                                <div className="font-medium text-xs">{proj.name}</div>
                                <div className="text-xs text-gray-500">{proj.technologies} • {proj.date}</div>
                                <p className="text-xs text-gray-700 whitespace-pre-wrap mt-1">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'certifications':
                if (!certifications?.length) return null;
                return (
                    <div key="certifications" className="mb-5">
                        <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-blue-600"></span> Certifications
                        </h2>
                        <ul className="text-xs space-y-1 pl-4">
                            {certifications.map((cert) => (
                                <li key={cert.id} className="text-gray-700">• {cert.name}{cert.issuer && <span className="text-gray-500"> – {cert.issuer}</span>}</li>
                            ))}
                        </ul>
                    </div>
                );
            case 'customSections':
                if (!customSections?.length) return null;
                return customSections.map((section) => (
                    section.items?.length > 0 && (
                        <div key={section.id} className="mb-5">
                            <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                                <span className="w-8 h-0.5 bg-blue-600"></span> {section.title}
                            </h2>
                            <ul className="text-xs space-y-1 pl-4 text-gray-700">
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
                        <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-blue-600"></span> References
                        </h2>
                        <div className="grid grid-cols-2 gap-4 text-xs pl-4">
                            {references.map((ref) => (
                                <div key={ref.id}>
                                    <div className="font-medium">{ref.name}</div>
                                    <div className="text-gray-600">{ref.title}{ref.organization && `, ${ref.organization}`}</div>
                                    {ref.email && <div className="text-gray-500">{ref.email}</div>}
                                    {ref.phone && <div className="text-gray-500">{ref.phone}</div>}
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
        <div className="bg-white p-8 text-gray-900 font-sans" id="resume-preview">
            {/* Header */}
            <div className="mb-6 pb-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{personalInfo.fullName}</h1>
                <div className="text-xs text-gray-600 flex flex-wrap gap-2">
                    {personalInfo.location && <span>{personalInfo.location}</span>}
                    {personalInfo.email && <span>• {personalInfo.email}</span>}
                    {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                </div>
                <div className="text-xs text-blue-600 flex flex-wrap gap-2 mt-1">
                    {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                    {personalInfo.github && <span>• {personalInfo.github}</span>}
                    {personalInfo.portfolio && <span>• {personalInfo.portfolio}</span>}
                </div>
            </div>
            {sectionOrder.map((id) => renderSection(id))}
        </div>
    );
}
