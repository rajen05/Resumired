import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({ dest: uploadsDir });

async function extractTextFromPDF(filePath) {
  const pdfParse = require('pdf-parse');
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

async function extractTextFromDOCX(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

async function extractTextFromFile(file) {
  console.log('Processing file:', file.originalname);
  if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
    return await extractTextFromPDF(file.path);
  } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.originalname.toLowerCase().endsWith('.docx')) {
    return await extractTextFromDOCX(file.path);
  }
  throw new Error('Unsupported file type. Please upload PDF or DOCX.');
}

// Section header patterns with keywords
const SECTION_PATTERNS = {
  summary: ['summary', 'objective', 'profile', 'about me', 'qualifications', 'summary of qualifications'],
  experience: ['experience', 'work experience', 'employment', 'work history', 'professional experience', 'relevant experience'],
  education: ['education', 'academic', 'educational background', 'academics'],
  skills: ['skills', 'technical skills', 'core competencies', 'technologies', 'tech stack', 'competencies'],
  projects: ['projects', 'project experience', 'personal projects', 'key projects'],
  certifications: ['certifications', 'certificates', 'credentials', 'professional certifications'],
  references: ['references', 'professional references'],
};

function classifySection(headerText) {
  const lower = headerText.toLowerCase().trim();

  for (const [type, keywords] of Object.entries(SECTION_PATTERNS)) {
    for (const keyword of keywords) {
      if (lower === keyword || lower.startsWith(keyword) || lower.includes(keyword)) {
        return type;
      }
    }
  }
  return 'custom';
}

function isSectionHeader(line, nextLines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length < 3 || trimmed.length > 60) return false;

  // Skip if it looks like content (has too many special chars, is a bullet point, etc.)
  if (trimmed.match(/^[•\-\*\d]/)) return false;
  if (trimmed.includes('@') || trimmed.includes('http')) return false;
  if (trimmed.split(' ').length > 6) return false;

  // Known section keywords - always treat as headers
  const lower = trimmed.toLowerCase();
  const knownKeywords = ['summary', 'experience', 'education', 'skills', 'projects',
    'certifications', 'references', 'qualifications', 'competencies', 'objective'];

  for (const kw of knownKeywords) {
    if (lower.includes(kw)) return true;
  }

  // Check for ALL CAPS with reasonable length (like "EDUCATION", "SKILLS")
  if (trimmed === trimmed.toUpperCase() && trimmed.length >= 4 && trimmed.length <= 40 && /^[A-Z\s&]+$/.test(trimmed)) {
    return true;
  }

  // Check for title case short phrases ending with or without colon
  if (/^[A-Z][a-z]+(\s[A-Z][a-z]+)*:?$/.test(trimmed) && trimmed.length <= 35) {
    // But only if followed by content
    if (nextLines && nextLines.length > 0 && nextLines[0].trim().length > 0) {
      return true;
    }
  }

  return false;
}

function parseResumeLocally(text) {
  console.log('Parsing resume...');

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

  // Extract personal info from the beginning of the resume
  const lines = text.split('\n').map(l => l.trim());

  // Email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) result.personalInfo.email = emailMatch[0];

  // Phone
  const phoneMatch = text.match(/\+?[\d\s().-]{10,}/);
  if (phoneMatch) result.personalInfo.phone = phoneMatch[0].trim();

  // LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  if (linkedinMatch) result.personalInfo.linkedin = linkedinMatch[0];

  // GitHub
  const githubMatch = text.match(/github\.com\/[\w-]+/i);
  if (githubMatch) result.personalInfo.github = githubMatch[0];

  // Portfolio
  const portfolioMatch = text.match(/[\w-]+\.(dev|io|me|com|org|net)(?![\w])/i);
  if (portfolioMatch && !portfolioMatch[0].includes('linkedin') && !portfolioMatch[0].includes('github')) {
    result.personalInfo.portfolio = portfolioMatch[0];
  }

  // Name - first line that looks like a name (not email, phone, etc.)
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (line && line.length > 2 && line.length < 50 &&
      !line.includes('@') && !line.includes('.com') &&
      !line.match(/^\+?\d/) && !line.toLowerCase().includes('resume')) {
      result.personalInfo.fullName = line;
      break;
    }
  }

  // Location
  const locationMatch = text.match(/([A-Z][a-z]+),?\s*([A-Z][a-z]+|[A-Z]{2})/);
  if (locationMatch) result.personalInfo.location = locationMatch[0];

  // Parse sections
  const sections = [];
  let currentSection = null;
  let currentContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLines = lines.slice(i + 1, i + 5);

    if (isSectionHeader(line, nextLines)) {
      // Save previous section
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

  // Save last section
  if (currentSection && currentContent.length > 0) {
    sections.push({ type: currentSection.type, name: currentSection.name, content: currentContent.join('\n') });
  }

  console.log('Detected sections:', sections.map(s => s.type + ': ' + s.name));

  // Process each section
  for (const section of sections) {
    const content = section.content;
    const contentLines = content.split('\n').filter(l => l.trim());

    switch (section.type) {
      case 'summary':
        result.summary = content.replace(/[•\-\*]/g, '').replace(/\s+/g, ' ').trim();
        break;

      case 'experience':
        // Parse experience entries
        let currentExp = null;
        for (const line of contentLines) {
          const dateMatch = line.match(/(\w+\s*\d{4})\s*[-–]\s*(\w+\s*\d{4}|Present|Current)/i);
          const titleMatch = line.match(/^([A-Z][^•\-\n]{3,40})\s*$/);

          if (titleMatch && !dateMatch) {
            if (currentExp) result.experience.push(currentExp);
            currentExp = { id: crypto.randomUUID(), title: '', company: titleMatch[1].trim(), location: '', startDate: '', endDate: '', description: '' };
          } else if (dateMatch) {
            if (currentExp) {
              currentExp.startDate = dateMatch[1];
              currentExp.endDate = dateMatch[2];
            }
          } else if (currentExp && line.match(/^[•\-\*]/)) {
            currentExp.description += (currentExp.description ? '\n' : '') + line;
          } else if (currentExp && !currentExp.title && line.length < 50) {
            currentExp.title = line.replace(/^[•\-\*]\s*/, '');
          }
        }
        if (currentExp) result.experience.push(currentExp);
        break;

      case 'education':
        let currentEdu = null;
        for (const line of contentLines) {
          const dateMatch = line.match(/(\w+\s*\d{4})\s*[-–]\s*(\w+\s*\d{4}|Present|Expected[:\s]*\w+\s*\d{4})/i);
          const gpaMatch = line.match(/(?:C?GPA)[:\s]*([\d.]+)/i);

          if (line.match(/University|College|School|Institute|Academy/i) || (line.length > 5 && line.length < 60 && !currentEdu)) {
            if (currentEdu) result.education.push(currentEdu);
            currentEdu = { id: crypto.randomUUID(), school: line, degree: '', location: '', startDate: '', endDate: '', gpa: '' };
          } else if (dateMatch && currentEdu) {
            currentEdu.startDate = dateMatch[1];
            currentEdu.endDate = dateMatch[2];
          } else if (gpaMatch && currentEdu) {
            currentEdu.gpa = gpaMatch[1];
          } else if (currentEdu && line.match(/Bachelor|Master|PhD|Diploma|B\.|M\.|MBA|Associate/i)) {
            currentEdu.degree = line;
          }
        }
        if (currentEdu) result.education.push(currentEdu);
        break;

      case 'skills':
        // Extract skills with various formats
        const skillsText = content.replace(/[•\-\*]/g, ',');
        const skillItems = skillsText.split(/[,;\n|]/)
          .map(s => s.replace(/^(Languages|Frameworks|Tools|Developer Tools|Core Concepts)[:\s]*/i, '').trim())
          .filter(s => s.length > 1 && s.length < 40);
        result.skills = [...new Set(skillItems)];
        break;

      case 'projects':
        let currentProj = null;
        for (const line of contentLines) {
          const dateMatch = line.match(/(\w+\s*\d{4})\s*[-–]\s*(\w+\s*\d{4}|Present)/i);
          const techMatch = line.match(/^(.+?)\s*[|]\s*(.+)$/);

          if (techMatch) {
            if (currentProj) result.projects.push(currentProj);
            currentProj = { id: crypto.randomUUID(), name: techMatch[1].trim(), technologies: techMatch[2].trim(), date: '', description: '' };
          } else if (dateMatch && currentProj) {
            currentProj.date = `${dateMatch[1]} – ${dateMatch[2]}`;
          } else if (currentProj && line.match(/^[•\-\*]/)) {
            currentProj.description += (currentProj.description ? '\n' : '') + line;
          } else if (!currentProj && line.length > 5 && line.length < 80) {
            currentProj = { id: crypto.randomUUID(), name: line, technologies: '', date: '', description: '' };
          }
        }
        if (currentProj) result.projects.push(currentProj);
        break;

      case 'certifications':
        for (const line of contentLines) {
          const clean = line.replace(/^[•\-\*]\s*/, '').trim();
          if (clean.length > 3) {
            const issuerMatch = clean.match(/^(.+?)\s*[-–]\s*(.+)$/);
            result.certifications.push({
              id: crypto.randomUUID(),
              name: issuerMatch ? issuerMatch[1].trim() : clean,
              issuer: issuerMatch ? issuerMatch[2].trim() : ''
            });
          }
        }
        break;

      case 'references':
        let currentRef = null;
        for (const line of contentLines) {
          const emailMatch = line.match(/[\w.-]+@[\w.-]+\.\w+/);
          const phoneMatch = line.match(/\+?[\d\s().-]{10,}/);

          if (!emailMatch && !phoneMatch && line.length > 3 && line.length < 50 && /[A-Z]/.test(line[0])) {
            if (currentRef) result.references.push(currentRef);
            currentRef = { id: crypto.randomUUID(), name: line.replace(/^[•\-\*]\s*/, ''), title: '', organization: '', email: '', phone: '' };
          } else if (currentRef) {
            if (emailMatch) currentRef.email = emailMatch[0];
            if (phoneMatch) currentRef.phone = phoneMatch[0].trim();
            if (!currentRef.title && !emailMatch && !phoneMatch) currentRef.title = line;
          }
        }
        if (currentRef) result.references.push(currentRef);
        break;

      case 'custom':
        // Add as custom section
        const items = contentLines
          .map(l => l.replace(/^[•\-\*]\s*/, '').trim())
          .filter(l => l.length > 2);

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

  console.log('Parsed:', {
    name: result.personalInfo.fullName,
    email: result.personalInfo.email,
    exp: result.experience.length,
    edu: result.education.length,
    skills: result.skills.length,
    proj: result.projects.length,
    certs: result.certifications.length,
    refs: result.references.length,
    custom: result.customSections.length
  });

  return result;
}

app.post('/api/parse-resume', upload.single('resume'), async (req, res) => {
  console.log('\n=== Resume Upload ===');
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  console.log('File:', req.file.originalname);

  try {
    const text = await extractTextFromFile(req.file);
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    const parsedData = parseResumeLocally(text);
    console.log('Success!\n');
    return res.json(parsedData);
  } catch (error) {
    console.error('Error:', error.message);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(port, () => {
  console.log(`\n✅ Server running on http://localhost:${port}`);
  console.log('📄 Smart resume parsing enabled\n');
});
