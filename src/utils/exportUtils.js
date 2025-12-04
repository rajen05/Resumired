import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { useResumeStore } from '../store/useResumeStore';

export const exportToPDF = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) {
        alert('Resume preview not found. Please make sure you have content in your resume.');
        return;
    }

    try {
        // Create a wrapper div with explicit white background
        const wrapper = document.createElement('div');
        wrapper.style.position = 'absolute';
        wrapper.style.left = '-9999px';
        wrapper.style.top = '0';
        wrapper.style.width = '8.5in';
        wrapper.style.backgroundColor = '#ffffff';
        wrapper.style.color = '#000000';

        // Clone and sanitize the element
        const clone = element.cloneNode(true);
        clone.style.transform = 'none';
        clone.style.width = '100%';
        clone.style.backgroundColor = '#ffffff';
        clone.style.color = '#000000';

        // Remove oklch colors by converting all elements to safe colors
        const allElements = clone.querySelectorAll('*');
        allElements.forEach(el => {
            const computed = window.getComputedStyle(el);
            // Override any color that might use oklch
            el.style.backgroundColor = el.style.backgroundColor || 'transparent';
            el.style.color = el.style.color || '#000000';
            el.style.borderColor = el.style.borderColor || '#000000';
        });

        wrapper.appendChild(clone);
        document.body.appendChild(wrapper);

        const canvas = await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            removeContainer: false,
            onclone: (clonedDoc) => {
                // Additional cleanup in cloned document
                const style = clonedDoc.createElement('style');
                style.textContent = `
          * { 
            color: #000 !important; 
            background-color: transparent !important;
            border-color: #000 !important;
          }
          #resume-preview, #resume-preview * {
            background-color: #fff !important;
          }
        `;
                clonedDoc.head.appendChild(style);
            }
        });

        // Cleanup
        document.body.removeChild(wrapper);

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: 'letter',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Scale image to fit page with margins
        const margin = 0.25;
        const maxWidth = pdfWidth - (margin * 2);
        const maxHeight = pdfHeight - (margin * 2);

        const imgRatio = canvas.width / canvas.height;
        let finalWidth = maxWidth;
        let finalHeight = finalWidth / imgRatio;

        if (finalHeight > maxHeight) {
            finalHeight = maxHeight;
            finalWidth = finalHeight * imgRatio;
        }

        const x = (pdfWidth - finalWidth) / 2;
        const y = margin;

        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

        const state = useResumeStore.getState();
        const fileName = state.resumeData.personalInfo.fullName
            ? `${state.resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
            : 'Resume.pdf';

        pdf.save(fileName);
    } catch (error) {
        console.error('Error exporting PDF:', error);
        // Fallback: use print dialog
        alert('PDF export had an issue. Opening print dialog as fallback. Select "Save as PDF" in the print options.');
        window.print();
    }
};

export const exportToDOCX = async () => {
    try {
        const state = useResumeStore.getState();
        const { resumeData, sectionOrder } = state;
        const { personalInfo, summary, experience, education, skills, projects, certifications, references, customSections } = resumeData;

        const children = [];

        // Header - Name
        if (personalInfo.fullName) {
            children.push(
                new Paragraph({
                    children: [new TextRun({ text: personalInfo.fullName.toUpperCase(), bold: true, size: 32 })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 100 },
                })
            );
        }

        // Contact Info
        const contactParts = [
            personalInfo.location,
            personalInfo.email,
            personalInfo.phone,
        ].filter(Boolean);

        if (contactParts.length > 0) {
            children.push(
                new Paragraph({
                    children: [new TextRun({ text: contactParts.join(' | '), size: 20 })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 50 },
                })
            );
        }

        // Links
        const linkParts = [
            personalInfo.linkedin,
            personalInfo.github,
            personalInfo.portfolio,
        ].filter(Boolean);

        if (linkParts.length > 0) {
            children.push(
                new Paragraph({
                    children: [new TextRun({ text: linkParts.join(' | '), size: 18, color: '0066CC' })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                })
            );
        }

        // Add sections in order
        const addSectionHeader = (title) => {
            children.push(
                new Paragraph({
                    children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 22 })],
                    heading: HeadingLevel.HEADING_2,
                    border: { bottom: { color: '000000', size: 1, style: BorderStyle.SINGLE } },
                    spacing: { before: 200, after: 100 },
                })
            );
        };

        for (const sectionId of sectionOrder) {
            switch (sectionId) {
                case 'summary':
                    if (summary) {
                        addSectionHeader('Summary');
                        children.push(new Paragraph({ children: [new TextRun({ text: summary, size: 20 })], spacing: { after: 100 } }));
                    }
                    break;

                case 'experience':
                    if (experience && experience.length > 0) {
                        addSectionHeader('Experience');
                        for (const exp of experience) {
                            children.push(
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: exp.company || exp.title || '', bold: true, size: 22 }),
                                        new TextRun({ text: exp.startDate || exp.endDate ? `  ${exp.startDate || ''} – ${exp.endDate || ''}` : '', size: 20, italics: true }),
                                    ],
                                    spacing: { before: 100 },
                                })
                            );
                            if (exp.title && exp.company) {
                                children.push(new Paragraph({ children: [new TextRun({ text: exp.title, italics: true, size: 20 })] }));
                            }
                            if (exp.description) {
                                const bullets = exp.description.split('\n').filter(l => l.trim());
                                for (const bullet of bullets) {
                                    children.push(new Paragraph({
                                        children: [new TextRun({ text: bullet.replace(/^[•\-\*]\s*/, ''), size: 20 })],
                                        bullet: { level: 0 },
                                    }));
                                }
                            }
                        }
                    }
                    break;

                case 'education':
                    if (education && education.length > 0) {
                        addSectionHeader('Education');
                        for (const edu of education) {
                            children.push(
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: edu.school || '', bold: true, size: 22 }),
                                        new TextRun({ text: edu.startDate || edu.endDate ? `  ${edu.startDate || ''} – ${edu.endDate || ''}` : '', size: 20, italics: true }),
                                    ],
                                    spacing: { before: 100 },
                                })
                            );
                            if (edu.degree) {
                                children.push(new Paragraph({ children: [new TextRun({ text: edu.degree, size: 20 })] }));
                            }
                            if (edu.gpa) {
                                children.push(new Paragraph({ children: [new TextRun({ text: `GPA: ${edu.gpa}`, size: 20 })] }));
                            }
                        }
                    }
                    break;

                case 'skills':
                    if (skills && skills.length > 0) {
                        addSectionHeader('Technical Skills');
                        children.push(new Paragraph({ children: [new TextRun({ text: skills.join(' • '), size: 20 })], spacing: { after: 100 } }));
                    }
                    break;

                case 'projects':
                    if (projects && projects.length > 0) {
                        addSectionHeader('Projects');
                        for (const proj of projects) {
                            children.push(
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: proj.name || '', bold: true, size: 22 }),
                                        new TextRun({ text: proj.technologies ? ` | ${proj.technologies}` : '', size: 20 }),
                                        new TextRun({ text: proj.date ? `  ${proj.date}` : '', size: 20, italics: true }),
                                    ],
                                    spacing: { before: 100 },
                                })
                            );
                            if (proj.description) {
                                const bullets = proj.description.split('\n').filter(l => l.trim());
                                for (const bullet of bullets) {
                                    children.push(new Paragraph({
                                        children: [new TextRun({ text: bullet.replace(/^[•\-\*]\s*/, ''), size: 20 })],
                                        bullet: { level: 0 },
                                    }));
                                }
                            }
                        }
                    }
                    break;

                case 'certifications':
                    if (certifications && certifications.length > 0) {
                        addSectionHeader('Certifications');
                        for (const cert of certifications) {
                            children.push(new Paragraph({
                                children: [
                                    new TextRun({ text: cert.name || '', size: 20 }),
                                    new TextRun({ text: cert.issuer ? ` – ${cert.issuer}` : '', size: 20, italics: true }),
                                ],
                                bullet: { level: 0 },
                            }));
                        }
                    }
                    break;

                case 'references':
                    if (references && references.length > 0) {
                        addSectionHeader('References');
                        for (const ref of references) {
                            children.push(
                                new Paragraph({
                                    children: [new TextRun({ text: ref.name || '', bold: true, size: 20 })],
                                    spacing: { before: 100 },
                                })
                            );
                            if (ref.title) {
                                children.push(new Paragraph({ children: [new TextRun({ text: ref.title, size: 20 })] }));
                            }
                            if (ref.email) {
                                children.push(new Paragraph({ children: [new TextRun({ text: `Email: ${ref.email}`, size: 18 })] }));
                            }
                            if (ref.phone) {
                                children.push(new Paragraph({ children: [new TextRun({ text: `Phone: ${ref.phone}`, size: 18 })] }));
                            }
                        }
                    }
                    break;

                case 'customSections':
                    if (customSections && customSections.length > 0) {
                        for (const section of customSections) {
                            if (section.items?.length > 0) {
                                addSectionHeader(section.title);
                                for (const item of section.items) {
                                    children.push(new Paragraph({
                                        children: [new TextRun({ text: item.content || '', size: 20 })],
                                        bullet: { level: 0 },
                                    }));
                                }
                            }
                        }
                    }
                    break;
            }
        }

        if (children.length === 0) {
            children.push(new Paragraph({ children: [new TextRun({ text: 'No resume content to export.', size: 20 })] }));
        }

        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        margin: { top: 720, right: 720, bottom: 720, left: 720 },
                    },
                },
                children,
            }],
        });

        const blob = await Packer.toBlob(doc);
        const fileName = personalInfo.fullName
            ? `${personalInfo.fullName.replace(/\s+/g, '_')}_Resume.docx`
            : 'Resume.docx';

        saveAs(blob, fileName);
    } catch (error) {
        console.error('Error exporting DOCX:', error);
        alert('Failed to export DOCX: ' + error.message);
    }
};
