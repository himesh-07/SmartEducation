import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  Sparkles, 
  CheckCircle, 
  Calendar, 
  FileText, 
  BarChart3, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  BookOpen,
  MessageSquare,
  Award,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LandingPageProps {
  onOpenLogin: (role?: 'teacher' | 'parent') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenLogin }) => {
  const { loginAsDemo } = useAuth();
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <div id="home" className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/80 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & Call to Actions */}
            <div className="lg:col-span-7 text-left space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Next-Gen School & Academic Management</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Smarter Education. <br />
                <span className="text-indigo-600">Better Communication.</span> <br />
                Brighter Futures.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                The centralized portal bridging <strong>Teachers ↔ School ↔ Students ↔ Parents</strong>. 
                Monitor real-time attendance, track examination marks, schedule parent-teacher meetings, 
                and receive actionable AI learning insights all in one place.
              </p>

              {/* Major Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  id="hero-teacher-login-btn"
                  onClick={() => onOpenLogin('teacher')}
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2.5 group"
                >
                  <GraduationCap className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                  Teacher Login
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  id="hero-parent-login-btn"
                  onClick={() => onOpenLogin('parent')}
                  className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 transition-all flex items-center gap-2.5 group"
                >
                  <Users className="w-5 h-5 text-indigo-200 group-hover:scale-110 transition-transform" />
                  Parent Login
                  <ArrowRight className="w-4 h-4 text-indigo-200 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Instant 1-Click Sandbox Logins */}
              <div className="pt-4 border-t border-slate-200/60 max-w-md">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Instant Demo Experience (No setup needed):
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    id="hero-quick-teacher-btn"
                    onClick={() => loginAsDemo('teacher')}
                    className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 text-slate-800 rounded-lg border border-slate-200 shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
                    Enter as <strong>Teacher (Mrs. Priya)</strong>
                  </button>

                  <button
                    id="hero-quick-parent-btn"
                    onClick={() => loginAsDemo('parent')}
                    className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 text-slate-800 rounded-lg border border-slate-200 shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Enter as <strong>Parent (Aarav's Father)</strong>
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Educational System Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl bg-white p-6 shadow-xl border border-slate-200/80 space-y-4">
                
                {/* Live Preview Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live Student Snapshot</span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">Class 10-A</span>
                </div>

                {/* Student Mini Profile */}
                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <img 
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
                    alt="Student"
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-sm"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Aarav Sharma</h4>
                    <p className="text-xs text-slate-500">Roll No: 10A-01 • CBSE Curriculum</p>
                    <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Overall Attendance: 91% (165/181 Days)
                    </span>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl border border-slate-100 bg-white">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Latest Exam</span>
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <p className="text-lg font-bold text-slate-900 mt-1">87.2%</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">+8.2% from Mid-Term</span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-100 bg-white">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Next PTM</span>
                      <Calendar className="w-3.5 h-3.5 text-purple-500" />
                    </div>
                    <p className="text-xs font-bold text-slate-900 mt-1">15 Oct 2026</p>
                    <span className="text-[10px] text-purple-600 font-medium">10:30 AM (Auditorium)</span>
                  </div>
                </div>

                {/* AI Insight Teaser */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border border-indigo-100/80">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>AI Learning Observation</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    "Excelling in Mathematics (89%) and Computer Science (98%). Targeted English grammar practice recommended prior to final examinations."
                  </p>
                </div>

              </div>

              {/* Floating Decorative Pill */}
              <div className="absolute -bottom-4 -left-4 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg flex items-center gap-2 border border-slate-700 hidden sm:flex">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Data Leakage • FERPA & Privacy Compliant</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold tracking-wider text-indigo-600 uppercase">
              Unified Platform Capabilities
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Engineered for Teachers. Designed for Parents.
            </h3>
            <p className="text-sm text-slate-600">
              Every tool required to run academic workflows efficiently, foster student growth, and maintain transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1: Attendance */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">Daily Attendance Register</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Teachers mark daily attendance with instant status toggles (Present, Absent, Late). Duplicate check prevents double logging, and parents receive automated alerts.
              </p>
              <div className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1">
                <span>Monthly stats & 75% threshold alerts</span>
              </div>
            </div>

            {/* Feature 2: Exam Marks */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">Exam Marks & Analytics</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Structured marks entry with automatic percentage and letter-grade computation. Compare Mid-Term vs. Pre-Board progress with visual indicators.
              </p>
              <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <span>Grade distributions & subject comparisons</span>
              </div>
            </div>

            {/* Feature 3: AI Learning Insights */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">AI Educational Insights</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Analyzes measurable student academic data to isolate strong subjects, highlight topics needing reinforcement, and suggest targeted study routines.
              </p>
              <div className="text-[11px] font-semibold text-purple-600 flex items-center gap-1">
                <span>Objective educational observations only</span>
              </div>
            </div>

            {/* Feature 4: Notices */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">School Notice Board</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Publish school circulars with priority tags (Urgent, Important, Normal) and target classes. Parents receive instant notification badges.
              </p>
              <div className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
                <span>Targeted broadcasts & attachments</span>
              </div>
            </div>

            {/* Feature 5: PTM */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">PTM Meeting Scheduler</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Parents view scheduled consultation slots and request new one-on-one appointments. Teachers can confirm or reschedule meetings smoothly.
              </p>
              <div className="text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                <span>Room / online meeting location integration</span>
              </div>
            </div>

            {/* Feature 6: Report Card */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1.5">Digital Report Cards</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Generate clean, official digital report cards with subject marks, percentage, attendance record, and mentor educational remarks.
              </p>
              <div className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                <span>Printable & export-ready formats</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                About The SmartEdu Vision
              </span>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Designed to Modernize Education Without Administrative Burden.
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Traditional schools often struggle with fragmented communication—paper diaries get lost, 
                exam progress is revealed only at the end of the year, and parent-teacher meetings feel rushed.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Smart Education Management System establishes a continuous, transparent feedback loop. 
                Teachers spend less time on manual registers, while parents stay proactively engaged with their child's academic journey.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="border-l-2 border-indigo-600 pl-3">
                  <span className="text-xl font-bold text-slate-900 block">100%</span>
                  <span className="text-xs text-slate-500">Digital Paperless Workflows</span>
                </div>
                <div className="border-l-2 border-emerald-600 pl-3">
                  <span className="text-xl font-bold text-slate-900 block">Zero Delays</span>
                  <span className="text-xs text-slate-500">Instant Exam & Attendance Updates</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Core Educational Principles
              </h4>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Student Data Confidentiality:</strong> Strict role authorization ensures parents only access records for their own enrolled children.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Actionable AI:</strong> Insights are grounded purely in measurable scores and attendance, without arbitrary psychological labeling.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Inclusive Accessibility:</strong> Fully responsive interface that works smoothly on budget smartphones, tablets, and laptops.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Information */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Contact School Administration</span>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Need Help or Enrollment Assistance?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our academic administrative desk is available Monday through Saturday to answer questions from teachers, parents, and prospective applicants.
              </p>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>Smart Education Campus, Knowledge Park III, New Delhi 110001</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>+91 (011) 2345-6789 (Mon-Sat, 8:00 AM - 4:00 PM)</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>support@smarteducation.edu</span>
                </div>
              </div>
            </div>

            {/* Quick Query Form */}
            <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
              <h4 className="text-base font-bold text-slate-900 mb-1">Submit an Inquiry</h4>
              <p className="text-xs text-slate-500 mb-5">Parents or teachers can submit questions directly to the principal desk.</p>

              {contactSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                  <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-sm font-bold text-emerald-800">Inquiry Received Successfully</p>
                  <p className="text-xs text-emerald-700">Thank you. The academic office will respond to your registered email shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="e.g. ramesh@example.com"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Message or Query</label>
                    <textarea
                      rows={3}
                      required
                      value={contactForm.message}
                      onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Write your question regarding admissions, attendance, or academic schedule..."
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
                  >
                    Send Message <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span>Smart Education Management System</span>
          </div>
          <p className="text-slate-500 text-center sm:text-right">
            Designed for educational transparency, teacher productivity, and student success.
          </p>
        </div>
      </footer>

    </div>
  );
};
