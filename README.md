# Resumired 🚀
### **Build an ATS-Friendly Resume in Minutes. Get Hired Faster.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge&logo=vercel)](https://resumired.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

---

## 💡 The Problem
75% of resumes are rejected by Applicant Tracking Systems (ATS) before they are ever seen by a human recruiter. Complex formatting, graphics, and unreadable layouts are the silent career killers.

## ✨ The Solution: Resumired
**Resumired** is a modern, privacy-first resume builder designed to solve this problem. It helps job seekers create professional, parseable resumes that pass the bots and impress the recruiters.

Unlike other resume builders that trap your data behind paywalls or servers, **Resumired runs 100% in your browser**.

### 🔥 Key Features

- **🧠 Smart AI Import**: Drag & drop your existing PDF or DOCX resume. Our intelligent parser extracts your details instantly.
- **🎨 5+ ATS-Optimized Templates**: Choose from Classic, Modern, Professional, Minimal, and Compact layouts—all designed to be machine-readable.
- **🔒 Privacy First**: **Zero data collection.** All parsing and PDF generation happens locally in your browser. Your personal data never touches a server.
- **⚡ Real-Time Live Preview**: See your changes instantly as you type. No loading spinners, no waiting.
- **📄 Dual Export**: Download as high-quality **PDF** or editable **Word (DOCX)** format.
- **✨ Custom Sections**: Add whatever you need—Volunteer Work, Awards, Languages, or Portfolio links.

---

## 🛠️ Technical Showcase

This project demonstrates a **Serverless, Client-Side First** architecture, showcasing advanced frontend engineering skills:

### **1. Client-Side File Parsing (No Backend Required)**
Instead of relying on a heavy backend server to process files, I implemented a complex parsing engine directly in the browser:
- **PDF Parsing**: Utilizes `pdfjs-dist` to read binary PDF data and extract text layers.
- **DOCX Parsing**: Uses `mammoth.js` to convert Word documents into raw text.
- **Regex Pattern Matching**: Custom algorithms identify sections (Experience, Education, Skills) based on common keywords and document structure.

### **2. Modern React Architecture**
- **Framework**: Built with **React 18** and **Vite** for sub-second load times.
- **State Management**: Leverages **Zustand** for a centralized, high-performance store that handles complex nested objects (resume data) without unnecessary re-renders.
- **Routing**: Implemented **React Router v6** with SPA (Single Page Application) routing, fully optimized for Vercel deployment.

### **3. PDF & DOCX Generation**
- **PDF**: Uses `html2canvas` and `jspdf` to render the DOM into a pixel-perfect PDF document.
- **DOCX**: Implemented `docx` library to programmatically construct Word documents with proper styling, headings, and bullet points.

### **4. UI/UX Design**
- **Styling**: **Tailwind CSS** for a responsive, mobile-first design system.
- **Components**: Modular, reusable component architecture for maintainability.
- **Interactivity**: Drag-and-drop file uploads, dynamic section reordering, and instant template switching.

---

## 🚀 Getting Started

Want to run this locally?

```bash
# 1. Clone the repository
git clone https://github.com/rajen05/Resumired.git

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open `http://localhost:5173` to see the app in action.

## 🔮 Future Roadmap

- [ ] **AI Content Suggestions**: Integrate Gemini/OpenAI to rewrite bullet points.
- [ ] **Cover Letter Generator**: Auto-generate cover letters based on resume content.
- [ ] **LinkedIn Import**: One-click import from LinkedIn profile PDF.
- [ ] **Analytics**: Track resume views (optional opt-in).

---

## 🤝 Contributing

Contributions are welcome! If you have ideas for new templates or parsing improvements, feel free to open an issue or submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ by [Rajendran](https://github.com/rajen05)**
