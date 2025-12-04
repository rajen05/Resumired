import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ArrowUp, ArrowDown, GripVertical, Layers } from 'lucide-react';

const SECTION_LABELS = {
    summary: 'Summary',
    education: 'Education',
    skills: 'Technical Skills',
    experience: 'Experience',
    projects: 'Projects',
    certifications: 'Certifications',
    customSections: 'Custom Sections',
    references: 'References',
};

export function SectionReorder() {
    const { sectionOrder, moveSectionUp, moveSectionDown } = useResumeStore();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" /> Reorder Sections
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-slate-500 mb-4">
                    Drag or use arrows to change the order of sections in your resume.
                </p>
                <div className="space-y-2">
                    {sectionOrder.map((sectionId, index) => (
                        <div
                            key={sectionId}
                            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm hover:border-blue-300 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <GripVertical className="h-5 w-5 text-slate-400 cursor-grab" />
                                <span className="font-medium text-slate-700">
                                    {SECTION_LABELS[sectionId] || sectionId}
                                </span>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => moveSectionUp(sectionId)}
                                    disabled={index === 0}
                                    className="h-8 w-8 p-0"
                                    title="Move up"
                                >
                                    <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => moveSectionDown(sectionId)}
                                    disabled={index === sectionOrder.length - 1}
                                    className="h-8 w-8 p-0"
                                    title="Move down"
                                >
                                    <ArrowDown className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
