import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Label } from '../ui/Label';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

export function SummarySection() {
    const { resumeData, updateSummary } = useResumeStore();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Professional Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="summary">Summary</Label>
                    <textarea
                        id="summary"
                        className="flex min-h-[120px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Experienced software engineer with a passion for..."
                        value={resumeData.summary}
                        onChange={(e) => updateSummary(e.target.value)}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
