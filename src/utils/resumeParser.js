import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Section header patterns
const SECTION_PATTERNS = {
    summary: ['summary', 'objective', 'profile', 'about me', 'qualifications'],
    experience: ['experience', 'work experience', 'employment', 'work history', 'professional experience'],
    education: ['education', 'academic', 'educational background'],
    skills: ['skills', 'technical skills', 'core competencies', 'technologies'],
    projects: ['projects', 'project experience', 'personal projects'],
    certifications: ['certifications', 'certificates', 'credentials'],
    references: ['references', 'professional references'],
};

function classifySection(headerText) {
    const lower = headerText.toLowerCase().trim();
    for (const [type, keywords] of Object.entries(SECTION_PATTERNS)) {
        for (const keyword of keywords) {
            if (lower.includes(keyword)) return type;
        }
    }
    return 'custom';
}

function isSectionHeader(line) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length < 3 || trimmed.length > 60) return false;
    if (trimmed.match(/^[•\-\*\d]/)) return false;
    if (trimmed.includes('@') || trimmed.includes('http')) return false;

    const lower = trimmed.toLowerCase();
    const knownKeywords = ['summary', 'experience', 'education', 'skills', 'projects',
        'certifications', 'references', 'qualifications', 'objective'];

    for (const kw of knownKeywords) {
        if (lower.includes(kw)) return true;
    }

    if (trimmed === trimmed.toUpperCase() && trimmed.length >= 4 && /^[A-Z\s&]+$/.test(trimmed)) {
        return true;
    }

    return false;
}

function parseResumeText(text) {
    const result = {
        personalInfo: { fullName: '', email: '', phone: '', linkedin: '', github: '', portfolio: '', location: '' },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        references: [],
        customSections: []
    };

    const lines = text.split('\n').map(l => l.trim());

    // Extract personal info
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) result.personalInfo.email = emailMatch[0];

    const phoneMatch = text.match(/\+?[\d\s().-]{10,}/);
    if (phoneMatch) result.personalInfo.phone = phoneMatch[0].trim();

    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
    if (linkedinMatch) result.personalInfo.linkedin = linkedinMatch[0];

    const githubMatch = text.match(/github\.com\/[\w-]+/i);
    if (githubMatch) result.personalInfo.github = githubMatch[0];

    // Name
    for (let i = 0; i < Math.min(5, lines.length); i++) {
        const line = lines[i];
        if (line && line.length > 2 && line.length < 50 &&
            !line.includes('@') && !line.includes('.com') && !line.match(/^\+?\d/)) {
            result.personalInfo.fullName = line;
            break;
        }
    }

    // Parse sections
    const sections = [];
    let currentSection = null;
    let currentContent = [];

    for (const line of lines) {
        if (isSectionHeader(line)) {
            if (currentSection && currentContent.length > 0) {
                sections.push({ type: currentSection.type, name: currentSection.name, content: currentContent.join('\n') });
            }
            const cleanHeader = line.replace(/:$/, '').trim();
            currentSection = { type: classifySection(cleanHeader), name: cleanHeader };
            currentContent = [];
        } else if (currentSection && line) {
            currentContent.push(line);
        }
    }

    if (currentSection && currentContent.length > 0) {
        sections.push({ type: currentSection.type, name: currentSection.name, content: currentContent.join('\n') });
    }

    // Process sections
    for (const section of sections) {
        const contentLines = section.content.split('\n').filter(l => l.trim());

        switch (section.type) {
            case 'summary':
                result.summary = section.content.replace(/\s+/g, ' ').trim();
                break;

            case 'skills':
                const skillsText = section.content.replace(/[•\-\*]/g, ',');
                result.skills = [...new Set(skillsText.split(/[,;\n|]/)
                    .map(s => s.trim())
                    .filter(s => s.length > 1 && s.length < 40))];
                break;

            case 'experience':
                let currentExp = null;
                for (const line of contentLines) {
                    if (line.length < 60 && !line.match(/^[•\-\*]/)) {
                        if (currentExp) result.experience.push(currentExp);
                        currentExp = { id: crypto.randomUUID(), title: line, company: '', startDate: '', endDate: '', description: '' };
                    } else if (currentExp) {
                        currentExp.description += (currentExp.description ? '\n' : '') + line;
                    }
                }
                if (currentExp) result.experience.push(currentExp);
                break;

            case 'education':
                let currentEdu = null;
                for (const line of contentLines) {
                    if (line.match(/University|College|School|Institute/i) || (!currentEdu && line.length < 60)) {
                        if (currentEdu) result.education.push(currentEdu);
                        currentEdu = { id: crypto.randomUUID(), school: line, degree: '', startDate: '', endDate: '', gpa: '' };
                    } else if (currentEdu && line.match(/Bachelor|Master|PhD|Diploma|B\.|M\./i)) {
                        currentEdu.degree = line;
                    }
                }
                if (currentEdu) result.education.push(currentEdu);
                break;

            case 'projects':
                let currentProj = null;
                for (const line of contentLines) {
                    if (line.length < 80 && !line.match(/^[•\-\*]/)) {
                        if (currentProj) result.projects.push(currentProj);
                        currentProj = { id: crypto.randomUUID(), name: line.split('|')[0].trim(), technologies: '', date: '', description: '' };
                    } else if (currentProj) {
                        currentProj.description += (currentProj.description ? '\n' : '') + line;
                    }
                }
                if (currentProj) result.projects.push(currentProj);
                break;

            case 'certifications':
                for (const line of contentLines) {
                    const clean = line.replace(/^[•\-\*]\s*/, '').trim();
                    if (clean.length > 3) {
                        result.certifications.push({ id: crypto.randomUUID(), name: clean, issuer: '' });
                    }
                }
                break;

            case 'custom':
                const items = contentLines.map(l => l.replace(/^[•\-\*]\s*/, '').trim()).filter(l => l.length > 2);
                if (items.length > 0) {
                    result.customSections.push({
                        id: crypto.randomUUID(),
                        title: section.name,
                        items: items.map(content => ({ id: crypto.randomUUID(), content }))
                    });
                }
                break;
        }
    }

    return result;
}

export async function parseResumeFile(file) {
    let text = '';

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }
        text = fullText;
    } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.endsWith('.docx')
    ) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
    } else {
        throw new Error('Unsupported file type. Please upload PDF or DOCX.');
    }

    return parseResumeText(text);
}
