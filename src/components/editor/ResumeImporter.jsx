import React, { useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { Upload, Loader2 } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';

export function ResumeImporter() {
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState('');
    const { setResumeData } = useResumeStore();

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setStatus('Uploading...');

        const formData = new FormData();
        formData.append('resume', file);

        try {
            setStatus('Connecting to server...');

            const response = await fetch('http://localhost:3000/api/parse-resume', {
                method: 'POST',
                body: formData,
            });

            setStatus('Processing response...');

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to parse resume');
            }

            setResumeData(data);
            setStatus('Success!');
            alert('Resume imported successfully!');
        } catch (error) {
            console.error('Error importing resume:', error);
            setStatus(`Error: ${error.message}`);

            if (error.message.includes('Failed to fetch')) {
                alert('Cannot connect to server. Make sure the Node.js server is running on port 3000.');
            } else {
                alert(error.message || 'Failed to import resume. Please try again.');
            }
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="mb-6 rounded-lg border border-dashed border-blue-300 bg-blue-50 p-6 text-center">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx"
                className="hidden"
            />
            <div className="flex flex-col items-center gap-2">
                <div className="rounded-full bg-blue-100 p-3">
                    {isUploading ? (
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    ) : (
                        <Upload className="h-6 w-6 text-blue-600" />
                    )}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Auto-Fill from Resume</h3>
                <p className="text-sm text-slate-600">
                    Upload your existing resume (PDF/DOCX) and our AI will extract the details for you.
                </p>
                {status && (
                    <p className="text-xs text-slate-500">{status}</p>
                )}
                <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    variant="outline"
                    className="mt-2"
                >
                    {isUploading ? 'Analyzing Resume...' : 'Upload Resume'}
                </Button>
            </div>
        </div>
    );
}
