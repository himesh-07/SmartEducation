import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Calendar, 
  Clock, 
  Award, 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Download, 
  MessageSquare, 
  Printer, 
  RefreshCw,
  Send,
  BookOpen,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Student, MarkRecord, AttendanceRecord, Notice, Meeting, AIStudentInsight, TimetableSlot } from '../../types';
import { 
  DEMO_STUDENTS, 
  DEMO_MARKS, 
  DEMO_ATTENDANCE, 
  DEMO_NOTICES, 
  DEMO_MEETINGS, 
  DEMO_TIMETABLE, 
  DEMO_EVENTS 
} from '../../data/sampleData';

export const ParentDashboard: React.FC = () => {
  const { currentUser, currentStudent, students, switchChildStudent, firestoreStudentIds } = useAuth();
  
  // Active Tab View in Parent Portal
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'marks' | 'ai_insights' | 'notices' | 'ptm' | 'timetable' | 'feedback'>('overview');

  const student: Student = currentStudent || (students && students.length > 0 ? students[0] : DEMO_STUDENTS[0]);

  // Marks & Attendance for this student
  const studentMarks: MarkRecord[] = DEMO_MARKS.filter(m => m.studentId === student.id);
  const studentAttendance: AttendanceRecord[] = DEMO_ATTENDANCE.filter(a => a.studentId === student.id);

  // Computed metrics
  const totalDays = 181;
  const presentDays = 165;
  const absentDays = 13;
  const lateDays = 3;
  const attendanceRate = 91; // %

  // Exam computations
  const preBoardMarks = studentMarks.filter(m => m.examId === 'exam-2');
  const midTermMarks = studentMarks.filter(m => m.examId === 'exam-1');
  
  const currentTotalObtained = preBoardMarks.reduce((acc, m) => acc + m.obtainedMarks, 0);
  const currentTotalMax = preBoardMarks.reduce((acc, m) => acc + m.maxMarks, 0) || 500;
  const currentAvgPercentage = Math.round((currentTotalObtained / currentTotalMax) * 100);

  // Mid-term average for comparison
  const midTermObtained = midTermMarks.reduce((acc, m) => acc + m.obtainedMarks, 0);
  const midTermMax = midTermMarks.reduce((acc, m) => acc + m.maxMarks, 0) || 500;
  const midTermAvg = midTermMarks.length > 0 ? Math.round((midTermObtained / midTermMax) * 100) : 80;
  const improvement = currentAvgPercentage - midTermAvg;

  // AI Learning Insights State
  const [aiInsight, setAiInsight] = useState<AIStudentInsight | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // PTM State
  const [meetings, setMeetings] = useState<Meeting[]>(DEMO_MEETINGS);
  const [showPtmModal, setShowPtmModal] = useState(false);
  const [ptmForm, setPtmForm] = useState({ date: '2026-10-16', time: '11:30 AM', purpose: 'Discuss board examination preparations' });

  // Report Card Modal State
  const [showReportCard, setShowReportCard] = useState(false);

  // Feedback State
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  // Fetch or generate AI insights
  const fetchAiInsights = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/student-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: student.id })
      });
      if (res.ok) {
        const data = await res.json();
        setAiInsight(data);
      }
    } catch (err) {
      console.error('Error fetching AI insights:', err);
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchAiInsights();
  }, [student.id]);

  const handleRequestPtm = (e: React.FormEvent) => {
    e.preventDefault();
    const newMeeting: Meeting = {
      id: `mtg-${Date.now()}`,
      teacherId: 'u-teacher-1',
      teacherName: 'Mrs. Priya Sharma',
      parentId: currentUser?.id || 'u-parent-1',
      parentName: currentUser?.name || 'Parent',
      studentId: student.id,
      studentName: student.name,
      date: ptmForm.date,
      time: ptmForm.time,
      subject: 'Parent Consultation',
      location: 'School Auditorium - Desk 04',
      purpose: ptmForm.purpose,
      status: 'pending'
    };
    setMeetings([newMeeting, ...meetings]);
    setShowPtmModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      
      {/* Top Student Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Student identity */}
            <div className="flex items-center gap-4">
              <img
                src={student.profilePhoto}
                alt={student.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900">{student.name}</h1>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Enrolled
                  </span>
                  {firestoreStudentIds.includes(student.id) && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                      
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Class {student.class}-{student.section} • Roll No: {student.rollNumber} • Mentor: Mrs. Priya Sharma
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Parent: {student.parentName} ({student.parentPhone})
                </p>
                {students && students.length > 1 && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-medium">Select Student:</span>
                    <select
                      id="parent-select-student-dropdown"
                      value={student.id}
                      onChange={(e) => switchChildStudent(e.target.value)}
                      className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} (Roll: {s.rollNumber}) {firestoreStudentIds.includes(s.id) ? '• [Firestore]' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Pills */}
            <div className="flex items-center gap-2.5">
              <button
                id="view-digital-report-card-btn"
                onClick={() => setShowReportCard(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200 transition-colors flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" /> Digital Report Card
              </button>
              <button
                id="request-ptm-header-btn"
                onClick={() => setShowPtmModal(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" /> Book PTM Slot
              </button>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pt-6 border-t border-slate-100 mt-6 scrollbar-none text-xs font-semibold">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'attendance', label: 'Attendance (91%)' },
              { id: 'marks', label: 'Exam Marks & Grades' },
              { id: 'ai_insights', label: 'AI Learning Insights', highlight: true },
              { id: 'notices', label: 'School Notices' },
              { id: 'ptm', label: 'Parent-Teacher Meeting' },
              { id: 'timetable', label: 'Timetable & Events' },
              { id: 'feedback', label: 'Teacher Feedback' }
            ].map(tab => (
              <button
                key={tab.id}
                id={`parent-tab-${tab.id}`}
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

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 1: OVERVIEW */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Top 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Attendance */}
              <div 
                onClick={() => setActiveTab('attendance')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Overall Attendance</span>
                  <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
                    <Clock className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900">{attendanceRate}%</span>
                  <span className="text-xs text-emerald-600 font-semibold">165 Present</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${attendanceRate}%` }}></div>
                </div>
                <span className="text-[11px] text-slate-400 mt-2 block">13 Absent • 3 Late Days</span>
              </div>

              {/* Card 2: Academic Average */}
              <div 
                onClick={() => setActiveTab('marks')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Latest Exam Average</span>
                  <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform">
                    <Award className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900">{currentAvgPercentage}%</span>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +{improvement}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-3">Pre-Board Score: {currentTotalObtained}/{currentTotalMax}</p>
                <span className="text-[11px] text-indigo-600 font-medium mt-1 block">Grade: A+ (Honors)</span>
              </div>

              {/* Card 3: Next PTM */}
              <div 
                onClick={() => setActiveTab('ptm')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Upcoming PTM</span>
                  <span className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-105 transition-transform">
                    <Calendar className="w-4 h-4" />
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900 mt-2">15 October 2026</p>
                <p className="text-xs text-purple-700 font-medium">10:30 AM – 10:45 AM</p>
                <span className="text-[11px] text-slate-500 mt-3 block">Venue: Auditorium Desk 04</span>
                <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider block mt-0.5">Status: Confirmed</span>
              </div>

              {/* Card 4: Urgent Notice */}
              <div 
                onClick={() => setActiveTab('notices')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>School Notice</span>
                  <span className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
                    <FileText className="w-4 h-4" />
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 mt-2 truncate">Parent-Teacher Meeting (Term 2)</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">Mandatory briefing for board exam preparation schedule.</p>
                <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider mt-2 block">Priority: Urgent</span>
              </div>

            </div>

            {/* AI Insight Teaser Banner */}
            <div className="bg-gradient-to-br from-indigo-900 to-purple-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                  AI Educational Insight for {student.name}
                </div>
                <h3 className="text-xl font-bold tracking-tight">
                  Strong grasp in Science & Mathematics; targeted support suggested for English.
                </h3>
                <p className="text-xs text-indigo-100/80 max-w-3xl leading-relaxed">
                  {aiInsight?.detailedObservation || 
                    "Aarav demonstrates high aptitude in quantitative subjects. His Computer Science score (98%) and Math score (89%) show steady mastery. English descriptive answers have opportunities for reinforcement."
                  }
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    id="open-ai-insights-from-banner"
                    onClick={() => setActiveTab('ai_insights')}
                    className="px-4 py-2 bg-white text-indigo-950 hover:bg-indigo-50 font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    View Complete AI Learning Profile <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Two-Column Grid: Latest Marks Snapshot + Today's Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Subject Marks Table */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Pre-Board Examination Marks</h4>
                    <p className="text-xs text-slate-500">Term 2 Academic Performance</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('marks')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    All Exams <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5">Subject</th>
                        <th className="py-2.5">Marks Obtained</th>
                        <th className="py-2.5">Percentage</th>
                        <th className="py-2.5 text-right">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {preBoardMarks.map(m => {
                        const pct = (m.obtainedMarks / m.maxMarks) * 100;
                        return (
                          <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2.5 font-semibold text-slate-800">{m.subject}</td>
                            <td className="py-2.5 text-slate-600">{m.obtainedMarks} / {m.maxMarks}</td>
                            <td className="py-2.5">
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      pct >= 85 ? 'bg-emerald-500' : pct >= 75 ? 'bg-indigo-500' : 'bg-amber-500'
                                    }`}
                                    style={{ width: `${pct}%` }}
                                  ></div>
                                </div>
                                <span className="text-slate-700 font-medium">{pct}%</span>
                              </div>
                            </td>
                            <td className="py-2.5 text-right">
                              <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                                m.grade.includes('A') 
                                  ? 'bg-emerald-50 text-emerald-700' 
                                  : m.grade.includes('B') 
                                  ? 'bg-indigo-50 text-indigo-700' 
                                  : 'bg-amber-50 text-amber-700'
                              }`}>
                                {m.grade}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right: Upcoming Events & Notices */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* School Circulars Card */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">Latest Circulars</h4>
                    <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      Class 10-A
                    </span>
                  </div>

                  <div className="space-y-3">
                    {DEMO_NOTICES.slice(0, 2).map(notice => (
                      <div key={notice.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            notice.priority === 'urgent' 
                              ? 'bg-rose-100 text-rose-700' 
                              : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {notice.priority}
                          </span>
                          <span className="text-[10px] text-slate-400">{notice.date}</span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-800">{notice.title}</h5>
                        <p className="text-xs text-slate-600 line-clamp-2">{notice.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next School Events */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Academic Calendar</h4>
                  <div className="space-y-2.5">
                    {DEMO_EVENTS.map(evt => (
                      <div key={evt.id} className="flex items-start gap-3 text-xs">
                        <div className="w-12 py-1.5 rounded-lg bg-slate-100 text-center shrink-0">
                          <span className="text-[10px] font-bold uppercase text-slate-500 block">
                            {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                          </span>
                          <span className="text-sm font-extrabold text-slate-800 leading-none">
                            {new Date(evt.date).getDate()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{evt.title}</p>
                          <p className="text-[11px] text-slate-500">{evt.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 2: ATTENDANCE DETAILED BREAKDOWN */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Attendance Tracker</h3>
                  <p className="text-xs text-slate-500">Comprehensive attendance breakdown for Academic Session 2026-27</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Compliant with CBSE 75% Mandate
                  </span>
                </div>
              </div>

              {/* Attendance Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs text-slate-500">Total School Days</span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalDays}</p>
                  <span className="text-[11px] text-slate-400">Recorded to date</span>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <span className="text-xs text-emerald-700 font-semibold">Present Days</span>
                  <p className="text-2xl font-extrabold text-emerald-700 mt-1">{presentDays}</p>
                  <span className="text-[11px] text-emerald-600 font-medium">91.1% of total days</span>
                </div>
                <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100">
                  <span className="text-xs text-rose-700 font-semibold">Absent Days</span>
                  <p className="text-2xl font-extrabold text-rose-700 mt-1">{absentDays}</p>
                  <span className="text-[11px] text-rose-600 font-medium">Medical / Excused</span>
                </div>
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                  <span className="text-xs text-amber-700 font-semibold">Late Days</span>
                  <p className="text-2xl font-extrabold text-amber-700 mt-1">{lateDays}</p>
                  <span className="text-[11px] text-amber-600 font-medium">Recorded tardiness</span>
                </div>
              </div>

              {/* Monthly Attendance Progress */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Monthly Attendance Performance
                </h4>
                <div className="space-y-3">
                  {[
                    { month: 'September 2026', rate: 94, present: 19, total: 20 },
                    { month: 'August 2026', rate: 91, present: 22, total: 24 },
                    { month: 'July 2026', rate: 88, present: 21, total: 24 },
                    { month: 'June 2026', rate: 92, present: 23, total: 25 },
                    { month: 'May 2026', rate: 95, present: 20, total: 21 }
                  ].map(m => (
                    <div key={m.month} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">{m.month}</span>
                        <span className="text-slate-500 font-medium">{m.rate}% ({m.present}/{m.total} Days)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all"
                          style={{ width: `${m.rate}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Daily Logs Table */}
              <div className="pt-8 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Recent Daily Attendance Log
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                        <th className="py-2">Date</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Marked By</th>
                        <th className="py-2">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentAttendance.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="py-2.5 font-medium text-slate-800">{log.date}</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                              log.status === 'present'
                                ? 'bg-emerald-50 text-emerald-700'
                                : log.status === 'late'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-600">{log.markedBy}</td>
                          <td className="py-2.5 text-slate-500">{log.remarks || 'Regular schedule'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 3: EXAM MARKS & PERFORMANCE COMPARISON */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'marks' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Academic Examination Records</h3>
                  <p className="text-xs text-slate-500">Term 1 (Mid-Term) vs. Term 2 (Pre-Board) Progression</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> Overall Trend: +{improvement}% Growth
                  </span>
                </div>
              </div>

              {/* Subject by Subject Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                      <th className="py-2.5">Subject</th>
                      <th className="py-2.5">Mid-Term (Term 1)</th>
                      <th className="py-2.5">Pre-Board (Term 2)</th>
                      <th className="py-2.5">Difference</th>
                      <th className="py-2.5 text-right">Term 2 Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { subject: 'Mathematics', term1: 82, term2: 89, grade: 'A+' },
                      { subject: 'Science', term1: 88, term2: 91, grade: 'A+' },
                      { subject: 'English', term1: 76, term2: 74, grade: 'B' },
                      { subject: 'Computer Science', term1: 94, term2: 98, grade: 'A+' },
                      { subject: 'Social Science', term1: 79, term2: 84, grade: 'A' }
                    ].map(row => {
                      const diff = row.term2 - row.term1;
                      return (
                        <tr key={row.subject} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 font-bold text-slate-800">{row.subject}</td>
                          <td className="py-3 text-slate-600">{row.term1} / 100</td>
                          <td className="py-3 font-semibold text-slate-900">{row.term2} / 100</td>
                          <td className="py-3">
                            <span className={`inline-flex items-center text-xs font-bold ${
                              diff >= 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}>
                              {diff >= 0 ? `+${diff}%` : `${diff}%`}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <span className="px-2.5 py-0.5 rounded font-bold text-xs bg-indigo-50 text-indigo-700">
                              {row.grade}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Educational Context Note */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block mb-0.5">Continuous Assessment Framework</strong>
                  Internal assessment grading adheres to the central secondary education board structure. 
                  Final board exam eligibility requires maintaining a minimum 75% attendance and passing scores across all mandatory subject streams.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 4: AI STUDENT LEARNING INSIGHTS */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'ai_insights' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              
              {/* Header with Refresh button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      AI Learning Insights
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                        Educational Analytics
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Automated pedagogical synthesis based on attendance, subject trends, and exam delta
                    </p>
                  </div>
                </div>

                <button
                  id="refresh-ai-insights-btn"
                  onClick={fetchAiInsights}
                  disabled={loadingAi}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingAi ? 'animate-spin' : ''}`} />
                  {loadingAi ? 'Synthesizing...' : 'Regenerate Analysis'}
                </button>
              </div>

              {/* Two Column Grid: Strengths & Attention */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Strong Subjects Card */}
                <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Demonstrated Academic Strengths</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(aiInsight?.strongSubjects || ['Science', 'Mathematics', 'Computer Science']).map(sub => (
                      <span key={sub} className="px-3 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-800 font-semibold text-xs shadow-xs">
                        {sub}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-emerald-900/80 leading-relaxed">
                    Consistent scores above 88% reflect conceptual clarity, independent problem-solving ability, and active participation in laboratory sessions.
                  </p>
                </div>

                {/* Focus Needed Card */}
                <div className="p-5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Areas for Practice & Reinforcement</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(aiInsight?.subjectsNeedingAttention || ['English Literature & Grammar']).map(sub => (
                      <span key={sub} className="px-3 py-1 rounded-lg bg-white border border-amber-200 text-amber-800 font-semibold text-xs shadow-xs">
                        {sub}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-amber-900/80 leading-relaxed">
                    Recent term examinations show a -2% dip in descriptive English sections. Dedicated focus on creative composition and grammatical rules is recommended.
                  </p>
                </div>

              </div>

              {/* Detailed AI Observation Paragraph */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Pedagogical Summary for Parents
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {aiInsight?.detailedObservation || 
                    `${student.name} demonstrates exemplary aptitude in quantitative and technical subjects, showing consistent high marks in Mathematics (89%) and Computer Science (98%). English scores reflect opportunities for vocabulary enhancement and regular creative writing practice.`
                  }
                </p>
              </div>

              {/* Suggested Study Techniques */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Recommended Home Study Habits
                </h4>
                <div className="space-y-2">
                  {(aiInsight?.suggestedFocus || [
                    'Focus on English grammar rules and reading comprehension practice 20 minutes daily',
                    'Maintain strong analytical problem-solving in Computer Science & Mathematics',
                    'Create structured revision flashcards for Science terminology before upcoming assessments'
                  ]).map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ethical Disclaimer */}
              <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 text-center">
                * Note: AI Learning Insights provide educational suggestions based solely on recorded scores and attendance data. No behavioral or psychological profiling is conducted.
              </div>

            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 5: SCHOOL NOTICES */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'notices' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Official Circulars & Notice Board</h3>
                  <p className="text-xs text-slate-500">Notices published by Principal Office and Class 10 Faculty</p>
                </div>
              </div>

              <div className="space-y-4">
                {DEMO_NOTICES.map(notice => (
                  <div key={notice.id} className="p-5 rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors bg-white space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          notice.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-700'
                            : notice.priority === 'important'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {notice.priority}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                          {notice.targetClass}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{notice.date}</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{notice.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notice.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <span>Issued by: <strong>{notice.createdBy}</strong></span>
                      {notice.attachmentName && (
                        <button 
                          onClick={() => alert(`Downloading ${notice.attachmentName}...`)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" /> {notice.attachmentName}
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
        {/* VIEW 6: PARENT TEACHER MEETINGS (PTM) */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'ptm' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Parent-Teacher Meeting (PTM) Portal</h3>
                  <p className="text-xs text-slate-500">Scheduled consultations and consultation requests with teachers</p>
                </div>
                <button
                  id="book-new-ptm-btn"
                  onClick={() => setShowPtmModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" /> Request Meeting Slot
                </button>
              </div>

              <div className="space-y-4">
                {meetings.map(m => (
                  <div key={m.id} className="p-5 rounded-xl border border-slate-200 bg-white space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                          m.status === 'scheduled'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {m.status}
                        </span>
                        <span className="text-xs font-semibold text-slate-800">{m.subject}</span>
                      </div>
                      <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                        {m.date} • {m.time}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      <p>Teacher: <strong>{m.teacherName}</strong> (Class Mentor)</p>
                      <p>Location: <strong>{m.location}</strong></p>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <strong>Purpose:</strong> {m.purpose}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 7: TIMETABLE & EVENTS */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'timetable' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Class 10-A Weekly Timetable</h3>
                <p className="text-xs text-slate-500">Daily subject periods, mentors, and assigned classrooms</p>
              </div>

              <div className="space-y-6">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => {
                  const slots = DEMO_TIMETABLE.filter(s => s.day === day);
                  if (slots.length === 0) return null;
                  return (
                    <div key={day} className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span> {day}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {slots.map(slot => (
                          <div key={slot.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                            <span className="text-[10px] font-semibold text-indigo-600 block">{slot.time}</span>
                            <p className="font-bold text-slate-800 mt-0.5">{slot.subject}</p>
                            <p className="text-[11px] text-slate-500">{slot.teacherName} • {slot.room}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* VIEW 8: FEEDBACK */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'feedback' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Submit Feedback to School & Mentor</h3>
                <p className="text-xs text-slate-500">
                  Share observations or send a direct note to Mrs. Priya Sharma regarding {student.name}'s academic routine.
                </p>
              </div>

              {feedbackSent ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-sm font-bold text-emerald-800">Feedback Dispatched to Mentor</p>
                  <p className="text-xs text-emerald-700">Thank you for collaborating in your child's education.</p>
                </div>
              ) : (
                <form 
                  onSubmit={e => {
                    e.preventDefault();
                    if (!feedbackText.trim()) return;
                    setFeedbackSent(true);
                    setTimeout(() => {
                      setFeedbackSent(false);
                      setFeedbackText('');
                    }, 4000);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Feedback / Note</label>
                    <textarea
                      rows={4}
                      required
                      value={feedbackText}
                      onChange={e => setFeedbackText(e.target.value)}
                      placeholder="e.g. We have started 30 mins daily English grammar reading at home as suggested by the AI insight report..."
                      className="w-full p-3 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit to Class Mentor
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Request PTM Modal */}
      {showPtmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" /> Request PTM Slot
              </h4>
              <button 
                onClick={() => setShowPtmModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestPtm} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Date</label>
                <input
                  type="date"
                  required
                  value={ptmForm.date}
                  onChange={e => setPtmForm({ ...ptmForm, date: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Time Slot</label>
                <select
                  value={ptmForm.time}
                  onChange={e => setPtmForm({ ...ptmForm, time: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                >
                  <option value="10:00 AM - 10:15 AM">10:00 AM - 10:15 AM</option>
                  <option value="10:30 AM - 10:45 AM">10:30 AM - 10:45 AM</option>
                  <option value="11:00 AM - 11:15 AM">11:00 AM - 11:15 AM</option>
                  <option value="11:30 AM - 11:45 AM">11:30 AM - 11:45 AM</option>
                  <option value="02:00 PM - 02:15 PM">02:00 PM - 02:15 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Agenda / Reason for Discussion</label>
                <textarea
                  rows={3}
                  required
                  value={ptmForm.purpose}
                  onChange={e => setPtmForm({ ...ptmForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPtmModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
                >
                  Confirm Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital Report Card Modal (Printable) */}
      {showReportCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 space-y-6 relative my-8">
            
            <button
              onClick={() => setShowReportCard(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official Report Card Header */}
            <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
              <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                Smart International Academy
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Affiliated with Central Board of Secondary Education • Academic Session 2026–2027
              </p>
              <span className="inline-block px-3 py-0.5 rounded-full bg-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-800 mt-1">
                Official Digital Academic Transcript
              </span>
            </div>

            {/* Student Meta Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Student Name</span>
                <p className="font-bold text-slate-900">{student.name}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Roll Number</span>
                <p className="font-bold text-slate-900">{student.rollNumber}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Class & Section</span>
                <p className="font-bold text-slate-900">{student.class}-{student.section}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Attendance</span>
                <p className="font-bold text-emerald-700">{attendanceRate}% (165/181)</p>
              </div>
            </div>

            {/* Marks Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5 border-b border-slate-200">Subject</th>
                    <th className="p-2.5 border-b border-slate-200">Max Marks</th>
                    <th className="p-2.5 border-b border-slate-200">Obtained</th>
                    <th className="p-2.5 border-b border-slate-200">Percentage</th>
                    <th className="p-2.5 border-b border-slate-200 text-right">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {preBoardMarks.map(m => (
                    <tr key={m.id}>
                      <td className="p-2.5 font-semibold text-slate-900">{m.subject}</td>
                      <td className="p-2.5 text-slate-600">{m.maxMarks}</td>
                      <td className="p-2.5 font-bold text-slate-800">{m.obtainedMarks}</td>
                      <td className="p-2.5 text-slate-700">{(m.obtainedMarks / m.maxMarks) * 100}%</td>
                      <td className="p-2.5 font-bold text-indigo-700 text-right">{m.grade}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-300">
                    <td className="p-2.5">Total & Average</td>
                    <td className="p-2.5">{currentTotalMax}</td>
                    <td className="p-2.5">{currentTotalObtained}</td>
                    <td className="p-2.5">{currentAvgPercentage}%</td>
                    <td className="p-2.5 text-right text-emerald-700 font-extrabold">A+ (Honors)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mentor Remarks */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <span className="font-bold text-slate-800">Class Teacher Remarks:</span>
              <p className="text-slate-600 leading-relaxed italic">
                "{student.name} exhibits consistent academic diligence and enthusiasm in lab work. Continued focus on English vocabulary and analytical writing will ensure top-tier board examination results."
              </p>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
              <div className="border-t border-slate-300 pt-2">
                <span className="font-semibold text-slate-800">Mrs. Priya Sharma</span>
                <p className="text-[10px]">Class Mentor</p>
              </div>
              <div className="border-t border-slate-300 pt-2">
                <span className="font-semibold text-slate-800">Dr. S. K. Mehta</span>
                <p className="text-[10px]">Principal</p>
              </div>
              <div className="border-t border-slate-300 pt-2">
                <span className="font-semibold text-slate-800">School Seal</span>
                <p className="text-[10px]">Verified Digital Copy</p>
              </div>
            </div>

            {/* Print action */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Transcript
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
