import formidable from 'formidable';
import fs from 'fs';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';
import os from 'os';

export const config = {
    api: {
        bodyParser: false,
    },
};

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

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Ensure we use the system temp directory which is writable in Vercel
        const uploadDir = os.tmpdir();

        const form = formidable({
            maxFileSize: 10 * 1024 * 1024,
            allowEmptyFiles: false,
            keepExtensions: true,
            uploadDir: uploadDir // Explicitly set upload directory
        });

        console.log('Parsing form with uploadDir:', uploadDir);

        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve([fields, files]);
            });
        });

        const file = files.resume?.[0];

        if (!file) {
            console.error('No file found in request');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        let text = '';
        const filePath = file.filepath;
        const fileName = file.originalFilename || '';

        console.log('Processing file:', fileName, 'at path:', filePath);

        if (fileName.toLowerCase().endsWith('.pdf')) {
            try {
                const dataBuffer = fs.readFileSync(filePath);
                const data = await pdfParse(dataBuffer);
                text = data.text;
            } catch (e) {
                console.error('PDF Parse Error:', e);
                throw new Error('Failed to parse PDF file');
            }
        } else if (fileName.toLowerCase().endsWith('.docx')) {
            try {
                const result = await mammoth.extractRawText({ path: filePath });
                text = result.value;
            } catch (e) {
                console.error('DOCX Parse Error:', e);
                throw new Error('Failed to parse DOCX file');
            }
        } else {
            return res.status(400).json({ error: 'Please upload PDF or DOCX file' });
        }

        // Clean up
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (e) {
            console.warn('Failed to delete temp file:', e);
        }

        const parsedData = parseResumeText(text);
        return res.status(200).json(parsedData);

    } catch (error) {
        console.error('Critical Parse Error:', error);
        return res.status(500).json({
            error: 'Server Error: ' + (error.message || 'Unknown error'),
            details: error.toString()
        });
    }
}
