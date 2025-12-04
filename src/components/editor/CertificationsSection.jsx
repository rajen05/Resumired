import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Trash2, Plus, Award } from 'lucide-react';

export function CertificationsSection() {
    const { resumeData, addCertification, updateCertification, removeCertification } = useResumeStore();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" /> Certifications
                </CardTitle>
                <Button
                    onClick={() => addCertification({ name: '', issuer: '', date: '' })}
                    size="sm"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Certification
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {resumeData.certifications.map((cert) => (
                    <div key={cert.id} className="flex items-start gap-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
                        <div className="flex-1 grid gap-3 sm:grid-cols-3">
                            <div className="space-y-1 sm:col-span-2">
                                <Label className="text-xs">Certification Name</Label>
                                <Input
                                    value={cert.name}
                                    onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                                    placeholder="Artificial Intelligence Fundamentals"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Issuer</Label>
                                <Input
                                    value={cert.issuer}
                                    onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                                    placeholder="IBM"
                                />
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeCertification(cert.id)} className="text-red-500 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                {resumeData.certifications.length === 0 && (
                    <p className="text-center text-sm text-slate-500">No certifications added yet.</p>
                )}
            </CardContent>
        </Card>
    );
}
