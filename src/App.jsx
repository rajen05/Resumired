import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Button } from './components/ui/Button';
import { Builder } from './pages/Builder';
import { Templates } from './pages/Templates';
import { useNavigate } from 'react-router-dom';
import { FileText, Sparkles, Shield, Zap } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Build an <span className="text-blue-600">ATS-Friendly</span> Resume
          <br />in Minutes
        </h1>
        <p className="mb-10 text-xl text-slate-600 max-w-2xl mx-auto">
          Resumired's AI-powered tool ensures your resume gets past the bots and into human hands.
          Upload your existing resume or start fresh.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button size="lg" onClick={() => navigate('/builder')} className="text-lg px-8 py-6">
            <Sparkles className="mr-2 h-5 w-5" />
            Create Resume
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/templates')} className="text-lg px-8 py-6">
            <FileText className="mr-2 h-5 w-5" />
            View Templates
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Why Choose Our Resume Builder?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">ATS-Optimized</h3>
              <p className="text-slate-600">
                All templates pass through Applicant Tracking Systems with flying colors. No fancy graphics or complex layouts.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">AI-Powered Parsing</h3>
              <p className="text-slate-600">
                Upload your existing resume and our AI extracts all information automatically. No manual data entry.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Multiple Formats</h3>
              <p className="text-slate-600">
                Export your resume as PDF or Word document. Choose from 5 professional templates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="builder" element={<Builder />} />
          <Route path="templates" element={<Templates />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
