// Script to generate a valid PDF resume for Purushothaman K.
const fs = require('fs');

function buildPDF() {
  const streamLines = [
    "BT",
    "/F1 18 Tf 40 810 Td (PURUSHOTHAMAN K.) Tj",
    "/F2 9.5 Tf 0 -16 Td (Chennai, Tamil Nadu, India | purushothk1525@gmail.com | Graduation: 2027) Tj",
    "0 -13 Td (LinkedIn: linkedin.com/in/purushothaman-k-analyst | GitHub: github.com/purushothk-cyber) Tj",
    "0 -13 Td (LeetCode: leetcode.com/u/purushothamank/) Tj",
    
    // Objective
    "0 -14 Td () Tj",
    "/F1 11 Tf 0 -10 Td (PROFESSIONAL POSITIONING) Tj",
    "/F2 9 Tf 0 -13 Td (Computer Science Engineering undergraduate specializing in Cyber Security. Experienced in technical training,) Tj",
    "0 -11 Td (event organization, platform development, and software engineering. Seeking entry-level roles starting 2027.) Tj",
    
    // Education
    "0 -14 Td () Tj",
    "/F1 11 Tf 0 -10 Td (EDUCATION) Tj",
    "/F1 9.5 Tf 0 -13 Td (B.E. Computer Science & Engineering (Cyber Security) | CGPA: 7.87 / 10 (till date)) Tj",
    "/F2 9 Tf 0 -12 Td (New Prince Shri Bhavani College of Engineering and Technology, Chennai | 2023 - 2027) Tj",
    "0 -11 Td (Secondary Education: Kumararani Meena Muthiah Matriculation Higher Secondary School, Chennai) Tj",
    
    // Leadership & Event Experience
    "0 -14 Td () Tj",
    "/F1 11 Tf 0 -10 Td (LEADERSHIP, EVENTS & COMMUNITY ENGAGEMENT) Tj",
    "/F1 9.5 Tf 0 -13 Td (01. CYBERFORGE 2026 - Workshop Organizer, Technical Trainer & Platform Developer) Tj",
    "/F2 8.5 Tf 0 -11 Td (- Organized 4-day hands-on workshop covering Linux, digital forensics, web security, cryptography, and OSINT.) Tj",
    "0 -10 Td (- Trained & mentored participants; engineered custom CTF platform with scoring, leaderboards, and interactive labs.) Tj",
    
    "/F1 9.5 Tf 0 -13 Td (02. AI ESCAPE ROOM & AI ESCAPE ROOM 2.0 - Event Organizer, Coordinator & Host) Tj",
    "/F2 8.5 Tf 0 -11 Td (- Conceptualized & hosted AI-themed interactive problem-solving competition under department Spartanz initiative.) Tj",
    "0 -10 Td (- Coordinated challenges, logistics, and student engagement; hosted the expanded 2026 edition (AI Escape Room 2.0).) Tj",

    "/F1 9.5 Tf 0 -13 Td (03. Cybersecurity Awareness Session & CTF - Technical Trainer & Event Coordinator) Tj",
    "/F2 8.5 Tf 0 -11 Td (- Delivered 2-hour cybersecurity awareness training session for approximately 160 students.) Tj",
    "0 -10 Td (- Organized a 10-challenge CTF competition across 5 categories with a core team of three.) Tj",

    "/F1 9.5 Tf 0 -13 Td (04. INNO-HACK 2025 - Hackathon Coordinator) Tj",
    "/F2 8.5 Tf 0 -11 Td (- Coordinated a 36-hour college hackathon with a prize pool exceeding Rs. 30,000; supported 2-stage evaluation.) Tj",

    "/F1 9.5 Tf 0 -13 Td (05. AI-Powered LinkedIn & Career Development Seminar - Session Host) Tj",
    "/F2 8.5 Tf 0 -11 Td (- Hosted seminar; coordinated between speaker, placement department, and participants to keep session on schedule.) Tj",

    // Technical Projects
    "0 -14 Td () Tj",
    "/F1 11 Tf 0 -10 Td (PROJECT ARCHIVE) Tj",
    "/F1 9.5 Tf 0 -13 Td (01. DistillCASB - Cloud Access Security Broker [Pre-Final Year Project]) Tj",
    "/F2 8.5 Tf 0 -11 Td (- Reverse-proxy broker architecture intercepting API traffic, sanitizing PII payloads, and enforcing zero-trust.) Tj",

    "/F1 9.5 Tf 0 -13 Td (02. FLAMES Web Application - Full-Stack Interactive Utility) Tj",
    "/F2 8.5 Tf 0 -11 Td (- Full-stack application with modular character cancellation and circular traversal algorithm in React and Node.js.) Tj",
    
    "/F1 9.5 Tf 0 -13 Td (03. Bank Management System - Java OOP Console Application) Tj",
    "/F2 8.5 Tf 0 -11 Td (- Terminal banking operations handling deposits, withdrawals, and balance verification with strict encapsulation.) Tj",
    
    // Skills
    "0 -14 Td () Tj",
    "/F1 11 Tf 0 -10 Td (SKILLS INVENTORY) Tj",
    "/F2 8.5 Tf 0 -12 Td (Programming: Java, Python, JavaScript, React, Node.js, HTML5, CSS3, OOP) Tj",
    "0 -10 Td (Cybersecurity: Security Fundamentals, Cloud Security, Networking, Cryptography, Packet Analysis, OSINT, Database) Tj",
    "0 -10 Td (Tools & Methods: Git, GitHub, VS Code, Eclipse, MySQL, Linux, Debugging, Algorithmic Problem Solving) Tj",
    "0 -10 Td (Professional: Public Speaking, Client Communication, Query Resolution, Event Coordination, Team Leadership) Tj",
    "ET"
  ];

  const streamContent = streamLines.join("\n");
  const streamLength = Buffer.byteLength(streamContent, "utf8");

  const header = "%PDF-1.4\n";
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
  objs.forEach((obj) => {
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
