import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import { Button } from '../components/ui/Button';
import { Check, ArrowRight } from 'lucide-react';
import { ClassicTemplate } from '../components/preview/templates/ClassicTemplate';
import { ModernTemplate } from '../components/preview/templates/ModernTemplate';
import { ProfessionalTemplate } from '../components/preview/templates/ProfessionalTemplate';
import { MinimalTemplate } from '../components/preview/templates/MinimalTemplate';
import { CompactTemplate } from '../components/preview/templates/CompactTemplate';

// Mock data for preview
const MOCK_DATA = {
    personalInfo: {
        fullName: 'John Anderson',
        email: 'john.anderson@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/johnanderson',
        github: 'github.com/johnanderson',
        portfolio: 'johnanderson.dev',
    },
    summary: 'Full-stack developer with 5+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies.',
    experience: [
        { id: '1', title: 'Senior Software Engineer', company: 'Tech Corp', startDate: 'Jan 2022', endDate: 'Present', description: '• Led development of microservices architecture\n• Improved system performance by 40%' },
        { id: '2', title: 'Software Developer', company: 'StartupXYZ', startDate: 'Jun 2019', endDate: 'Dec 2021', description: '• Built React frontend for SaaS platform\n• Implemented CI/CD pipelines' },
    ],
    education: [
        { id: '1', school: 'University of California', degree: 'B.S. Computer Science', startDate: '2015', endDate: '2019', gpa: '3.8' },
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'Git'],
    projects: [
        { id: '1', name: 'E-commerce Platform', technologies: 'React, Node.js, MongoDB', date: '2023', description: '• Built full-stack e-commerce solution' },
    ],
    certifications: [
        { id: '1', name: 'AWS Solutions Architect', issuer: 'Amazon' },
    ],
    references: [],
    customSections: [],
};

const SECTION_ORDER = ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'references', 'customSections'];

const TEMPLATES = [
    {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional layout with bold headers and underlines. Perfect for conservative industries.',
        Component: ClassicTemplate,
    },
    {
        id: 'modern',
        name: 'Modern',
        description: 'Contemporary design with blue accents and left borders. Great for tech and creative roles.',
        Component: ModernTemplate,
    },
    {
        id: 'professional',
        name: 'Professional',
        description: 'Executive style with elegant typography. Ideal for senior positions and management.',
        Component: ProfessionalTemplate,
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Clean and spacious with light gray headings. Perfect for design and creative fields.',
        Component: MinimalTemplate,
    },
    {
        id: 'compact',
        name: 'Compact',
        description: 'Dense layout for experienced professionals with extensive history.',
        Component: CompactTemplate,
    },
];

export function Templates() {
    const navigate = useNavigate();
    const { setSelectedTemplate } = useResumeStore();

    const handleSelectTemplate = (templateId) => {
        setSelectedTemplate(templateId);
        navigate('/builder');
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                    Choose Your <span className="text-blue-600">Template</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    All templates are ATS-friendly with clean, parseable layouts that get past applicant tracking systems.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {TEMPLATES.map((template) => {
                    const TemplateComponent = template.Component;
                    return (
                        <div
                            key={template.id}
                            className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-xl hover:border-blue-400"
                        >
                            {/* Live Preview Box */}
                            <div className="mb-4 h-72 rounded-lg border border-slate-200 overflow-hidden bg-white">
                                <div
                                    className="origin-top-left"
                                    style={{
                                        transform: 'scale(0.28)',
                                        width: '8.5in',
                                        height: '11in',
                                        transformOrigin: 'top left',
                                    }}
                                >
                                    <TemplateComponent data={MOCK_DATA} sectionOrder={SECTION_ORDER} />
                                </div>
                            </div>

                            {/* Template Info */}
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">{template.name}</h3>
                            <p className="text-sm text-slate-600 mb-4">{template.description}</p>

                            {/* CTA Button */}
                            <Button
                                onClick={() => handleSelectTemplate(template.id)}
                                className="w-full"
                            >
                                Use This Template
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    );
                })}
            </div>

            {/* ATS Info Section */}
            <div className="mt-16 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    All Templates Are ATS-Optimized
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto mb-6">
                    Our templates are designed with Applicant Tracking Systems in mind. No graphics, tables, or
                    complex formatting that could confuse ATS parsers.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium">No Graphics</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium">Standard Fonts</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium">Clear Sections</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium">Parseable Layout</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
