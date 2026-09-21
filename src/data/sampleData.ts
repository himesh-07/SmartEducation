import { 
  User, 
  Student, 
  AttendanceRecord, 
  Exam, 
  MarkRecord, 
  Notice, 
  Meeting, 
  Assignment, 
  TimetableSlot, 
  SchoolEvent, 
  NotificationItem 
} from '../types';

/**
 * Realistic Sample Data for Smart Education Management System
 * 
 * Beginner Note:
 * When building a real system, having realistic data helps us build and test
 * features (like attendance charts, student report cards, and AI insights)
 * accurately without needing an empty, confusing screen.
 */

export const DEMO_USERS: User[] = [
  {
    id: 'u-teacher-1',
    name: 'Mrs. Priya Sharma',
    email: 'teacher@school.edu',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 43210',
    designation: 'Senior Faculty & Class 10-A Mentor',
    assignedClass: 'Class 10-A'
  },
  {
    id: 'u-parent-1',
    name: 'Mr. Rajesh Sharma',
    email: 'parent@school.edu',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98111 22334',
    designation: 'Parent of Aarav Sharma',
    childStudentId: 'std-1'
  },
  {
    id: 'u-parent-2',
    name: 'Mrs. Sunita Verma',
    email: 'parent.verma@school.edu',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98222 33445',
    designation: 'Parent of Riya Verma',
    childStudentId: 'std-2'
  }
];

export const DEMO_STUDENTS: Student[] = [
  {
    id: 'std-1',
    name: 'Aarav Sharma',
    rollNumber: '10A-01',
    class: '10',
    section: 'A',
    parentId: 'u-parent-1',
    parentName: 'Mr. Rajesh Sharma',
    parentEmail: 'parent@school.edu',
    parentPhone: '+91 98111 22334',
    gender: 'Male',
    dob: '2010-04-12',
    profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    emergencyContact: '+91 98111 22334',
    bloodGroup: 'B+'
  },
  {
    id: 'std-2',
    name: 'Riya Verma',
    rollNumber: '10A-02',
    class: '10',
    section: 'A',
    parentId: 'u-parent-2',
    parentName: 'Mrs. Sunita Verma',
    parentEmail: 'parent.verma@school.edu',
    parentPhone: '+91 98222 33445',
    gender: 'Female',
    dob: '2010-08-23',
    profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    emergencyContact: '+91 98222 33445',
    bloodGroup: 'O+'
  },
  {
    id: 'std-3',
    name: 'Aditya Singh',
    rollNumber: '10A-03',
    class: '10',
    section: 'A',
    parentId: 'u-parent-3',
    parentName: 'Mr. Vikram Singh',
    parentEmail: 'vikram.singh@gmail.com',
    parentPhone: '+91 98333 44556',
    gender: 'Male',
    dob: '2010-02-15',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    emergencyContact: '+91 98333 44556',
    bloodGroup: 'A+'
  },
  {
    id: 'std-4',
    name: 'Ananya Patel',
    rollNumber: '10A-04',
    class: '10',
    section: 'A',
    parentId: 'u-parent-4',
    parentName: 'Mr. Deepak Patel',
    parentEmail: 'deepak.patel@gmail.com',
    parentPhone: '+91 98444 55667',
    gender: 'Female',
    dob: '2010-11-05',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    emergencyContact: '+91 98444 55667',
    bloodGroup: 'AB+'
  },
  {
    id: 'std-5',
    name: 'Rahul Gupta',
    rollNumber: '10A-05',
    class: '10',
    section: 'A',
    parentId: 'u-parent-5',
    parentName: 'Mrs. Meena Gupta',
    parentEmail: 'meena.gupta@gmail.com',
    parentPhone: '+91 98555 66778',
    gender: 'Male',
    dob: '2010-06-30',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    emergencyContact: '+91 98555 66778',
    bloodGroup: 'O-'
  }
];

export const DEMO_EXAMS: Exam[] = [
  {
    id: 'exam-1',
    title: 'Mid-Term Assessment 2026',
    term: 'Term 1',
    startDate: '2026-08-10',
    endDate: '2026-08-22',
    class: '10'
  },
  {
    id: 'exam-2',
    title: 'Pre-Board Examination 2026',
    term: 'Term 2',
    startDate: '2026-09-01',
    endDate: '2026-09-12',
    class: '10'
  }
];

export const DEMO_MARKS: MarkRecord[] = [
  // Aarav Sharma - Exam 1 (Mid-Term)
  { id: 'm-1', studentId: 'std-1', examId: 'exam-1', subject: 'Mathematics', maxMarks: 100, obtainedMarks: 82, grade: 'A' },
  { id: 'm-2', studentId: 'std-1', examId: 'exam-1', subject: 'Science', maxMarks: 100, obtainedMarks: 88, grade: 'A+' },
  { id: 'm-3', studentId: 'std-1', examId: 'exam-1', subject: 'English', maxMarks: 100, obtainedMarks: 76, grade: 'B+' },
  { id: 'm-4', studentId: 'std-1', examId: 'exam-1', subject: 'Computer Science', maxMarks: 100, obtainedMarks: 94, grade: 'A+' },
  { id: 'm-5', studentId: 'std-1', examId: 'exam-1', subject: 'Social Science', maxMarks: 100, obtainedMarks: 79, grade: 'B+' },

  // Aarav Sharma - Exam 2 (Pre-Board) -> shows improvement in Math & CS, slight dip in English
  { id: 'm-6', studentId: 'std-1', examId: 'exam-2', subject: 'Mathematics', maxMarks: 100, obtainedMarks: 89, grade: 'A+' },
  { id: 'm-7', studentId: 'std-1', examId: 'exam-2', subject: 'Science', maxMarks: 100, obtainedMarks: 91, grade: 'A+' },
  { id: 'm-8', studentId: 'std-1', examId: 'exam-2', subject: 'English', maxMarks: 100, obtainedMarks: 74, grade: 'B' },
  { id: 'm-9', studentId: 'std-1', examId: 'exam-2', subject: 'Computer Science', maxMarks: 100, obtainedMarks: 98, grade: 'A+' },
  { id: 'm-10', studentId: 'std-1', examId: 'exam-2', subject: 'Social Science', maxMarks: 100, obtainedMarks: 84, grade: 'A' },

  // Riya Verma - Exam 2
  { id: 'm-11', studentId: 'std-2', examId: 'exam-2', subject: 'Mathematics', maxMarks: 100, obtainedMarks: 95, grade: 'A+' },
  { id: 'm-12', studentId: 'std-2', examId: 'exam-2', subject: 'Science', maxMarks: 100, obtainedMarks: 92, grade: 'A+' },
  { id: 'm-13', studentId: 'std-2', examId: 'exam-2', subject: 'English', maxMarks: 100, obtainedMarks: 90, grade: 'A+' },
  { id: 'm-14', studentId: 'std-2', examId: 'exam-2', subject: 'Computer Science', maxMarks: 100, obtainedMarks: 91, grade: 'A+' },
  { id: 'm-15', studentId: 'std-2', examId: 'exam-2', subject: 'Social Science', maxMarks: 100, obtainedMarks: 88, grade: 'A+' },

  // Aditya Singh - Exam 2
  { id: 'm-16', studentId: 'std-3', examId: 'exam-2', subject: 'Mathematics', maxMarks: 100, obtainedMarks: 68, grade: 'B' },
  { id: 'm-17', studentId: 'std-3', examId: 'exam-2', subject: 'Science', maxMarks: 100, obtainedMarks: 72, grade: 'B+' },
  { id: 'm-18', studentId: 'std-3', examId: 'exam-2', subject: 'English', maxMarks: 100, obtainedMarks: 75, grade: 'B+' },
  { id: 'm-19', studentId: 'std-3', examId: 'exam-2', subject: 'Computer Science', maxMarks: 100, obtainedMarks: 80, grade: 'A' },
  { id: 'm-20', studentId: 'std-3', examId: 'exam-2', subject: 'Social Science', maxMarks: 100, obtainedMarks: 70, grade: 'B' },

  // Ananya Patel - Exam 2
  { id: 'm-21', studentId: 'std-4', examId: 'exam-2', subject: 'Mathematics', maxMarks: 100, obtainedMarks: 88, grade: 'A+' },
  { id: 'm-22', studentId: 'std-4', examId: 'exam-2', subject: 'Science', maxMarks: 100, obtainedMarks: 86, grade: 'A' },
  { id: 'm-23', studentId: 'std-4', examId: 'exam-2', subject: 'English', maxMarks: 100, obtainedMarks: 89, grade: 'A+' },
  { id: 'm-24', studentId: 'std-4', examId: 'exam-2', subject: 'Computer Science', maxMarks: 100, obtainedMarks: 93, grade: 'A+' },
  { id: 'm-25', studentId: 'std-4', examId: 'exam-2', subject: 'Social Science', maxMarks: 100, obtainedMarks: 85, grade: 'A' },

  // Rahul Gupta - Exam 2
  { id: 'm-26', studentId: 'std-5', examId: 'exam-2', subject: 'Mathematics', maxMarks: 100, obtainedMarks: 58, grade: 'C' },
  { id: 'm-27', studentId: 'std-5', examId: 'exam-2', subject: 'Science', maxMarks: 100, obtainedMarks: 61, grade: 'C+' },
  { id: 'm-28', studentId: 'std-5', examId: 'exam-2', subject: 'English', maxMarks: 100, obtainedMarks: 65, grade: 'B' },
  { id: 'm-29', studentId: 'std-5', examId: 'exam-2', subject: 'Computer Science', maxMarks: 100, obtainedMarks: 72, grade: 'B+' },
  { id: 'm-30', studentId: 'std-5', examId: 'exam-2', subject: 'Social Science', maxMarks: 100, obtainedMarks: 63, grade: 'C+' }
];

export const DEMO_ATTENDANCE: AttendanceRecord[] = [
  // Today's attendance for Class 10-A
  { id: 'att-1', studentId: 'std-1', date: '2026-09-21', status: 'present', markedBy: 'Mrs. Priya Sharma' },
  { id: 'att-2', studentId: 'std-2', date: '2026-09-21', status: 'present', markedBy: 'Mrs. Priya Sharma' },
  { id: 'att-3', studentId: 'std-3', date: '2026-09-21', status: 'late', markedBy: 'Mrs. Priya Sharma', remarks: 'Arrived 15 mins late due to bus delay' },
  { id: 'att-4', studentId: 'std-4', date: '2026-09-21', status: 'present', markedBy: 'Mrs. Priya Sharma' },
  { id: 'att-5', studentId: 'std-5', date: '2026-09-21', status: 'absent', markedBy: 'Mrs. Priya Sharma', remarks: 'Medical leave' },

  // Yesterday's attendance
  { id: 'att-6', studentId: 'std-1', date: '2026-09-20', status: 'present', markedBy: 'Mrs. Priya Sharma' },
  { id: 'att-7', studentId: 'std-2', date: '2026-09-20', status: 'present', markedBy: 'Mrs. Priya Sharma' },
  { id: 'att-8', studentId: 'std-3', date: '2026-09-20', status: 'present', markedBy: 'Mrs. Priya Sharma' },
  { id: 'att-9', studentId: 'std-4', date: '2026-09-20', status: 'present', markedBy: 'Mrs. Priya Sharma' },
  { id: 'att-10', studentId: 'std-5', date: '2026-09-20', status: 'absent', markedBy: 'Mrs. Priya Sharma' },

  // Previous days
  { id: 'att-11', studentId: 'std-1', date: '2026-09-19', status: 'present', markedBy: 'Mrs. Priya Sharma' },
  { id: 'att-12', studentId: 'std-1', date: '2026-09-18', status: 'present', markedBy: 'Mrs. Priya Sharma' },
  { id: 'att-13', studentId: 'std-1', date: '2026-09-17', status: 'late', markedBy: 'Mrs. Priya Sharma' },
  { id: 'att-14', studentId: 'std-1', date: '2026-09-16', status: 'present', markedBy: 'Mrs. Priya Sharma' }
];

export const DEMO_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: 'Parent-Teacher Meeting (Term 2)',
    description: 'The upcoming Parent-Teacher Meeting will be conducted to discuss the Pre-Board results and board examination preparations. Attendance is mandatory for all Class 10 parents.',
    date: '2026-10-15',
    priority: 'urgent',
    targetClass: 'Class 10-A',
    createdBy: 'Mrs. Priya Sharma (Class Mentor)',
    attachmentName: 'PTM_Schedule_Class10.pdf'
  },
  {
    id: 'not-2',
    title: 'Annual Inter-School Science Exhibition 2026',
    description: 'Students interested in showcasing working models for Physics, AI & Robotics, and Sustainable Energy are invited to submit their abstract by September 30.',
    date: '2026-09-28',
    priority: 'important',
    targetClass: 'All Classes',
    createdBy: 'Science Department'
  },
  {
    id: 'not-3',
    title: 'Gandhi Jayanti School Holiday',
    description: 'Please note that the school will remain closed on October 2, 2026 in observance of Gandhi Jayanti. Regular classes will resume on October 3.',
    date: '2026-10-02',
    priority: 'normal',
    targetClass: 'All Classes',
    createdBy: 'Principal Office'
  }
];

export const DEMO_MEETINGS: Meeting[] = [
  {
    id: 'mtg-1',
    teacherId: 'u-teacher-1',
    teacherName: 'Mrs. Priya Sharma',
    parentId: 'u-parent-1',
    parentName: 'Mr. Rajesh Sharma',
    studentId: 'std-1',
    studentName: 'Aarav Sharma',
    date: '2026-10-15',
    time: '10:30 AM - 10:45 AM',
    subject: 'Academic Progress & Board Prep',
    location: 'School Auditorium - Desk 04',
    purpose: 'Discussing Aarav’s strong grasp in Science/Computer Science and supporting his English language performance.',
    status: 'scheduled'
  },
  {
    id: 'mtg-2',
    teacherId: 'u-teacher-1',
    teacherName: 'Mrs. Priya Sharma',
    parentId: 'u-parent-2',
    parentName: 'Mrs. Sunita Verma',
    studentId: 'std-2',
    studentName: 'Riya Verma',
    date: '2026-10-15',
    time: '11:00 AM - 11:15 AM',
    subject: 'Pre-Board Excellence & Olympiad',
    location: 'School Auditorium - Desk 04',
    purpose: 'Reviewing top performance in Mathematics and Olympiad enrollment.',
    status: 'scheduled'
  }
];

export const DEMO_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Quadratic Equations & Polynomials Practice',
    description: 'Solve Chapter 4 exercise 4.2 questions 1 to 10 with complete step-by-step proofs in your homework notebook.',
    subject: 'Mathematics',
    deadline: '2026-09-25',
    class: '10',
    section: 'A',
    createdBy: 'Mrs. Priya Sharma',
    status: 'active'
  },
  {
    id: 'asg-2',
    title: 'Electricity & Magnetic Field Project Report',
    description: 'Submit a 3-page handwritten project report on Ohm’s Law applications in modern circuits with circuit diagram diagrams.',
    subject: 'Science',
    deadline: '2026-09-28',
    class: '10',
    section: 'A',
    createdBy: 'Mr. Arvind Saxena',
    status: 'active'
  },
  {
    id: 'asg-3',
    title: 'Formal Letter to the Editor',
    description: 'Draft a 150-word letter addressing concerns regarding community plastic recycling initiatives.',
    subject: 'English',
    deadline: '2026-09-24',
    class: '10',
    section: 'A',
    createdBy: 'Ms. Elizabeth George',
    status: 'active'
  }
];

export const DEMO_TIMETABLE: TimetableSlot[] = [
  // Monday
  { id: 'tt-1', day: 'Monday', time: '08:30 AM - 09:15 AM', subject: 'Mathematics', teacherName: 'Mrs. Priya Sharma', room: 'Room 204', class: '10', section: 'A' },
  { id: 'tt-2', day: 'Monday', time: '09:15 AM - 10:00 AM', subject: 'Science (Physics)', teacherName: 'Mr. Arvind Saxena', room: 'Lab 1', class: '10', section: 'A' },
  { id: 'tt-3', day: 'Monday', time: '10:15 AM - 11:00 AM', subject: 'English Literature', teacherName: 'Ms. Elizabeth George', room: 'Room 204', class: '10', section: 'A' },
  { id: 'tt-4', day: 'Monday', time: '11:00 AM - 11:45 AM', subject: 'Computer Science', teacherName: 'Mr. Rohan Mehta', room: 'Computer Lab 2', class: '10', section: 'A' },
  { id: 'tt-5', day: 'Monday', time: '12:30 PM - 01:15 PM', subject: 'Social Science', teacherName: 'Mrs. Kamla Devi', room: 'Room 204', class: '10', section: 'A' },

  // Tuesday
  { id: 'tt-6', day: 'Tuesday', time: '08:30 AM - 09:15 AM', subject: 'Science (Chemistry)', teacherName: 'Dr. Vivek Joshi', room: 'Chemistry Lab', class: '10', section: 'A' },
  { id: 'tt-7', day: 'Tuesday', time: '09:15 AM - 10:00 AM', subject: 'Mathematics', teacherName: 'Mrs. Priya Sharma', room: 'Room 204', class: '10', section: 'A' },
  { id: 'tt-8', day: 'Tuesday', time: '10:15 AM - 11:00 AM', subject: 'Social Science', teacherName: 'Mrs. Kamla Devi', room: 'Room 204', class: '10', section: 'A' },
  { id: 'tt-9', day: 'Tuesday', time: '11:00 AM - 11:45 AM', subject: 'Physical Education', teacherName: 'Coach Sandeep', room: 'Playground', class: '10', section: 'A' },
  { id: 'tt-10', day: 'Tuesday', time: '12:30 PM - 01:15 PM', subject: 'English Grammar', teacherName: 'Ms. Elizabeth George', room: 'Room 204', class: '10', section: 'A' },

  // Wednesday
  { id: 'tt-11', day: 'Wednesday', time: '08:30 AM - 09:15 AM', subject: 'Computer Science', teacherName: 'Mr. Rohan Mehta', room: 'Computer Lab 2', class: '10', section: 'A' },
  { id: 'tt-12', day: 'Wednesday', time: '09:15 AM - 10:00 AM', subject: 'Mathematics', teacherName: 'Mrs. Priya Sharma', room: 'Room 204', class: '10', section: 'A' },
  { id: 'tt-13', day: 'Wednesday', time: '10:15 AM - 11:00 AM', subject: 'Science (Biology)', teacherName: 'Dr. Vivek Joshi', room: 'Lab 2', class: '10', section: 'A' },
  { id: 'tt-14', day: 'Wednesday', time: '11:00 AM - 11:45 AM', subject: 'English', teacherName: 'Ms. Elizabeth George', room: 'Room 204', class: '10', section: 'A' },

  // Thursday
  { id: 'tt-15', day: 'Thursday', time: '08:30 AM - 09:15 AM', subject: 'Mathematics', teacherName: 'Mrs. Priya Sharma', room: 'Room 204', class: '10', section: 'A' },
  { id: 'tt-16', day: 'Thursday', time: '09:15 AM - 10:00 AM', subject: 'Social Science', teacherName: 'Mrs. Kamla Devi', room: 'Room 204', class: '10', section: 'A' },
  { id: 'tt-17', day: 'Thursday', time: '10:15 AM - 11:00 AM', subject: 'Science', teacherName: 'Mr. Arvind Saxena', room: 'Room 204', class: '10', section: 'A' },

  // Friday
  { id: 'tt-18', day: 'Friday', time: '08:30 AM - 09:15 AM', subject: 'English Literature', teacherName: 'Ms. Elizabeth George', room: 'Room 204', class: '10', section: 'A' },
  { id: 'tt-19', day: 'Friday', time: '09:15 AM - 10:00 AM', subject: 'Mathematics Doubt Clearing', teacherName: 'Mrs. Priya Sharma', room: 'Room 204', class: '10', section: 'A' },
  { id: 'tt-20', day: 'Friday', time: '10:15 AM - 11:00 AM', subject: 'Library & Reading Hour', teacherName: 'Mrs. Meenakshi', room: 'Library', class: '10', section: 'A' },

  // Saturday
  { id: 'tt-21', day: 'Saturday', time: '08:30 AM - 10:00 AM', subject: 'Co-Curricular Clubs & Robotics', teacherName: 'Club Faculty', room: 'Activity Hall', class: '10', section: 'A' },
  { id: 'tt-22', day: 'Saturday', time: '10:15 AM - 11:30 AM', subject: 'Sports & Wellness', teacherName: 'Coach Sandeep', room: 'Playground', class: '10', section: 'A' }
];

export const DEMO_EVENTS: SchoolEvent[] = [
  {
    id: 'evt-1',
    title: 'Parent-Teacher Meeting (Term 2)',
    description: 'Comprehensive review meeting for Class 10 students with teachers.',
    date: '2026-10-15',
    category: 'meeting',
    location: 'School Auditorium'
  },
  {
    id: 'evt-2',
    title: 'Annual Athletic Sports Meet',
    description: 'Track and field events, relay races, and award ceremonies.',
    date: '2026-11-04',
    category: 'sports',
    location: 'Main Sports Complex'
  },
  {
    id: 'evt-3',
    title: 'CBSE Pre-Board Examination Series II',
    description: 'Full syllabus simulation examinations for Class 10.',
    date: '2026-11-20',
    category: 'academic',
    location: 'Examination Halls A & B'
  }
];

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'ntf-1',
    userId: 'u-parent-1',
    title: 'New School Notice Published',
    message: 'Parent-Teacher Meeting notice for Class 10-A has been announced for October 15, 2026.',
    type: 'notice',
    read: false,
    createdAt: '2 hours ago'
  },
  {
    id: 'ntf-2',
    userId: 'u-parent-1',
    title: 'Attendance Recorded',
    message: 'Aarav Sharma was marked PRESENT today (21 Sep 2026). Overall attendance: 92%.',
    type: 'attendance',
    read: false,
    createdAt: '4 hours ago'
  },
  {
    id: 'ntf-3',
    userId: 'u-parent-1',
    title: 'Pre-Board Marks Released',
    message: 'Mathematics score: 89/100 (A+). Computer Science score: 98/100 (A+).',
    type: 'exam',
    read: true,
    createdAt: '1 day ago'
  },
  {
    id: 'ntf-4',
    userId: 'u-teacher-1',
    title: 'Daily Attendance Reminder',
    message: 'Class 10-A attendance for today has been logged by Mrs. Priya Sharma.',
    type: 'attendance',
    read: false,
    createdAt: '3 hours ago'
  },
  {
    id: 'ntf-5',
    userId: 'u-teacher-1',
    title: 'Upcoming PTM Schedule',
    message: '2 PTM slots scheduled for 15 October 2026 in Auditorium Desk 04.',
    type: 'meeting',
    read: true,
    createdAt: '2 days ago'
  }
];
