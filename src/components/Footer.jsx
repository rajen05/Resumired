import React from 'react';
import { Sparkles } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Resumired
                        </span>
                    </div>
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} Resumired. Build ATS-friendly resumes that get you hired.
                    </p>
                </div>
            </div>
        </footer>
    );
}
