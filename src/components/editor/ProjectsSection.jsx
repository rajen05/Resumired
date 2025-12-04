import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Trash2, Plus } from 'lucide-react';

export function ProjectsSection() {
    const { resumeData, addProject, updateProject, removeProject } = useResumeStore();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Projects</CardTitle>
                <Button
                    onClick={() => addProject({ name: '', technologies: '', date: '', description: '' })}
                    size="sm"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Project
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {resumeData.projects.map((proj) => (
                    <div key={proj.id} className="grid gap-4 rounded-lg border border-slate-100 bg-slate-50 p-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Project Name</Label>
                            <Input
                                value={proj.name}
                                onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                                placeholder="FinSync - AI Investment Platform"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Technologies</Label>
                            <Input
                                value={proj.technologies}
                                onChange={(e) => updateProject(proj.id, { technologies: e.target.value })}
                                placeholder="React, TypeScript, Gemini AI"
                            />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label>Date Range</Label>
                            <Input
                                value={proj.date}
                                onChange={(e) => updateProject(proj.id, { date: e.target.value })}
                                placeholder="Sept 2025 – Dec 2025"
                            />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label>Description</Label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                value={proj.description}
                                onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                                placeholder="• Built a full-stack platform with real-time data&#10;• Implemented AI-powered features"
                            />
                        </div>
                        <div className="sm:col-span-2 flex justify-end">
                            <Button variant="ghost" size="sm" onClick={() => removeProject(proj.id)} className="text-red-500 hover:bg-red-50">
                                <Trash2 className="mr-2 h-4 w-4" /> Remove
                            </Button>
                        </div>
                    </div>
                ))}
                {resumeData.projects.length === 0 && (
                    <p className="text-center text-sm text-slate-500">No projects added yet.</p>
                )}
            </CardContent>
        </Card>
    );
}
