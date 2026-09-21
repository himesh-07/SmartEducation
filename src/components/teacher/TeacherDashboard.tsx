import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Plus, 
  Search, 
  FileText, 
  Sparkles, 
  Award, 
  BookOpen, 
  Filter, 
  Check, 
  AlertCircle, 
  RefreshCw,
  Send,
  Eye,
  Trash2,
  X,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  Student, 
  AttendanceRecord, 
  MarkRecord, 
  Notice, 
  Meeting, 
  AIClassAnalytics, 
  Assignment 
} from '../../types';
import { 
  DEMO_STUDENTS, 
  DEMO_ATTENDANCE, 
  DEMO_MARKS, 
  DEMO_NOTICES, 
  DEMO_MEETINGS, 
  DEMO_ASSIGNMENTS 
} from '../../data/sampleData';
import { createStudentInFirestore } from '../../lib/firestoreService';

export const TeacherDashboard: React.FC = () => {
  const { currentUser, addNotification, students: contextStudents, firestoreStudentIds } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'students' | 'marks' | 'ai_class' | 'notices' | 'ptm' | 'assignments'>('overview');

  // Core Data States
  const [students, setStudents] = useState<Student[]>(contextStudents || DEMO_STUDENTS);

  useEffect(() => {
    if (contextStudents && contextStudents.length > 0) {
      setStudents(contextStudents);
    }
  }, [contextStudents]);

  // Add Student to Firestore Modal State
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [savingStudent, setSavingStudent] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    rollNumber: '',
    class: '10',
    section: 'A',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    attendanceRate: 95
  });
  const [studentSuccessMsg, setStudentSuccessMsg] = useState('');
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>(DEMO_ATTENDANCE);
  const [marks, setMarks] = useState<MarkRecord[]>(DEMO_MARKS);
  const [notices, setNotices] = useState<Notice[]>(DEMO_NOTICES);
  const [meetings, setMeetings] = useState<Meeting[]>(DEMO_MEETINGS);
  const [assignments, setAssignments] = useState<Assignment[]>(DEMO_ASSIGNMENTS);

  // Student Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);

  // Daily Attendance Register State
  const [attendanceDate, setAttendanceDate] = useState('2026-09-21');
  const [dailyAttendanceState, setDailyAttendanceState] = useState<{ [studentId: string]: 'present' | 'absent' | 'late' }>({
    'std-1': 'present',
    'std-2': 'present',
    'std-3': 'late',
    'std-4': 'present',
    'std-5': 'absent'
  });
  const [attendanceSaveMsg, setAttendanceSaveMsg] = useState('');

  // Marks Manager State
  const [selectedExamId, setSelectedExamId] = useState('exam-2'); // Pre-Board
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [marksDraft, setMarksDraft] = useState<{ [studentId: string]: number }>({
    'std-1': 89,
    'std-2': 94,
    'std-3': 68,
    'std-4': 92,
    'std-5': 65
  });
  const [marksSaveMsg, setMarksSaveMsg] = useState('');

  // AI Class Insights State
  const [aiClassInsight, setAiClassInsight] = useState<AIClassAnalytics | null>(null);
  const [loadingClassAi, setLoadingClassAi] = useState(false);

  // Notice Creation Form State
  const [newNotice, setNewNotice] = useState({
    title: '',
    description: '',
    priority: 'important' as 'urgent' | 'important' | 'normal',
    targetClass: 'Class 10-A'
  });
  const [noticePublishMsg, setNoticePublishMsg] = useState('');

  // Assignment Creation Form State
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: 'Mathematics',
    dueDate: '2026-09-28',
    description: ''
  });
  const [assignmentPublishMsg, setAssignmentPublishMsg] = useState('');

  // Fetch Class AI Insights
  const fetchClassAiInsights = async () => {
    setLoadingClassAi(true);
    try {
      const res = await fetch('/api/ai/class-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId: '10-A' })
      });
      if (res.ok) {
        const data = await res.json();
        setAiClassInsight(data);
      }
    } catch (err) {
      console.error('Error fetching class AI insights:', err);
    } finally {
      setLoadingClassAi(false);
    }
  };

  useEffect(() => {
    fetchClassAiInsights();
  }, []);

  // Filtered Students
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Quick Attendance Actions
  const handleMarkAllPresent = () => {
    const updated: { [studentId: string]: 'present' | 'absent' | 'late' } = {};
    students.forEach(s => {
      updated[s.id] = 'present';
    });
    setDailyAttendanceState(updated);
  };

  const handleSaveAttendance = () => {
    const newRecords: AttendanceRecord[] = students.map(s => ({
      id: `att-${Date.now()}-${s.id}`,
      studentId: s.id,
      studentName: s.name,
      class: s.class,
      section: s.section,
      date: attendanceDate,
      status: dailyAttendanceState[s.id] || 'present',
      markedBy: currentUser?.name || 'Mrs. Priya Sharma'
    }));

    // Filter out previous entries for that date and add new ones
    setAttendanceLogs(prev => [
      ...newRecords,
      ...prev.filter(a => a.date !== attendanceDate)
    ]);

    setAttendanceSaveMsg(`Attendance register for ${attendanceDate} saved successfully!`);
    addNotification({
      userId: 'all',
      title: 'Daily Attendance Synced',
      message: `Attendance register updated for Class 10-A (${attendanceDate}).`,
      type: 'attendance'
    });

    setTimeout(() => setAttendanceSaveMsg(''), 4000);
  };

  // Save Marks
  const handleSaveMarks = () => {
    const updatedMarks: MarkRecord[] = [...marks];

    students.forEach(s => {
      const score = marksDraft[s.id] || 0;
      const pct = (score / 100) * 100;
      let grade = 'C';
      if (pct >= 90) grade = 'A+';
      else if (pct >= 80) grade = 'A';
      else if (pct >= 70) grade = 'B';
      else if (pct >= 60) grade = 'C';
      else grade = 'D';

      const existingIndex = updatedMarks.findIndex(
        m => m.studentId === s.id && m.examId === selectedExamId && m.subject === selectedSubject
      );

      if (existingIndex >= 0) {
        updatedMarks[existingIndex] = {
          ...updatedMarks[existingIndex],
          obtainedMarks: score,
          grade
        };
      } else {
        updatedMarks.push({
          id: `mark-${Date.now()}-${s.id}`,
          studentId: s.id,
          examId: selectedExamId,
          subject: selectedSubject,
          maxMarks: 100,
          obtainedMarks: score,
          grade
        });
      }
    });

    setMarks(updatedMarks);
    setMarksSaveMsg(`Marks for ${selectedSubject} saved and grades calculated!`);
    addNotification({
      userId: 'all',
      title: 'Examination Marks Updated',
      message: `Class 10-A marks published for ${selectedSubject}.`,
      type: 'exam'
    });
    setTimeout(() => setMarksSaveMsg(''), 4000);
  };

  // Publish Notice
  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title.trim() || !newNotice.description.trim()) return;

    const notice: Notice = {
      id: `ntc-${Date.now()}`,
      title: newNotice.title,
      description: newNotice.description,
      priority: newNotice.priority,
      targetClass: newNotice.targetClass,
      date: new Date().toISOString().split('T')[0],
      createdBy: currentUser?.name || 'Mrs. Priya Sharma'
    };

    setNotices([notice, ...notices]);
    setNoticePublishMsg('Notice broadcasted to parents and students successfully!');
    setNewNotice({ title: '', description: '', priority: 'important', targetClass: 'Class 10-A' });

    addNotification({
      userId: 'all',
      title: `Notice: ${notice.title}`,
      message: notice.description,
      type: 'notice'
    });

    setTimeout(() => setNoticePublishMsg(''), 4000);
  };

  // Publish Assignment
  const handlePublishAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title.trim()) return;

    const assignment: Assignment = {
      id: `asg-${Date.now()}`,
      title: newAssignment.title,
      subject: newAssignment.subject,
      class: '10',
      section: 'A',
      createdBy: currentUser?.name || 'Mrs. Priya Sharma',
      deadline: newAssignment.dueDate,
      description: newAssignment.description,
      status: 'active'
    };

    setAssignments([assignment, ...assignments]);
    setAssignmentPublishMsg('Assignment posted to class schedule!');
    setNewAssignment({ title: '', subject: 'Mathematics', dueDate: '2026-09-28', description: '' });

    setTimeout(() => setAssignmentPublishMsg(''), 4000);
  };

  // Update PTM status
  const handleUpdateMeetingStatus = (meetingId: string, status: 'scheduled' | 'completed' | 'cancelled') => {
    setMeetings(prev =>
      prev.map(m => (m.id === meetingId ? { ...m, status } : m))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      
      {/* Faculty Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
                PS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900">Faculty Dashboard —  Mrs. Priya Sharma</h1>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    
                  </span>
                </div>
                
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="quick-attendance-header-btn"
                onClick={() => setActiveTab('attendance')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <Clock className="w-4 h-4 text-emerald-400" /> Daily Register
              </button>
              <button
                id="quick-post-notice-btn"
                onClick={() => setActiveTab('notices')}
                className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200 transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" /> Broadcast Notice
              </button>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pt-6 border-t border-slate-100 mt-6 scrollbar-none text-xs font-semibold">
            {[
              { id: 'overview', label: 'Class Overview' },
              { id: 'attendance', label: 'Attendance Register' },
              { id: 'students', label: 'Student Directory (5)' },
              { id: 'marks', label: 'Exam Marks Manager' },
              { id: 'ai_class', label: 'AI Class Analytics', highlight: true },
              { id: 'notices', label: 'Notice Publisher' },
              { id: 'ptm', label: 'PTM Requests' },
              { id: 'assignments', label: 'Homework & Tasks' }
            ].map(tab => (
              <button
                key={tab.id}
                id={`teacher-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : tab.highlight
                    ? 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.highlight && <Sparkles className="w-3.5 h-3.5" />}
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* ------------------------------------------------------------------ */}
        {/* VIEW 1: CLASS OVERVIEW */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div 
                onClick={() => setActiveTab('students')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-300 transition-all"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Assigned Students</span>
                  <Users className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 mt-2">{students.length}</p>
                <span className="text-[11px] text-slate-400 mt-1 block">Class 10-A • 100% active</span>
              </div>

              <div 
                onClick={() => setActiveTab('attendance')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-300 transition-all"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Today's Attendance</span>
                  <Clock className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-extrabold text-emerald-600 mt-2">80%</p>
                <span className="text-[11px] text-slate-400 mt-1 block">4 Present • 1 Absent</span>
              </div>

              <div 
                onClick={() => setActiveTab('marks')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-300 transition-all"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Class Pre-Board Avg</span>
                  <Award className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 mt-2">81.6%</p>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">+6.4% from Mid-Term</span>
              </div>

              <div 
                onClick={() => setActiveTab('ptm')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-300 transition-all"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>PTM Consultations</span>
                  <Calendar className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 mt-2">2</p>
                <span className="text-[11px] text-amber-700 font-medium mt-1 block">1 Scheduled • 1 Pending</span>
              </div>

            </div>

            {/* AI Banner for Faculty */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2 text-purple-200 text-xs font-semibold">
                  <Sparkles className="w-4 h-4 text-purple-300" />
                  AI Class Performance Synthesis Available
                </div>
                <h3 className="text-lg font-bold">
                  Class 10-A shows high quantitative mastery. Targeted remedial practice suggested for English grammar.
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('ai_class')}
                className="px-4 py-2.5 bg-white text-purple-950 hover:bg-purple-50 text-xs font-bold rounded-xl transition-colors shrink-0 shadow-sm"
              >
                Open Class Analytics
              </button>
            </div>

            {/* Two Column Section: Quick Attendance Register + Student Roster */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Daily Attendance Card */}
              <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Today's Attendance Status</h4>
                    <p className="text-xs text-slate-500">Quick view for {attendanceDate}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Open Full Register →
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {students.map(s => {
                    const status = dailyAttendanceState[s.id] || 'present';
                    return (
                      <div key={s.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <img src={s.profilePhoto} alt={s.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <p className="font-bold text-slate-900">{s.name}</p>
                            <span className="text-[10px] text-slate-400">Roll: {s.rollNumber}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                          status === 'present' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : status === 'late'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Class Recent Notices & Actions */}
              <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Class Notices & Circulars</h4>
                    <p className="text-xs text-slate-500">Broadcasts visible to Class 10-A</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('notices')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Post New Circular →
                  </button>
                </div>

                <div className="space-y-3">
                  {notices.slice(0, 3).map(n => (
                    <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800">{n.title}</span>
                        <span className="text-slate-400">{n.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1">{n.description}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 2: DAILY ATTENDANCE REGISTER */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Daily Attendance Register</h3>
                  <p className="text-xs text-slate-500">Record and synchronize daily presence for Class 10-A</p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={e => setAttendanceDate(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl"
                  />
                  <button
                    id="mark-all-present-btn"
                    onClick={handleMarkAllPresent}
                    className="px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors"
                  >
                    Mark All Present
                  </button>
                  <button
                    id="save-attendance-btn"
                    onClick={handleSaveAttendance}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
                  >
                    Save & Publish
                  </button>
                </div>
              </div>

              {attendanceSaveMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{attendanceSaveMsg}</span>
                </div>
              )}

              {/* Attendance Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                      <th className="py-2.5">Roll No</th>
                      <th className="py-2.5">Student</th>
                      <th className="py-2.5 text-center">Status Action</th>
                      <th className="py-2.5 text-right">Term Record</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map(s => {
                      const currentStatus = dailyAttendanceState[s.id] || 'present';
                      return (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="py-3 font-semibold text-slate-500">{s.rollNumber}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2.5">
                              <img src={s.profilePhoto} alt={s.name} className="w-8 h-8 rounded-lg object-cover" />
                              <div>
                                <p className="font-bold text-slate-900">{s.name}</p>
                                <span className="text-[10px] text-slate-400">{s.parentName}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setDailyAttendanceState({ ...dailyAttendanceState, [s.id]: 'present' })}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                  currentStatus === 'present'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                Present
                              </button>
                              <button
                                onClick={() => setDailyAttendanceState({ ...dailyAttendanceState, [s.id]: 'late' })}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                  currentStatus === 'late'
                                    ? 'bg-amber-500 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                Late
                              </button>
                              <button
                                onClick={() => setDailyAttendanceState({ ...dailyAttendanceState, [s.id]: 'absent' })}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                  currentStatus === 'absent'
                                    ? 'bg-rose-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                Absent
                              </button>
                            </div>
                          </td>
                          <td className="py-3 text-right font-medium text-slate-600">
                            {s.attendanceRate ?? 90}% Overall
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 3: STUDENT DIRECTORY */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'students' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-slate-900">Class 10-A Student Directory</h3>
                    
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {students.length} total enrolled students 
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative w-full sm:w-56">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search student or roll..."
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Add Student Button */}
                  <button
                    id="add-student-firestore-btn"
                    onClick={() => {
                      setStudentSuccessMsg('');
                      setAddStudentModalOpen(true);
                    }}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Student</span>
                  </button>
                </div>
              </div>

              {/* Student Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStudents.map(student => {
                  const isFromFirestore = firestoreStudentIds.includes(student.id);
                  return (
                    <div 
                      key={student.id} 
                      className={`p-5 rounded-xl border transition-all space-y-4 ${
                        isFromFirestore 
                          ? 'border-indigo-300 bg-indigo-50/20 shadow-xs ring-1 ring-indigo-200' 
                          : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <img 
                          src={student.profilePhoto} 
                          alt={student.name} 
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-900 truncate">{student.name}</h4>
                            
                          </div>
                          <p className="text-xs text-slate-500">Roll: {student.rollNumber} • {student.class}-{student.section}</p>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            (student.attendanceRate ?? 90) >= 85 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            Attendance: {student.attendanceRate ?? 90}%
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                        <p><strong>Parent:</strong> {student.parentName}</p>
                        <p><strong>Contact:</strong> {student.parentPhone}</p>
                        <p><strong>Address:</strong> {student.address}</p>
                      </div>

                      <button
                        onClick={() => setSelectedStudentForModal(student)}
                        className="w-full py-2 bg-slate-50 hover:bg-indigo-50 text-indigo-700 hover:text-indigo-800 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Performance Details
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 4: EXAM MARKS MANAGER */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'marks' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Examination Marks Manager</h3>
                  <p className="text-xs text-slate-500">Enter and compute subject marks, percentages, and letter grades</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={selectedExamId}
                    onChange={e => setSelectedExamId(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl"
                  >
                    <option value="exam-1">Term 1 (Mid-Term)</option>
                    <option value="exam-2">Term 2 (Pre-Board)</option>
                  </select>

                  <select
                    value={selectedSubject}
                    onChange={e => setSelectedSubject(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Social Science">Social Science</option>
                  </select>

                  <button
                    id="save-marks-btn"
                    onClick={handleSaveMarks}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
                  >
                    Save & Recalculate
                  </button>
                </div>
              </div>

              {marksSaveMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{marksSaveMsg}</span>
                </div>
              )}

              {/* Marks Entry Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                      <th className="py-2.5">Roll No</th>
                      <th className="py-2.5">Student</th>
                      <th className="py-2.5">Max Marks</th>
                      <th className="py-2.5">Marks Obtained</th>
                      <th className="py-2.5">Calculated %</th>
                      <th className="py-2.5 text-right">Assigned Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map(s => {
                      const currentScore = marksDraft[s.id] ?? 80;
                      const pct = Math.round((currentScore / 100) * 100);
                      const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';

                      return (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="py-3 font-semibold text-slate-500">{s.rollNumber}</td>
                          <td className="py-3 font-bold text-slate-900">{s.name}</td>
                          <td className="py-3 text-slate-500">100</td>
                          <td className="py-3">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={currentScore}
                              onChange={e => setMarksDraft({ ...marksDraft, [s.id]: Number(e.target.value) })}
                              className="w-20 px-2 py-1 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                            />
                          </td>
                          <td className="py-3 font-semibold text-slate-800">{pct}%</td>
                          <td className="py-3 text-right">
                            <span className="px-2.5 py-0.5 rounded font-bold text-xs bg-indigo-50 text-indigo-700">
                              {grade}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 5: AI CLASS PERFORMANCE ANALYTICS */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'ai_class' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      AI Class 10-A Analytics
                      
                    </h3>
                    <p className="text-xs text-slate-500">Automated multi-student performance assessment and curricular recommendations</p>
                  </div>
                </div>

                <button
                  id="regenerate-class-ai-btn"
                  onClick={fetchClassAiInsights}
                  disabled={loadingClassAi}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingClassAi ? 'animate-spin' : ''}`} />
                  {loadingClassAi ? 'Synthesizing...' : 'Regenerate Analysis'}
                </button>
              </div>

              {/* Class Summary */}
              <div className="p-5 rounded-xl bg-purple-50/70 border border-purple-100 space-y-2">
                <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" /> Executive Class Summary
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {aiClassInsight?.observations?.join(' ') ||
                    "Class 10-A exhibits solid overall academic engagement with an 81.6% average in Pre-Board examinations. Mathematics and Science show consistent strength across 80% of students. English grammar scores demonstrate variance, indicating need for targeted revision."
                  }
                </p>
              </div>

              {/* High Performers vs Support Needed */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> High Performing Students
                  </h4>
                  <div className="space-y-1.5">
                    {(aiClassInsight?.topPerformers || ['Aarav Sharma (87.2%)', 'Rohan Gupta (88.4%)']).map((name: string) => (
                      <div key={name} className="p-2.5 rounded-lg bg-white border border-emerald-100 text-xs font-semibold text-emerald-800">
                        {name}
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-emerald-700/80">
                    Recommended for advanced competitive Olympiad coaching and peer mentorship roles.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" /> Students Needing Remedial Focus
                  </h4>
                  <div className="space-y-1.5">
                    {(aiClassInsight?.studentsNeedingSupport || ['Ananya Patel (English & Attendance 82%)', 'Priya Nair (Math revision 65%)']).map((name: string) => (
                      <div key={name} className="p-2.5 rounded-lg bg-white border border-amber-100 text-xs font-semibold text-amber-800">
                        {name}
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-amber-700/80">
                    Recommended for after-school zero-period tutoring and bi-weekly practice worksheets.
                  </p>
                </div>

              </div>

              {/* Curricular Recommendations */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Teacher Pedagogical Action Items
                </h4>
                <div className="space-y-2">
                  {(aiClassInsight?.teacherRecommendations || [
                    'Schedule 15-minute daily formative writing drills in English prior to Board exams',
                    'Acknowledge improved attendance among students currently crossing the 85% threshold',
                    'Conduct interactive peer-group problem solving in Physics electricity numericals'
                  ]).map((item: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 6: NOTICE BOARD PUBLISHER */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'notices' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Publisher Form */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Broadcast Circular</h3>
                  <p className="text-xs text-slate-500">Publish urgent or standard notices to parents</p>
                </div>

                {noticePublishMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                    {noticePublishMsg}
                  </div>
                )}

                <form onSubmit={handlePublishNotice} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Title</label>
                    <input
                      type="text"
                      required
                      value={newNotice.title}
                      onChange={e => setNewNotice({ ...newNotice, title: e.target.value })}
                      placeholder="e.g. Science Exhibition Participation Details"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                      <select
                        value={newNotice.priority}
                        onChange={e => setNewNotice({ ...newNotice, priority: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                      >
                        <option value="normal">Normal</option>
                        <option value="important">Important</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Target Class</label>
                      <select
                        value={newNotice.targetClass}
                        onChange={e => setNewNotice({ ...newNotice, targetClass: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                      >
                        <option value="Class 10-A">Class 10-A</option>
                        <option value="All Classes">All Classes</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Circular Content</label>
                    <textarea
                      rows={4}
                      required
                      value={newNotice.description}
                      onChange={e => setNewNotice({ ...newNotice, description: e.target.value })}
                      placeholder="Provide complete guidelines, dates, and instructions for parents..."
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Publish to Notice Board
                  </button>
                </form>
              </div>

              {/* Published Notices List */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Active Published Circulars</h3>
                  <p className="text-xs text-slate-500">Currently visible on parent portal</p>
                </div>

                <div className="space-y-3">
                  {notices.map(n => (
                    <div key={n.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            n.priority === 'urgent' 
                              ? 'bg-rose-100 text-rose-700' 
                              : n.priority === 'important'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {n.priority}
                          </span>
                          <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            {n.targetClass}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">{n.date}</span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                      <p className="text-xs text-slate-600">{n.description}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 7: PTM SCHEDULE & APPROVALS */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'ptm' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Parent-Teacher Meeting (PTM) Desk</h3>
                <p className="text-xs text-slate-500">Review, schedule, and approve parent consultation requests</p>
              </div>

              <div className="space-y-4">
                {meetings.map(m => (
                  <div key={m.id} className="p-5 rounded-xl border border-slate-200 bg-white space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                          m.status === 'scheduled'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : m.status === 'completed'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {m.status}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{m.studentName}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg">
                        {m.date} • {m.time}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      <p>Parent: <strong>{m.parentName}</strong></p>
                      <p>Venue: <strong>{m.location}</strong></p>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <strong>Discussion Agenda:</strong> {m.purpose}
                    </p>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      {m.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateMeetingStatus(m.id, 'scheduled')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Confirm Slot
                        </button>
                      )}
                      {m.status === 'scheduled' && (
                        <button
                          onClick={() => handleUpdateMeetingStatus(m.id, 'completed')}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 8: HOMEWORK & TASKS */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'assignments' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Create Assignment */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Assign Homework / Project</h3>
                  <p className="text-xs text-slate-500">Post tasks with deadlines to student schedule</p>
                </div>

                {assignmentPublishMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                    {assignmentPublishMsg}
                  </div>
                )}

                <form onSubmit={handlePublishAssignment} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={newAssignment.title}
                      onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })}
                      placeholder="e.g. Quadratic Equations Exercise 4.3"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                      <select
                        value={newAssignment.subject}
                        onChange={e => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                      >
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science</option>
                        <option value="English">English</option>
                        <option value="Computer Science">Computer Science</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                      <input
                        type="date"
                        required
                        value={newAssignment.dueDate}
                        onChange={e => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Instructions</label>
                    <textarea
                      rows={3}
                      value={newAssignment.description}
                      onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })}
                      placeholder="Specific exercises, formatting instructions or references..."
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
                  >
                    Post Assignment
                  </button>
                </form>
              </div>

              {/* Assignment List */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Current Assigned Tasks</h3>
                  <p className="text-xs text-slate-500">Track student submission deadlines</p>
                </div>

                <div className="space-y-3">
                  {assignments.map(asg => (
                    <div key={asg.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{asg.title}</span>
                        <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                          Due: {asg.deadline}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-700 font-medium">{asg.subject} • Class 10-A</p>
                      <p className="text-xs text-slate-600">{asg.description}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Student Details Modal */}
      {selectedStudentForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">Student Profile & Performance Record</h4>
              <button 
                onClick={() => setSelectedStudentForModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3.5">
              <img 
                src={selectedStudentForModal.profilePhoto} 
                alt={selectedStudentForModal.name} 
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedStudentForModal.name}</h3>
                <p className="text-xs text-slate-500">Roll: {selectedStudentForModal.rollNumber} • {selectedStudentForModal.class}-{selectedStudentForModal.section}</p>
                <p className="text-xs text-emerald-700 font-semibold mt-0.5">Overall Attendance: {selectedStudentForModal.attendanceRate ?? 90}%</p>
              </div>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p><strong>Parent Name:</strong> {selectedStudentForModal.parentName}</p>
              <p><strong>Emergency Phone:</strong> {selectedStudentForModal.parentPhone}</p>
              <p><strong>Residential Address:</strong> {selectedStudentForModal.address ?? '12A, Knowledge Park, New Delhi'}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStudentForModal(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Student to Firestore Modal */}
      {addStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Enroll New Student</h4>
                <p className="text-[11px] text-slate-500">Saves directly into your Firebase Firestore collection</p>
              </div>
              <button 
                onClick={() => setAddStudentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {studentSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{studentSuccessMsg}</span>
              </div>
            )}

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newStudentForm.name.trim()) return;
                setSavingStudent(true);
                const res = await createStudentInFirestore({
                  name: newStudentForm.name.trim(),
                  rollNumber: newStudentForm.rollNumber.trim() || `10A-${Math.floor(10 + Math.random() * 89)}`,
                  class: newStudentForm.class,
                  section: newStudentForm.section,
                  parentName: newStudentForm.parentName.trim() || 'Parent Guardian',
                  parentEmail: newStudentForm.parentEmail.trim() || 'parent@school.edu',
                  parentPhone: newStudentForm.parentPhone.trim() || '+91 98765 00000',
                  attendanceRate: Number(newStudentForm.attendanceRate) || 95,
                  gender: 'Male',
                  dob: '2010-05-15',
                  profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
                  emergencyContact: newStudentForm.parentPhone || '+91 98765 00000',
                  address: 'Smart Education Campus'
                });
                setSavingStudent(false);
                if (res.success) {
                  setStudentSuccessMsg(`Student "${newStudentForm.name}" saved to Firestore!`);
                  addNotification({
                    title: 'Student Created',
                    message: `${newStudentForm.name} saved to Firebase Firestore.`,
                    type: 'notice',
                    userId: 'all'
                  });
                  setTimeout(() => {
                    setAddStudentModalOpen(false);
                    setNewStudentForm({
                      name: '',
                      rollNumber: '',
                      class: '10',
                      section: 'A',
                      parentName: '',
                      parentEmail: '',
                      parentPhone: '',
                      attendanceRate: 95
                    });
                  }, 1000);
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohit Kumar"
                  value={newStudentForm.name}
                  onChange={e => setNewStudentForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Roll No.</label>
                  <input
                    type="text"
                    placeholder="10A-06"
                    value={newStudentForm.rollNumber}
                    onChange={e => setNewStudentForm(prev => ({ ...prev, rollNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class</label>
                  <input
                    type="text"
                    value={newStudentForm.class}
                    onChange={e => setNewStudentForm(prev => ({ ...prev, class: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Section</label>
                  <input
                    type="text"
                    value={newStudentForm.section}
                    onChange={e => setNewStudentForm(prev => ({ ...prev, section: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Parent Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Mr. Anil Kumar"
                    value={newStudentForm.parentName}
                    onChange={e => setNewStudentForm(prev => ({ ...prev, parentName: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Parent Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765..."
                    value={newStudentForm.parentPhone}
                    onChange={e => setNewStudentForm(prev => ({ ...prev, parentPhone: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddStudentModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingStudent}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-60"
                >
                  {savingStudent && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save to Firestore</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
