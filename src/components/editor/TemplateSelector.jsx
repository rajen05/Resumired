import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { LayoutTemplate, Check } from 'lucide-react';

const TEMPLATES = [
    {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional clean layout with bold headers',
        preview: 'border-t-4 border-slate-800',
    },
    {
        id: 'modern',
        name: 'Modern',
        description: 'Contemporary design with subtle accents',
        preview: 'border-l-4 border-blue-500',
    },
    {
        id: 'professional',
        name: 'Professional',
        description: 'Executive style with elegant typography',
        preview: 'border-b-2 border-slate-400',
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Clean and spacious with focus on content',
        preview: 'border border-slate-200',
    },
    {
        id: 'compact',
        name: 'Compact',
        description: 'Dense layout for experienced professionals',
        preview: 'border-t-2 border-b-2 border-slate-600',
    },
];

export function TemplateSelector() {
    const { selectedTemplate, setSelectedTemplate } = useResumeStore();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <LayoutTemplate className="h-5 w-5" /> Resume Templates
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-slate-500 mb-4">
                    All templates are ATS-friendly with clean, parseable layouts.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {TEMPLATES.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className={`relative p-4 rounded-lg border-2 transition-all text-left ${selectedTemplate === template.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-slate-200 hover:border-slate-300 bg-white'
                                }`}
                        >
                            {selectedTemplate === template.id && (
                                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                                    <Check className="h-3 w-3" />
                                </div>
                            )}
                            <div className={`h-16 w-full mb-3 bg-slate-100 rounded ${template.preview}`}>
                                <div className="p-2 space-y-1">
                                    <div className="h-2 w-3/4 bg-slate-300 rounded"></div>
                                    <div className="h-1 w-1/2 bg-slate-200 rounded"></div>
                                    <div className="h-1 w-full bg-slate-200 rounded mt-2"></div>
                                    <div className="h-1 w-full bg-slate-200 rounded"></div>
                                </div>
                            </div>
                            <div className="font-medium text-sm text-slate-900">{template.name}</div>
                            <div className="text-xs text-slate-500 mt-1">{template.description}</div>
                        </button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
