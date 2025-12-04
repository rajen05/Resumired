import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { CompactTemplate } from './templates/CompactTemplate';

const TEMPLATES = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    professional: ProfessionalTemplate,
    minimal: MinimalTemplate,
    compact: CompactTemplate,
};

export function LivePreview() {
    const { resumeData, sectionOrder, selectedTemplate } = useResumeStore();

    const TemplateComponent = TEMPLATES[selectedTemplate] || ClassicTemplate;

    return (
        <div className="h-full w-full overflow-y-auto rounded bg-white shadow-lg">
            <div className="min-h-[11in] w-full origin-top scale-[0.6] sm:scale-[0.7] lg:scale-[0.85]">
                <TemplateComponent data={resumeData} sectionOrder={sectionOrder} />
            </div>
        </div>
    );
}
