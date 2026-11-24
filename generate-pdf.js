// Script to generate a valid PDF resume for Purushothaman K.
const fs = require('fs');

function buildPDF() {
  const content = [
    "%PDF-1.4",
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj",
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
  ];

  const streamLines = [
    "BT",
    "/F1 20 Tf 40 800 Td (PURUSHOTHAMAN K.) Tj",
    "/F2 10 Tf 0 -18 Td (Chennai, Tamil Nadu, India | purushothk1525@gmail.com | Graduation: 2027) Tj",
    "0 -14 Td (LinkedIn: linkedin.com/in/purushothaman-k-analyst | GitHub: github.com/purushothk-cyber) Tj",
    "0 -14 Td (LeetCode: leetcode.com/u/purushothamank/) Tj",
    
    // Line separator
    "0 -15 Td () Tj",
    "/F1 12 Tf 0 -10 Td (PROFESSIONAL OBJECTIVE & POSITIONING) Tj",
    "/F2 9.5 Tf 0 -14 Td (Computer Science Engineering student specializing in Cyber Security. Interested in cybersecurity,) Tj",
    "0 -12 Td (cloud technologies, software development, infrastructure and solving practical technology problems.) Tj",
    "0 -12 Td (Seeking entry-level opportunities starting in 2027.) Tj",
    
    // Education
    "0 -18 Td () Tj",
    "/F1 12 Tf 0 -10 Td (EDUCATION) Tj",
    "/F1 10 Tf 0 -15 Td (Bachelor of Engineering (B.E.) - Computer Science & Engineering (Cyber Security)) Tj",
    "/F2 9.5 Tf 0 -13 Td (New Prince Shri Bhavani College of Engineering and Technology, Chennai | 2023 - 2027) Tj",
    "0 -12 Td (Cumulative Grade Point Average (CGPA): 7.87 / 10 (till date)) Tj",
    "/F2 9.5 Tf 0 -14 Td (Secondary Education: Kumararani Meena Muthiah Matriculation Higher Secondary School) Tj",
    
    // Technical Projects
    "0 -18 Td () Tj",
    "/F1 12 Tf 0 -10 Td (PROJECT ARCHIVE) Tj",
    "/F1 10 Tf 0 -14 Td (01. FLAMES Web Application - Full-Stack Interactive Utility) Tj",
    "/F2 9.5 Tf 0 -12 Td (- Built a responsive full-stack web application implementing FLAMES game logic algorithm.) Tj",
    "0 -12 Td (- Engineered modular character cancellation and circular traversal calculation engine.) Tj",
    "0 -12 Td (- Rigorously tested, debugged across viewports, and version-controlled with Git.) Tj",
    "0 -12 Td (  Tech Stack: React, Node.js, JavaScript, HTML5, CSS3, Git) Tj",
    
    "/F1 10 Tf 0 -16 Td (02. Bank Management System - Java OOP Console Application) Tj",
    "/F2 9.5 Tf 0 -12 Td (- Developed a robust terminal application handling customer banking transactions.) Tj",
    "0 -12 Td (- Implemented deposit, withdrawal, balance inquiry, and strict state encapsulation with OOP.) Tj",
    "0 -12 Td (  Tech Stack: Java, Object-Oriented Programming (OOP), Data Structures) Tj",
    
    "/F1 10 Tf 0 -16 Td (03. DistillCASB - Cloud Access Security Broker [Pre-Final Year Project]) Tj",
    "/F2 9.5 Tf 0 -12 Td (- Pre-final year research project focusing on cloud access security and data tokenization.) Tj",
    "0 -12 Td (- Designed reverse proxy architecture to inspect, sanitize, and broker cloud SaaS payloads.) Tj",
    "0 -12 Td (  Classification: Pre-Final Year Project (Active Research & Development)) Tj",
    
    // Skills
    "0 -18 Td () Tj",
    "/F1 12 Tf 0 -10 Td (TECHNICAL INVENTORY) Tj",
    "/F2 9.5 Tf 0 -14 Td (Programming Languages: Java, JavaScript) Tj",
    "0 -12 Td (Web Technologies: React, Node.js, HTML5, CSS3) Tj",
    "0 -12 Td (Paradigms & Core: Object-Oriented Programming (OOP), Data Structures & Algorithms) Tj",
    "0 -12 Td (Areas of Focus: Cybersecurity, Cloud Technologies, Infrastructure, Software Engineering) Tj",
    
    // Achievements
    "0 -18 Td () Tj",
    "/F1 12 Tf 0 -10 Td (COMPETITIVE ACHIEVEMENTS & INTERESTS) Tj",
    "/F2 9.5 Tf 0 -14 Td (- Problem Solving: 99+ LeetCode problems solved using Java (leetcode.com/u/purushothamank/)) Tj",
    "0 -12 Td (- Cybersecurity CTF: Participated in Flag Rush CTF at SYMBO 2025 with Team ROOT FORCE) Tj",
    "0 -12 Td (  (Handled challenges across Cryptography, Packet Analysis, and Logic challenges)) Tj",
    "0 -12 Td (- Multidisciplinary interest in practical problem solving, technical curiosity, and communication.) Tj",
    "ET"
  ];

  const streamContent = streamLines.join("\n");
  const streamLength = Buffer.byteLength(streamContent, "utf8");

  content.push(`6 0 obj << /Length ${streamLength} >> stream\n${streamContent}\nendstream\nendobj`);

  // xref table
  let xref = "xref\n0 7\n0000000000 65535 f \n";
  // We can calculate offsets or write standard structure
  let body = "";
  const offsets = [];
  
  // Calculate exact byte offsets
  let offset = 0;
  const chunks = [];
  
  function addChunk(c) {
    offsets.push(offset);
    chunks.push(c);
    offset += Buffer.byteLength(c + "\n", "utf8");
  }

  // PDF header
  const header = "%PDF-1.4\n";
  let curOffset = Buffer.byteLength(header, "utf8");
  
  const objOffsets = [];
  const objs = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj",
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    `6 0 obj << /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj`
  ];

  let fullBody = header;
  objs.forEach((obj, idx) => {
    objOffsets.push(fullBody.length);
    fullBody += obj + "\n";
  });

  const xrefOffset = fullBody.length;
  let xrefTable = `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  objOffsets.forEach(o => {
    xrefTable += String(o).padStart(10, '0') + " 00000 n \n";
  });

  const trailer = `trailer << /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  fullBody += xrefTable + trailer;

  fs.writeFileSync('assets/Purushothaman_K_Resume.pdf', fullBody);
  console.log("Generated assets/Purushothaman_K_Resume.pdf successfully.");
}

buildPDF();
