import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { X, Plus } from 'lucide-react';

export function SkillsSection() {
    const { resumeData, addSkill, removeSkill } = useResumeStore();
    const [newSkill, setNewSkill] = useState('');

    const handleAddSkill = () => {
        if (newSkill.trim()) {
            addSkill(newSkill.trim());
            setNewSkill('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add a skill (e.g. React, Python)"
                    />
                    <Button onClick={handleAddSkill} size="sm">
                        <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, index) => (
                        <div key={index} className="flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-900">
                            <span>{skill}</span>
                            <button
                                onClick={() => removeSkill(skill)}
                                className="ml-2 rounded-full p-0.5 hover:bg-slate-200"
                            >
                                <X className="h-3 w-3 text-slate-500" />
                            </button>
                        </div>
                    ))}
                    {resumeData.skills.length === 0 && (
                        <p className="text-sm text-slate-500">No skills added yet.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
