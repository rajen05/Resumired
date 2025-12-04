import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Trash2, Plus } from 'lucide-react';

export function ExperienceSection() {
    const { resumeData, addExperience, updateExperience, removeExperience } = useResumeStore();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Work Experience</CardTitle>
                <Button onClick={() => addExperience({ title: '', company: '', startDate: '', endDate: '', description: '' })} size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Job
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="grid gap-4 rounded-lg border border-slate-100 bg-slate-50 p-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Job Title</Label>
                            <Input
                                value={exp.title}
                                onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                                placeholder="Software Engineer"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Company</Label>
                            <Input
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                                placeholder="Acme Corp"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                                type="text"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                                placeholder="MM/YYYY"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                                type="text"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                                placeholder="Present or MM/YYYY"
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label>Description</Label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                                value={exp.description}
                                onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                                placeholder="Key responsibilities and achievements..."
                            />
                        </div>
                        <div className="col-span-2 flex justify-end">
                            <Button variant="ghost" size="sm" onClick={() => removeExperience(exp.id)} className="text-red-500 hover:bg-red-50 hover:text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /> Remove
                            </Button>
                        </div>
                    </div>
                ))}
                {resumeData.experience.length === 0 && (
                    <p className="text-center text-sm text-slate-500">No work experience added yet.</p>
                )}
            </CardContent>
        </Card>
    );
}
