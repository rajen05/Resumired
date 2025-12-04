import React from 'react';
import { PersonalSection } from '../components/editor/PersonalSection';
import { SummarySection } from '../components/editor/SummarySection';
import { ExperienceSection } from '../components/editor/ExperienceSection';
import { EducationSection } from '../components/editor/EducationSection';
import { SkillsSection } from '../components/editor/SkillsSection';
import { ProjectsSection } from '../components/editor/ProjectsSection';
import { CertificationsSection } from '../components/editor/CertificationsSection';
import { ReferencesSection } from '../components/editor/ReferencesSection';
import { CustomSectionsEditor } from '../components/editor/CustomSectionsEditor';
import { SectionReorder } from '../components/editor/SectionReorder';
import { TemplateSelector } from '../components/editor/TemplateSelector';
import { ATSOptimizer } from '../components/editor/ATSOptimizer';
import { LivePreview } from '../components/preview/LivePreview';
import { ExportToolbar } from '../components/editor/ExportToolbar';
import { ResumeImporter } from '../components/editor/ResumeImporter';

export function Builder() {
    return (
        <div className="container mx-auto grid gap-8 px-4 py-8 lg:grid-cols-2">
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-slate-900">Resume Editor</h1>
                <ResumeImporter />
                <TemplateSelector />
                <SectionReorder />
                <ATSOptimizer />
                <PersonalSection />
                <SummarySection />
                <ExperienceSection />
                <EducationSection />
                <SkillsSection />
                <ProjectsSection />
                <CertificationsSection />
                <ReferencesSection />
                <CustomSectionsEditor />
            </div>
            <div className="hidden lg:block">
                <div className="sticky top-24 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Live Preview</h2>
                        <ExportToolbar />
                    </div>
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100 p-4 max-h-[80vh] overflow-y-auto">
                        <LivePreview />
                    </div>
                </div>
            </div>
        </div>
    );
}
