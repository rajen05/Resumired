import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';

function SummarySection({ summary }) {
    if (!summary) return null;
    return (
        <div className="mb-5">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1">Summary of Qualifications</h2>
            <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">{summary}</p>
        </div>
    );
}

function EducationSectionPreview({ education }) {
    if (!education?.length) return null;
    return (
        <div className="mb-5">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1">Education</h2>
            <div className="space-y-2">
                {education.map((edu) => (
                    <div key={edu.id}>
                        <div className="flex justify-between">
                            <span className="font-semibold text-xs">{edu.school}</span>
                            <span className="text-xs text-slate-600">{edu.location}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-700">{edu.degree}</span>
                            <span className="text-slate-600">{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</span>
                        </div>
                        {edu.gpa && <div className="text-xs text-slate-600">CGPA: {edu.gpa}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
}

function SkillsSectionPreview({ skills }) {
    if (!skills?.length) return null;
    return (
        <div className="mb-5">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1">Technical Skills</h2>
            <div className="text-xs leading-relaxed text-slate-700">
                {skills.join(' • ')}
            </div>
        </div>
    );
}

function ExperienceSectionPreview({ experience }) {
    if (!experience?.length) return null;
    return (
        <div className="mb-5">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1">Relevant Experience</h2>
            <div className="space-y-3">
                {experience.map((exp) => (
                    <div key={exp.id}>
                        <div className="flex justify-between">
                            <span className="font-semibold text-xs">{exp.company}</span>
                            <span className="text-xs text-slate-600">{exp.location}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="italic text-slate-700">{exp.title}</span>
                            <span className="text-slate-600">{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</span>
                        </div>
                        <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-600 mt-1">{exp.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProjectsSectionPreview({ projects }) {
    if (!projects?.length) return null;
    return (
        <div className="mb-5">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1">Project Experience</h2>
            <div className="space-y-3">
                {projects.map((proj) => (
                    <div key={proj.id}>
                        <div className="flex justify-between">
                            <span className="font-semibold text-xs">
                                {proj.name}
                                {proj.technologies && <span className="font-normal text-slate-600"> | {proj.technologies}</span>}
                            </span>
                            <span className="text-xs text-slate-600">{proj.date}</span>
                        </div>
                        <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-600 mt-1">{proj.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CertificationsSectionPreview({ certifications }) {
    if (!certifications?.length) return null;
    return (
        <div className="mb-5">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1">Certifications</h2>
            <ul className="text-xs text-slate-700 space-y-1">
                {certifications.map((cert) => (
                    <li key={cert.id}>• {cert.name}{cert.issuer && <span className="text-slate-600"> – {cert.issuer}</span>}</li>
                ))}
            </ul>
        </div>
    );
}

function CustomSectionsPreview({ customSections }) {
    if (!customSections?.length) return null;
    return (
        <>
            {customSections.map((section) => (
                section.items?.length > 0 && (
                    <div key={section.id} className="mb-5">
                        <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1">{section.title}</h2>
                        <ul className="text-xs text-slate-700 space-y-1">
                            {section.items.map((item) => (
                                <li key={item.id}>• {item.content}</li>
                            ))}
                        </ul>
                    </div>
                )
            ))}
        </>
    );
}

function ReferencesSectionPreview({ references }) {
    if (!references?.length) return null;
    return (
        <div className="mb-5">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1">References</h2>
            <div className="grid grid-cols-2 gap-4">
                {references.map((ref) => (
                    <div key={ref.id} className="text-xs">
                        <div className="font-semibold">{ref.name}</div>
                        <div className="text-slate-600">{ref.title}{ref.organization && `, ${ref.organization}`}</div>
                        {ref.email && <div className="text-slate-600">Email: {ref.email}</div>}
                        {ref.phone && <div className="text-slate-600">Phone: {ref.phone}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function StandardTemplate({ data }) {
    const { sectionOrder } = useResumeStore();
    const { personalInfo, summary, experience, education, skills, projects, certifications, references, customSections } = data;

    const renderSection = (sectionId) => {
        switch (sectionId) {
            case 'summary':
                return <SummarySection key="summary" summary={summary} />;
            case 'education':
                return <EducationSectionPreview key="education" education={education} />;
            case 'skills':
                return <SkillsSectionPreview key="skills" skills={skills} />;
            case 'experience':
                return <ExperienceSectionPreview key="experience" experience={experience} />;
            case 'projects':
                return <ProjectsSectionPreview key="projects" projects={projects} />;
            case 'certifications':
                return <CertificationsSectionPreview key="certifications" certifications={certifications} />;
            case 'customSections':
                return <CustomSectionsPreview key="customSections" customSections={customSections} />;
            case 'references':
                return <ReferencesSectionPreview key="references" references={references} />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white p-8 text-slate-900" id="resume-preview">
            {/* Header - Always on top */}
            <div className="mb-6 border-b-2 border-slate-900 pb-4">
                <h1 className="mb-2 text-3xl font-bold uppercase tracking-wide">{personalInfo.fullName}</h1>
                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                    {personalInfo.location && <span>{personalInfo.location}</span>}
                    {personalInfo.email && <span>• {personalInfo.email}</span>}
                    {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-slate-600 mt-1">
                    {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                    {personalInfo.github && <span>• {personalInfo.github}</span>}
                    {personalInfo.portfolio && <span>• {personalInfo.portfolio}</span>}
                </div>
            </div>

            {/* Sections rendered in order */}
            {sectionOrder.map((sectionId) => renderSection(sectionId))}
        </div>
    );
}
