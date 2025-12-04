import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Trash2, Plus } from 'lucide-react';

export function EducationSection() {
    const { resumeData, addEducation, updateEducation, removeEducation } = useResumeStore();

    // We need to add these actions to the store first, but I'll write the component assuming they exist
    // I will update the store in the next step if I haven't already (I haven't)

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Education</CardTitle>
                <Button onClick={() => addEducation({ school: '', degree: '', startDate: '', endDate: '', description: '' })} size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Education
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {resumeData.education.map((edu) => (
                    <div key={edu.id} className="grid gap-4 rounded-lg border border-slate-100 bg-slate-50 p-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>School / University</Label>
                            <Input
                                value={edu.school}
                                onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                                placeholder="University of Technology"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Degree</Label>
                            <Input
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                                placeholder="Bachelor of Science in CS"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                                value={edu.startDate}
                                onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                                placeholder="MM/YYYY"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                                value={edu.endDate}
                                onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                                placeholder="MM/YYYY"
                            />
                        </div>
                        <div className="col-span-2 flex justify-end">
                            <Button variant="ghost" size="sm" onClick={() => removeEducation(edu.id)} className="text-red-500 hover:bg-red-50 hover:text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /> Remove
                            </Button>
                        </div>
                    </div>
                ))}
                {resumeData.education.length === 0 && (
                    <p className="text-center text-sm text-slate-500">No education added yet.</p>
                )}
            </CardContent>
        </Card>
    );
}
