import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckCircle, AlertCircle } from 'lucide-react';

export function ATSOptimizer() {
    const [jobDescription, setJobDescription] = useState('');
    const [keywords, setKeywords] = useState([]);

    const analyzeJobDescription = () => {
        // Mock AI analysis - in a real app, this would call an API
        if (!jobDescription) return;

        const mockKeywords = ['React', 'JavaScript', 'Tailwind CSS', 'Node.js', 'Agile', 'Team Leadership'];
        setKeywords(mockKeywords);
    };

    return (
        <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                    <CheckCircle className="h-5 w-5" /> ATS Optimizer
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-medium text-blue-900">Paste Job Description</label>
                    <textarea
                        className="w-full rounded-md border border-blue-200 p-2 text-sm focus:border-blue-500 focus:outline-none"
                        rows={4}
                        placeholder="Paste the job description here to get keyword suggestions..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                    <Button onClick={analyzeJobDescription} size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                        Analyze Keywords
                    </Button>
                </div>

                {keywords.length > 0 && (
                    <div>
                        <h4 className="mb-2 text-sm font-semibold text-blue-900">Suggested Keywords:</h4>
                        <div className="flex flex-wrap gap-2">
                            {keywords.map((keyword, index) => (
                                <span key={index} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-700 shadow-sm">
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-start gap-2 text-xs text-blue-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>Tip: Include these keywords in your summary or skills section to improve ATS ranking.</p>
                </div>
            </CardContent>
        </Card>
    );
}
