/**
 * Types & Data Models for the Smart Education Management System
 * 
 * Beginner Note:
 * TypeScript types act as blueprints for our data. They ensure that every student,
 * attendance record, exam mark, and notice has the exact properties expected,
 * preventing bugs and typos across our frontend and backend.
 */

export type UserRole = 'teacher' | 'parent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  designation?: string;
  assignedClass?: string; // e.g., "Class 10-A" for teacher
  childStudentId?: string; // Links parent to their child student
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;           // e.g., "10"
  section: string;         // e.g., "A"
  parentId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;             // YYYY-MM-DD
  profilePhoto: string;
  emergencyContact: string;
  bloodGroup?: string;
  address?: string;
  attendanceRate?: number;
}

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;            // YYYY-MM-DD
  status: AttendanceStatus;
  markedBy: string;        // Teacher ID or Name
  remarks?: string;
}

export interface Exam {
  id: string;
  title: string;           // e.g. "Mid-Term Examination 2026", "Final Examination 2026"
  term: 'Term 1' | 'Term 2' | 'Final';
  startDate: string;
  endDate: string;
  class: string;
}

export interface MarkRecord {
  id: string;
  studentId: string;
  examId: string;
  subject: string;         // e.g., "Mathematics", "Science", "English", etc.
  maxMarks: number;
  obtainedMarks: number;
  grade: string;           // e.g., "A+", "A", "B", "C"
}

export type NoticePriority = 'normal' | 'important' | 'urgent';

export interface Notice {
  id: string;
  title: string;
  description: string;
  date: string;            // YYYY-MM-DD
  priority: NoticePriority;
  targetClass: string;     // e.g., "All Classes" or "Class 10-A"
  createdBy: string;       // Author name
  attachmentName?: string;
}

export type MeetingStatus = 'scheduled' | 'pending' | 'completed' | 'cancelled';

export interface Meeting {
  id: string;
  teacherId: string;
  teacherName: string;
  parentId: string;
  parentName: string;
  studentId: string;
  studentName: string;
  date: string;            // YYYY-MM-DD
  time: string;            // e.g. "10:30 AM"
  subject: string;
  location: string;        // e.g. "Room 204" or "Virtual Meeting Link"
  purpose: string;
  status: MeetingStatus;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  deadline: string;        // YYYY-MM-DD
  class: string;
  section: string;
  createdBy: string;
  status: 'active' | 'submitted' | 'graded';
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string;            // e.g., "09:00 AM - 09:45 AM"
  subject: string;
  teacherName: string;
  room: string;
  class: string;
  section: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'academic' | 'sports' | 'cultural' | 'holiday' | 'meeting';
  location: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'notice' | 'attendance' | 'exam' | 'meeting' | 'alert';
  read: boolean;
  createdAt: string;
}

export interface AIStudentInsight {
  studentId: string;
  strongSubjects: string[];
  subjectsNeedingAttention: string[];
  attendanceSummary: string;
  performanceTrend: 'improving' | 'stable' | 'declining';
  suggestedFocus: string[];
  detailedObservation: string;
  generatedAt: string;
}

export interface AIClassAnalytics {
  classId: string;
  totalStudents: number;
  averageScore: number;
  attendanceRate: number;
  topPerformers: string[];
  studentsNeedingSupport: string[];
  subjectTrends: {
    subject: string;
    averageScore: number;
    status: 'strong' | 'average' | 'needs_attention';
  }[];
  observations: string[];
  teacherRecommendations: string[];
  generatedAt: string;
}
