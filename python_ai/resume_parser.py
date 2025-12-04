import re
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
from docx import Document
import os
import tempfile

app = Flask(__name__)
CORS(app)

# Regex patterns for extracting information
EMAIL_PATTERN = r'[\w\.-]+@[\w\.-]+\.\w+'
PHONE_PATTERN = r'[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{7,}'
LINKEDIN_PATTERN = r'(?:linkedin\.com/in/|linkedin:?\s*)[\w-]+'
URL_PATTERN = r'https?://[^\s<>"{}|\\^`\[\]]+'

# Common section headers
SECTION_HEADERS = {
    'experience': ['experience', 'work experience', 'employment', 'work history', 'professional experience'],
    'education': ['education', 'academic', 'qualifications', 'academic background'],
    'skills': ['skills', 'technical skills', 'core competencies', 'expertise', 'proficiencies'],
    'summary': ['summary', 'objective', 'profile', 'about', 'professional summary', 'career objective']
}

def extract_text_from_pdf(file_path):
    """Extract text from PDF file."""
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

def extract_text_from_docx(file_path):
    """Extract text from DOCX file."""
    doc = Document(file_path)
    text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
    return text

def extract_email(text):
    """Extract email from text."""
    match = re.search(EMAIL_PATTERN, text)
    return match.group(0) if match else ""

def extract_phone(text):
    """Extract phone number from text."""
    match = re.search(PHONE_PATTERN, text)
    return match.group(0).strip() if match else ""

def extract_linkedin(text):
    """Extract LinkedIn URL from text."""
    match = re.search(LINKEDIN_PATTERN, text, re.IGNORECASE)
    if match:
        result = match.group(0)
        if not result.startswith('linkedin.com'):
            result = 'linkedin.com/in/' + result.split('/')[-1]
        return result
    return ""

def extract_urls(text):
    """Extract URLs (for portfolio)."""
    urls = re.findall(URL_PATTERN, text)
    # Filter out LinkedIn
    portfolio_urls = [url for url in urls if 'linkedin' not in url.lower()]
    return portfolio_urls[0] if portfolio_urls else ""

def extract_name(text):
    """Extract name - usually the first line or largest text."""
    lines = text.strip().split('\n')
    for line in lines[:5]:  # Check first 5 lines
        line = line.strip()
        # Skip lines that look like contact info
        if '@' in line or re.search(PHONE_PATTERN, line):
            continue
        # Skip very short or very long lines
        if 3 < len(line) < 50:
            # Remove common prefixes
            if not any(kw in line.lower() for kw in ['resume', 'cv', 'curriculum']):
                return line
    return ""

def extract_location(text):
    """Extract location - look for city, state patterns."""
    # Common patterns: City, State or City, ST
    location_pattern = r'([A-Z][a-z]+(?:\s[A-Z][a-z]+)?),?\s*([A-Z]{2}|[A-Z][a-z]+)'
    lines = text.split('\n')[:10]  # Check first 10 lines
    for line in lines:
        match = re.search(location_pattern, line)
        if match:
            return match.group(0)
    return ""

def find_section(text, section_type):
    """Find and extract a section from the resume."""
    text_lower = text.lower()
    headers = SECTION_HEADERS.get(section_type, [])
    
    start_idx = -1
    for header in headers:
        pattern = r'\n\s*' + re.escape(header) + r'\s*\n'
        match = re.search(pattern, text_lower)
        if match:
            start_idx = match.end()
            break
    
    if start_idx == -1:
        return ""
    
    # Find the next section header
    end_idx = len(text)
    for section_headers in SECTION_HEADERS.values():
        for header in section_headers:
            pattern = r'\n\s*' + re.escape(header) + r'\s*\n'
            match = re.search(pattern, text_lower[start_idx:])
            if match:
                potential_end = start_idx + match.start()
                if potential_end < end_idx and potential_end > start_idx:
                    end_idx = potential_end
    
    return text[start_idx:end_idx].strip()

def parse_experience(experience_text):
    """Parse experience section into structured data."""
    experiences = []
    if not experience_text:
        return experiences
    
    # Split by common patterns (dates, bullet points, etc.)
    lines = experience_text.split('\n')
    current_exp = None
    
    date_pattern = r'(\d{1,2}/\d{2,4}|\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{2,4})'
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Check if this looks like a new job entry (has a date)
        dates = re.findall(date_pattern, line, re.IGNORECASE)
        if len(dates) >= 1 or (current_exp is None and len(line) > 10):
            if current_exp:
                experiences.append(current_exp)
            current_exp = {
                'id': str(uuid.uuid4()),
                'title': '',
                'company': '',
                'startDate': dates[0] if dates else '',
                'endDate': dates[1] if len(dates) > 1 else 'Present',
                'description': ''
            }
            # Try to extract title/company from the line
            clean_line = re.sub(date_pattern, '', line).strip(' -–|')
            if ' at ' in clean_line.lower():
                parts = re.split(r'\s+at\s+', clean_line, flags=re.IGNORECASE)
                current_exp['title'] = parts[0].strip()
                current_exp['company'] = parts[1].strip() if len(parts) > 1 else ''
            elif ',' in clean_line:
                parts = clean_line.split(',')
                current_exp['title'] = parts[0].strip()
                current_exp['company'] = parts[1].strip() if len(parts) > 1 else ''
            else:
                current_exp['title'] = clean_line
        elif current_exp:
            # This is description/bullet point
            if current_exp['description']:
                current_exp['description'] += '\n'
            current_exp['description'] += line.lstrip('•-*')
    
    if current_exp:
        experiences.append(current_exp)
    
    return experiences

def parse_education(education_text):
    """Parse education section into structured data."""
    educations = []
    if not education_text:
        return educations
    
    lines = education_text.split('\n')
    current_edu = None
    
    date_pattern = r'(\d{1,2}/\d{2,4}|\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{2,4})'
    degree_keywords = ['bachelor', 'master', 'phd', 'b.s', 'b.a', 'm.s', 'm.a', 'mba', 'associate', 'diploma']
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Check for degree keywords or dates
        has_degree = any(kw in line.lower() for kw in degree_keywords)
        dates = re.findall(date_pattern, line, re.IGNORECASE)
        
        if has_degree or dates or (current_edu is None and len(line) > 5):
            if current_edu:
                educations.append(current_edu)
            current_edu = {
                'id': str(uuid.uuid4()),
                'school': '',
                'degree': '',
                'startDate': dates[0] if dates else '',
                'endDate': dates[1] if len(dates) > 1 else (dates[0] if dates else '')
            }
            clean_line = re.sub(date_pattern, '', line).strip(' -–|,')
            if has_degree:
                current_edu['degree'] = clean_line
            else:
                current_edu['school'] = clean_line
        elif current_edu:
            if not current_edu['school']:
                current_edu['school'] = line
            elif not current_edu['degree']:
                current_edu['degree'] = line
    
    if current_edu:
        educations.append(current_edu)
    
    return educations

def parse_skills(skills_text):
    """Parse skills section into a list."""
    if not skills_text:
        return []
    
    # Common delimiters
    skills = re.split(r'[,;•|\n]', skills_text)
    skills = [s.strip().strip('-•*').strip() for s in skills if s.strip()]
    # Filter out empty or very long entries
    skills = [s for s in skills if 2 < len(s) < 50]
    return skills[:20]  # Limit to 20 skills

def parse_resume(text):
    """Main function to parse resume text into structured data."""
    result = {
        'personalInfo': {
            'fullName': extract_name(text),
            'email': extract_email(text),
            'phone': extract_phone(text),
            'linkedin': extract_linkedin(text),
            'portfolio': extract_urls(text),
            'location': extract_location(text)
        },
        'summary': find_section(text, 'summary'),
        'experience': parse_experience(find_section(text, 'experience')),
        'education': parse_education(find_section(text, 'education')),
        'skills': parse_skills(find_section(text, 'skills')),
        'projects': []
    }
    return result

@app.route('/api/parse-resume', methods=['POST'])
def parse_resume_endpoint():
    if 'resume' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['resume']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Save to temp file
    _, ext = os.path.splitext(file.filename)
    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        file.save(tmp.name)
        tmp_path = tmp.name
    
    try:
        # Extract text based on file type
        if ext.lower() == '.pdf':
            text = extract_text_from_pdf(tmp_path)
        elif ext.lower() in ['.docx', '.doc']:
            text = extract_text_from_docx(tmp_path)
        else:
            return jsonify({'error': 'Unsupported file type. Use PDF or DOCX.'}), 400
        
        # Parse the resume
        result = parse_resume(text)
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Error parsing resume: {e}")
        return jsonify({'error': str(e)}), 500
    
    finally:
        # Clean up temp file
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    print("Starting local AI resume parser on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
