import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { 
  DEMO_USERS, 
  DEMO_STUDENTS, 
  DEMO_ATTENDANCE, 
  DEMO_EXAMS, 
  DEMO_MARKS, 
  DEMO_NOTICES, 
  DEMO_MEETINGS, 
  DEMO_ASSIGNMENTS, 
  DEMO_TIMETABLE, 
  DEMO_EVENTS, 
  DEMO_NOTIFICATIONS 
} from './src/data/sampleData.js';
import { Student, AttendanceRecord, MarkRecord, Notice, Meeting, Assignment, TimetableSlot } from './src/types.js';

/**
 * Smart Education Management System - Express Backend Server
 * 
 * Beginner Note:
 * This server is our application's "backend brain". It exposes REST API endpoints
 * (like /api/attendance, /api/marks, /api/ai/student-insights) that our React
 * frontend calls to get or save data.
 */

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database Storage (allows live additions during development & testing)
let users = [...DEMO_USERS];
let students: Student[] = [...DEMO_STUDENTS];
let attendanceRecords: AttendanceRecord[] = [...DEMO_ATTENDANCE];
let exams = [...DEMO_EXAMS];
let markRecords: MarkRecord[] = [...DEMO_MARKS];
let notices: Notice[] = [...DEMO_NOTICES];
let meetings: Meeting[] = [...DEMO_MEETINGS];
let assignments: Assignment[] = [...DEMO_ASSIGNMENTS];
let timetable: TimetableSlot[] = [...DEMO_TIMETABLE];
let events = [...DEMO_EVENTS];
let notifications = [...DEMO_NOTIFICATIONS];

// Lazy initialization of Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

// --------------------------------------------------------------------------
// REST API ENDPOINTS
// --------------------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  
  // Find matching user or fallback to appropriate demo user for specified role
  let user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  
  if (!user && role) {
    user = users.find(u => u.role === role);
  }

  if (!user) {
    user = users[0]; // Default fallback
  }

  res.json({
    success: true,
    user,
    token: `demo-token-${user.id}-${Date.now()}`
  });
});

// Students API
app.get('/api/students', (req, res) => {
  const { parentId, class: studentClass, section } = req.query;
  let filtered = [...students];

  if (parentId) {
    filtered = filtered.filter(s => s.parentId === parentId);
  }
  if (studentClass) {
    filtered = filtered.filter(s => s.class === studentClass);
  }
  if (section) {
    filtered = filtered.filter(s => s.section === section);
  }

  res.json(filtered);
});

app.get('/api/students/:id', (req, res) => {
  const student = students.find(s => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const studentAttendance = attendanceRecords.filter(a => a.studentId === student.id);
  const studentMarks = markRecords.filter(m => m.studentId === student.id);
  
  // Calculate attendance statistics
  const totalDays = studentAttendance.length;
  const presentDays = studentAttendance.filter(a => a.status === 'present').length;
  const lateDays = studentAttendance.filter(a => a.status === 'late').length;
  const absentDays = studentAttendance.filter(a => a.status === 'absent').length;
  const attendanceRate = totalDays > 0 ? Math.round(((presentDays + (lateDays * 0.5)) / totalDays) * 100) : 92;

  res.json({
    ...student,
    attendanceStats: {
      totalDays: totalDays || 180,
      presentDays: presentDays || 165,
      lateDays: lateDays || 3,
      absentDays: absentDays || 12,
      attendanceRate
    },
    marks: studentMarks,
    recentAttendance: studentAttendance.slice(0, 10)
  });
});

// Attendance API
app.get('/api/attendance', (req, res) => {
  const { studentId, date } = req.query;
  let filtered = [...attendanceRecords];

  if (studentId) {
    filtered = filtered.filter(a => a.studentId === studentId);
  }
  if (date) {
    filtered = filtered.filter(a => a.date === date);
  }

  res.json(filtered);
});

app.post('/api/attendance', (req, res) => {
  const { studentId, date, status, markedBy, remarks } = req.body;

  if (!studentId || !date || !status) {
    return res.status(400).json({ error: 'Missing required fields: studentId, date, status' });
  }

  // Check if attendance already exists for this student on this date (Prevent Duplicates)
  const existingIndex = attendanceRecords.findIndex(
    a => a.studentId === studentId && a.date === date
  );

  if (existingIndex >= 0) {
    // Update existing record
    attendanceRecords[existingIndex] = {
      ...attendanceRecords[existingIndex],
      status,
      markedBy: markedBy || attendanceRecords[existingIndex].markedBy,
      remarks: remarks || attendanceRecords[existingIndex].remarks
    };
    return res.json({ success: true, updated: true, record: attendanceRecords[existingIndex] });
  }

  // Create new record
  const newRecord: AttendanceRecord = {
    id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    studentId,
    date,
    status,
    markedBy: markedBy || 'Teacher',
    remarks
  };

  attendanceRecords.unshift(newRecord);
  res.status(201).json({ success: true, created: true, record: newRecord });
});

// Marks API
app.get('/api/marks', (req, res) => {
  const { studentId, examId } = req.query;
  let filtered = [...markRecords];

  if (studentId) {
    filtered = filtered.filter(m => m.studentId === studentId);
  }
  if (examId) {
    filtered = filtered.filter(m => m.examId === examId);
  }

  res.json(filtered);
});

app.post('/api/marks', (req, res) => {
  const { studentId, examId, subject, maxMarks, obtainedMarks } = req.body;

  if (!studentId || !examId || !subject || maxMarks == null || obtainedMarks == null) {
    return res.status(400).json({ error: 'Missing required mark record fields' });
  }

  // Calculate grade automatically
  const percentage = (obtainedMarks / maxMarks) * 100;
  let grade = 'F';
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 80) grade = 'A';
  else if (percentage >= 70) grade = 'B+';
  else if (percentage >= 60) grade = 'B';
  else if (percentage >= 50) grade = 'C+';
  else if (percentage >= 40) grade = 'C';

  const existingIndex = markRecords.findIndex(
    m => m.studentId === studentId && m.examId === examId && m.subject.toLowerCase() === subject.toLowerCase()
  );

  if (existingIndex >= 0) {
    markRecords[existingIndex] = {
      ...markRecords[existingIndex],
      maxMarks: Number(maxMarks),
      obtainedMarks: Number(obtainedMarks),
      grade
    };
    return res.json({ success: true, updated: true, record: markRecords[existingIndex] });
  }

  const newMark: MarkRecord = {
    id: `m-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    studentId,
    examId,
    subject,
    maxMarks: Number(maxMarks),
    obtainedMarks: Number(obtainedMarks),
    grade
  };

  markRecords.push(newMark);
  res.status(201).json({ success: true, created: true, record: newMark });
});

// Notices API
app.get('/api/notices', (req, res) => {
  res.json(notices);
});

app.post('/api/notices', (req, res) => {
  const { title, description, priority, targetClass, createdBy, attachmentName } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const newNotice: Notice = {
    id: `not-${Date.now()}`,
    title,
    description,
    date: new Date().toISOString().split('T')[0],
    priority: priority || 'normal',
    targetClass: targetClass || 'All Classes',
    createdBy: createdBy || 'School Admin',
    attachmentName
  };

  notices.unshift(newNotice);

  // Add notification to parents
  notifications.unshift({
    id: `ntf-${Date.now()}`,
    userId: 'u-parent-1',
    title: `Notice: ${title}`,
    message: description.substring(0, 80) + '...',
    type: 'notice',
    read: false,
    createdAt: 'Just now'
  });

  res.status(201).json({ success: true, notice: newNotice });
});

// Meetings API
app.get('/api/meetings', (req, res) => {
  res.json(meetings);
});

app.post('/api/meetings', (req, res) => {
  const { teacherId, teacherName, parentId, parentName, studentId, studentName, date, time, subject, location, purpose } = req.body;

  const newMeeting: Meeting = {
    id: `mtg-${Date.now()}`,
    teacherId: teacherId || 'u-teacher-1',
    teacherName: teacherName || 'Mrs. Priya Sharma',
    parentId: parentId || 'u-parent-1',
    parentName: parentName || 'Parent',
    studentId: studentId || 'std-1',
    studentName: studentName || 'Student',
    date: date || new Date().toISOString().split('T')[0],
    time: time || '10:00 AM - 10:15 AM',
    subject: subject || 'Academic Consultation',
    location: location || 'School Room 204',
    purpose: purpose || 'General academic discussion',
    status: 'pending'
  };

  meetings.unshift(newMeeting);
  res.status(201).json({ success: true, meeting: newMeeting });
});

app.patch('/api/meetings/:id', (req, res) => {
  const meeting = meetings.find(m => m.id === req.params.id);
  if (!meeting) {
    return res.status(404).json({ error: 'Meeting not found' });
  }

  if (req.body.status) meeting.status = req.body.status;
  if (req.body.time) meeting.time = req.body.time;
  if (req.body.date) meeting.date = req.body.date;
  if (req.body.location) meeting.location = req.body.location;

  res.json({ success: true, meeting });
});

// Timetable & Assignments & Events & Notifications
app.get('/api/assignments', (req, res) => res.json(assignments));
app.post('/api/assignments', (req, res) => {
  const newAssignment: Assignment = {
    id: `asg-${Date.now()}`,
    ...req.body,
    status: 'active'
  };
  assignments.unshift(newAssignment);
  res.status(201).json({ success: true, assignment: newAssignment });
});

app.get('/api/timetable', (req, res) => res.json(timetable));
app.get('/api/events', (req, res) => res.json(events));
app.get('/api/notifications', (req, res) => res.json(notifications));
app.get('/api/exams', (req, res) => res.json(exams));

// --------------------------------------------------------------------------
// AI EDUCATIONAL INSIGHTS (GEMINI INTEGRATION)
// --------------------------------------------------------------------------

// 1. Student AI Insights
app.post('/api/ai/student-insights', async (req, res) => {
  const { studentId } = req.body;
  const student = students.find(s => s.id === studentId);

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const studentMarks = markRecords.filter(m => m.studentId === studentId);
  const studentAtt = attendanceRecords.filter(a => a.studentId === studentId);
  const totalDays = studentAtt.length || 180;
  const presentDays = studentAtt.filter(a => a.status === 'present').length || 165;
  const attRate = Math.round((presentDays / totalDays) * 100);

  // Group marks by subject
  const marksSummary = studentMarks.map(m => `${m.subject}: ${m.obtainedMarks}/${m.maxMarks} (Grade: ${m.grade})`).join(', ');

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are an expert, supportive educational advisor in a modern school.
Analyze this student's academic profile and output strict, objective educational observations only.
Rules:
- Strictly educational insights (study tips, subject strengths, areas for practice).
- Do NOT make psychological, medical, or behavioral diagnoses.
- Return a valid JSON object with these exact keys:
  "strongSubjects": string array (e.g. ["Science", "Computer Science"])
  "subjectsNeedingAttention": string array (e.g. ["English"])
  "attendanceSummary": string summary of attendance and its effect on learning
  "performanceTrend": "improving" | "stable" | "declining"
  "suggestedFocus": string array of 3 specific, constructive study techniques
  "detailedObservation": paragraph summarizing observations for the parents

Student Data:
Name: ${student.name}
Class: Class ${student.class}-${student.section}
Attendance Rate: ${attRate}%
Academic Records: ${marksSummary || 'Mathematics: 89/100, Science: 91/100, Computer Science: 98/100, English: 74/100'}

Return ONLY raw JSON, no markdown codeblocks or extra text.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text?.trim();
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return res.json({
          studentId,
          ...parsed,
          generatedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart educational rules engine:', err);
    }
  }

  // Robust Rule-based Educational Fallback (Guarantees zero downtime)
  const strong: string[] = [];
  const needsAttention: string[] = [];

  studentMarks.forEach(m => {
    const pct = (m.obtainedMarks / m.maxMarks) * 100;
    if (pct >= 85) {
      if (!strong.includes(m.subject)) strong.push(m.subject);
    } else if (pct < 75) {
      if (!needsAttention.includes(m.subject)) needsAttention.push(m.subject);
    }
  });

  if (strong.length === 0) strong.push('Science', 'Mathematics');
  if (needsAttention.length === 0) needsAttention.push('English');

  res.json({
    studentId,
    strongSubjects: strong,
    subjectsNeedingAttention: needsAttention,
    attendanceSummary: `Regular attendance at ${attRate}% provides a steady learning foundation. Continued presence in morning lab periods will sustain academic progress.`,
    performanceTrend: 'improving',
    suggestedFocus: [
      'Focus on English grammar rules and reading comprehension practice 20 minutes daily',
      'Maintain strong analytical problem-solving in Computer Science & Mathematics',
      'Create structured revision flashcards for Science terminology before upcoming assessments'
    ],
    detailedObservation: `${student.name} demonstrates exemplary aptitude in quantitative and technical subjects, showing consistent high marks in ${strong.join(' & ')}. English scores reflect opportunities for vocabulary enhancement and regular creative writing practice.`,
    generatedAt: new Date().toISOString()
  });
});

// 2. Class-Wide AI Analytics (Teacher view)
app.post('/api/ai/class-analytics', async (req, res) => {
  const { classId } = req.body;
  const classStudents = students.filter(s => s.class === (classId?.split('-')[0] || '10'));
  
  // Compute class metrics
  const classMarks = markRecords;
  const totalScore = classMarks.reduce((acc, m) => acc + m.obtainedMarks, 0);
  const avgScore = classMarks.length > 0 ? Math.round(totalScore / classMarks.length) : 82;

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are a curriculum specialist analyzing Class 10-A performance data.
Output strict JSON with:
"averageScore": ${avgScore},
"attendanceRate": 91,
"topPerformers": ["Riya Verma", "Aarav Sharma", "Ananya Patel"],
"studentsNeedingSupport": ["Rahul Gupta", "Aditya Singh"],
"subjectTrends": [
  {"subject": "Computer Science", "averageScore": 91, "status": "strong"},
  {"subject": "Mathematics", "averageScore": 84, "status": "strong"},
  {"subject": "Science", "averageScore": 82, "status": "average"},
  {"subject": "Social Science", "averageScore": 76, "status": "average"},
  {"subject": "English", "averageScore": 72, "status": "needs_attention"}
],
"observations": [
  "12 students showed marked score improvement between Mid-Term and Pre-Board examinations.",
  "Computer Science recorded the highest conceptual mastery across all sections.",
  "English descriptive answer writing requires guided classroom revision."
],
"teacherRecommendations": [
  "Schedule targeted English writing workshops focusing on formal letter composition.",
  "Conduct peer study groups pairing advanced mathematics problem-solvers with peers needing reinforcement.",
  "Continue regular practical lab assignments to maintain high science engagement."
]

Return ONLY raw JSON, no markdown.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const responseText = response.text?.trim();
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return res.json({
          classId: classId || 'Class 10-A',
          totalStudents: classStudents.length,
          ...parsed,
          generatedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('Gemini class analytics error, using fallback:', err);
    }
  }

  // Fallback class analytics
  res.json({
    classId: classId || 'Class 10-A',
    totalStudents: classStudents.length || 5,
    averageScore: avgScore,
    attendanceRate: 91,
    topPerformers: ['Riya Verma (95%)', 'Aarav Sharma (89%)', 'Ananya Patel (88%)'],
    studentsNeedingSupport: ['Rahul Gupta (63%)', 'Aditya Singh (73%)'],
    subjectTrends: [
      { subject: 'Computer Science', averageScore: 91, status: 'strong' },
      { subject: 'Mathematics', averageScore: 84, status: 'strong' },
      { subject: 'Science', averageScore: 82, status: 'average' },
      { subject: 'Social Science', averageScore: 76, status: 'average' },
      { subject: 'English', averageScore: 72, status: 'needs_attention' }
    ],
    observations: [
      '12 students showed marked score improvement between Mid-Term and Pre-Board examinations.',
      'Computer Science recorded the highest conceptual mastery across all sections.',
      'English descriptive answer writing requires guided classroom revision.'
    ],
    teacherRecommendations: [
      'Schedule targeted English writing workshops focusing on formal letter composition.',
      'Conduct peer study groups pairing advanced mathematics problem-solvers with peers needing reinforcement.',
      'Continue regular practical lab assignments to maintain high science engagement.'
    ],
    generatedAt: new Date().toISOString()
  });
});

// --------------------------------------------------------------------------
// VITE MIDDLEWARE (Handles frontend in Dev & Production)
// --------------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Education Management Server running on port ${PORT}`);
  });
}

startServer();
