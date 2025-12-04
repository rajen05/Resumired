import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Trash2, Plus, Users } from 'lucide-react';

export function ReferencesSection() {
    const { resumeData, addReference, updateReference, removeReference } = useResumeStore();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" /> References
                </CardTitle>
                <Button
                    onClick={() => addReference({ name: '', title: '', organization: '', email: '', phone: '' })}
                    size="sm"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Reference
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {resumeData.references.map((ref) => (
                    <div key={ref.id} className="grid gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Label className="text-xs">Name</Label>
                            <Input
                                value={ref.name}
                                onChange={(e) => updateReference(ref.id, { name: e.target.value })}
                                placeholder="Manpreet Kaur Khera"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Title</Label>
                            <Input
                                value={ref.title}
                                onChange={(e) => updateReference(ref.id, { title: e.target.value })}
                                placeholder="Lecturer"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Organization</Label>
                            <Input
                                value={ref.organization}
                                onChange={(e) => updateReference(ref.id, { organization: e.target.value })}
                                placeholder="Asia Pacific University"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Email</Label>
                            <Input
                                value={ref.email}
                                onChange={(e) => updateReference(ref.id, { email: e.target.value })}
                                placeholder="manpreet.kaur@apu.edu.my"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Phone</Label>
                            <Input
                                value={ref.phone}
                                onChange={(e) => updateReference(ref.id, { phone: e.target.value })}
                                placeholder="+60 16-596 5352"
                            />
                        </div>
                        <div className="flex items-end justify-end">
                            <Button variant="ghost" size="sm" onClick={() => removeReference(ref.id)} className="text-red-500 hover:bg-red-50">
                                <Trash2 className="mr-2 h-4 w-4" /> Remove
                            </Button>
                        </div>
                    </div>
                ))}
                {resumeData.references.length === 0 && (
                    <p className="text-center text-sm text-slate-500">No references added yet.</p>
                )}
            </CardContent>
        </Card>
    );
}
