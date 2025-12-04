import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from './ui/Button';

export function Header() {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/75 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Resumired
                    </span>
                </Link>
                <nav className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/templates')}>
                        Templates
                    </Button>
                    <Button size="sm" onClick={() => navigate('/builder')}>Get Started</Button>
                </nav>
            </div>
        </header>
    );
}
