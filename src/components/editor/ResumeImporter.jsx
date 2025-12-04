import React, { useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { Upload, Loader2, FileText } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { parseResumeFile } from '../../utils/resumeParser';

export function ResumeImporter() {
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState('');
    const { setResumeData } = useResumeStore();

    const processFile = async (file) => {
        if (!file) return;

        // Validate file type
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|docx)$/i)) {
            alert('Please upload a PDF or DOCX file.');
            return;
        }

        setIsUploading(true);
        setStatus('Analyzing Resume...');

        try {
            // Client-side parsing - no server needed!
            const data = await parseResumeFile(file);

            setResumeData(data);
            setStatus('Success!');
            alert('Resume imported successfully!');
        } catch (error) {
            console.error('Error importing resume:', error);
            setStatus(`Error: ${error.message}`);
            alert(error.message || 'Failed to import resume. Please try again.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        processFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        processFile(file);
    };

    return (
        <div
            className={`mb-6 rounded-lg border-2 border-dashed p-8 text-center transition-colors
                ${isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50'
                }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx"
                className="hidden"
            />
            <div className="flex flex-col items-center gap-3">
                <div className={`rounded-full p-4 transition-colors ${isDragging ? 'bg-blue-200' : 'bg-white shadow-sm'}`}>
                    {isUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    ) : isDragging ? (
                        <FileText className="h-8 w-8 text-blue-600" />
                    ) : (
                        <Upload className="h-8 w-8 text-slate-400" />
                    )}
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                        {isDragging ? 'Drop your resume here' : 'Auto-Fill from Resume'}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                        Drag & drop your PDF or DOCX resume here, or click to browse. Our AI will extract the details for you.
                    </p>
                </div>

                {status && (
                    <div className={`text-sm font-medium ${status.includes('Error') ? 'text-red-500' : 'text-blue-600'}`}>
                        {status}
                    </div>
                )}

                <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    variant={isDragging ? "secondary" : "outline"}
                    className="mt-2"
                >
                    {isUploading ? 'Analyzing Resume...' : 'Browse Files'}
                </Button>
            </div>
        </div>
    );
}
