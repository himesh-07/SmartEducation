import React, { useState } from 'react';
import { X, Lock, Mail, GraduationCap, Users, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  initialRole?: 'teacher' | 'parent';
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  initialRole = 'parent',
  onClose
}) => {
  const { login, loginWithGoogle, loginAsDemo } = useAuth();
  const [activeRole, setActiveRole] = useState<'teacher' | 'parent'>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMsg('');
    const res = await loginWithGoogle(activeRole);
    setIsGoogleLoading(false);
    if (res.success) {
      onClose();
    } else if (res.error) {
      if (res.error.includes('popup-closed-by-user')) {
        setErrorMsg('Google sign-in popup was closed.');
      } else {
        setErrorMsg(res.error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter an email address.');
      return;
    }

    const success = login(email, activeRole);
    if (success) {
      onClose();
    } else {
      setErrorMsg(`No account found for "${email}". Try one of the 1-click demo accounts below.`);
    }
  };

  const handleDemoClick = (role: 'teacher' | 'parent') => {
    loginAsDemo(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 px-6 py-5 text-white relative">
          <button
            id="close-login-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-white/10">
              <GraduationCap className="w-5 h-5 text-indigo-200" />
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase text-indigo-200">
              Secure Access Portal
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight">Smart Education System</h3>
          <p className="text-xs text-indigo-100/90 mt-1">
            Connecting Teachers, Students, and Parents seamlessly.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 m-4 rounded-xl">
          <button
            id="tab-teacher-login"
            type="button"
            onClick={() => {
              setActiveRole('teacher');
              setEmail('teacher@school.edu');
              setErrorMsg('');
            }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeRole === 'teacher'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Teacher Login
          </button>
          <button
            id="tab-parent-login"
            type="button"
            onClick={() => {
              setActiveRole('parent');
              setEmail('parent@school.edu');
              setErrorMsg('');
            }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeRole === 'parent'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" /> Parent Login
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-3.5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {errorMsg}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            id="login-google-btn"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGoogleLoading ? (
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Sign in with Google as {activeRole === 'teacher' ? 'Teacher' : 'Parent'}</span>
          </button>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold tracking-wider">Or enter credentials</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {activeRole === 'teacher' ? 'Teacher Email' : 'Parent Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="login-email-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={activeRole === 'teacher' ? 'teacher@school.edu' : 'parent@school.edu'}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <span className="text-[11px] text-slate-400">demo: password123</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="login-password-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900"
                required
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            Enter {activeRole === 'teacher' ? 'Teacher Portal' : 'Parent Portal'}
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Fillers */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center mb-2">
              Instant 1-Click Demo Logins:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="quick-demo-teacher-btn"
                type="button"
                onClick={() => handleDemoClick('teacher')}
                className="p-2 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 group-hover:text-indigo-700">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-600" /> Teacher Demo
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Mrs. Priya Sharma</p>
              </button>

              <button
                id="quick-demo-parent-btn"
                type="button"
                onClick={() => handleDemoClick('parent')}
                className="p-2 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 group-hover:text-indigo-700">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Parent Demo
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Mr. Rajesh (Aarav)</p>
              </button>
            </div>
          </div>
        </form>

        {/* Footer Security Note */}
        <div className="bg-slate-50 px-6 py-2.5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Role-based access control enabled
        </div>
      </div>
    </div>
  );
};
