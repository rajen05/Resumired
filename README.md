# Resumired - ATS-Friendly Resume Builder

![Resumired](https://img.shields.io/badge/Resumired-ATS%20Resume%20Builder-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933)

**Resumired** is a modern, AI-powered resume builder that creates ATS-friendly resumes. Upload your existing resume or build from scratch with our intuitive editor and professional templates.

## ✨ Features

- **🤖 AI-Powered Parsing** - Upload PDF/DOCX resumes and automatically extract all information
- **📝 5 ATS-Friendly Templates** - Classic, Modern, Professional, Minimal, and Compact
- **🔄 Live Preview** - See changes in real-time as you edit
- **📑 Section Reordering** - Drag sections to customize your resume layout
- **📤 Export Options** - Download as PDF or Word document
- **🎯 ATS Optimization** - Built-in tips to improve your resume's ATS score
- **➕ Custom Sections** - Add any section you need (Volunteer Work, Languages, etc.)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/resumired.git
cd resumired

# Install dependencies
npm install

# Start the development server
npm run dev

# In a separate terminal, start the backend server
node server/index.js
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
resumired/
├── src/
│   ├── components/
│   │   ├── editor/          # Resume editing components
│   │   ├── preview/         # Live preview & templates
│   │   └── ui/              # Reusable UI components
│   ├── pages/               # Page components
│   ├── store/               # Zustand state management
│   └── utils/               # Utility functions
├── server/
│   └── index.js             # Express backend for resume parsing
└── public/
```

## 🎨 Templates

| Template | Description |
|----------|-------------|
| **Classic** | Traditional layout with bold headers |
| **Modern** | Contemporary design with blue accents |
| **Professional** | Executive style for senior roles |
| **Minimal** | Clean and spacious design |
| **Compact** | Dense layout for extensive experience |

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **State Management**: Zustand
- **Backend**: Node.js, Express
- **PDF Parsing**: pdf-parse, mammoth
- **Export**: jsPDF, docx, html2canvas
- **Icons**: Lucide React

## 📝 Resume Sections

- Personal Information (Name, Email, Phone, LinkedIn, GitHub, Portfolio)
- Professional Summary
- Work Experience
- Education
- Technical Skills
- Projects
- Certifications
- References
- Custom Sections

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Optional: For Gemini AI features
GEMINI_API_KEY=your_api_key_here
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ by Resumired Team
