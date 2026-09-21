import React, { useState } from 'react';
import { 
  GraduationCap, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Calendar,
  AlertCircle,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenLogin?: (role?: 'teacher' | 'parent') => void;
  onNavigateHome?: () => void;
  activeView?: string;
  onSelectView?: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenLogin, 
  onNavigateHome,
  activeView,
  onSelectView 
}) => {
  const { currentUser, currentStudent, notifications, unreadCount, logout, markNotificationAsRead } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const userNotifications = notifications.filter(
    n => !currentUser || n.userId === currentUser.id || n.userId === 'all'
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div 
            id="brand-logo"
            onClick={onNavigateHome}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                SmartEdution
              </span>
              <p className="text-xs text-slate-500 hidden sm:block">Education Management System</p>
            </div>
          </div>

          {/* Navigation Links / Dashboard Controls */}
          {currentUser ? (
            /* Logged-In User Dashboard Nav */
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Student indicator for Parent */}
              {currentUser.role === 'parent' && currentStudent && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Student: <strong className="text-slate-800 font-semibold">{currentStudent.name}</strong> ({currentStudent.class}-{currentStudent.section})</span>
                </div>
              )}

              {/* Notification Bell */}
              <div className="relative">
                <button
                  id="notifications-bell-btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Drawer */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                        <Bell className="w-4 h-4 text-indigo-600" /> Notifications
                      </h4>
                      <span className="text-xs text-slate-500">{unreadCount} unread</span>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {userNotifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-500">
                          No notifications at the moment
                        </div>
                      ) : (
                        userNotifications.map(item => (
                          <div 
                            key={item.id}
                            onClick={() => markNotificationAsRead(item.id)}
                            className={`p-3 text-left hover:bg-slate-50 cursor-pointer transition-colors flex gap-3 ${
                              !item.read ? 'bg-indigo-50/40' : ''
                            }`}
                          >
                            <div className="mt-0.5">
                              {item.type === 'notice' && <FileText className="w-4 h-4 text-amber-600" />}
                              {item.type === 'attendance' && <Clock className="w-4 h-4 text-emerald-600" />}
                              {item.type === 'exam' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                              {item.type === 'meeting' && <Calendar className="w-4 h-4 text-purple-600" />}
                              {item.type === 'alert' && <AlertCircle className="w-4 h-4 text-rose-600" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-800 truncate">{item.title}</p>
                              <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{item.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">{item.createdAt}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Pill */}
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[120px]">{currentUser.name}</p>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-600">
                      {currentUser.role}
                    </span>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                        {currentUser.designation || currentUser.role.toUpperCase()}
                      </span>
                    </div>

                    <button
                      id="logout-btn"
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Public Landing Page Nav */
            <div className="flex items-center gap-2 sm:gap-4">
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                <a href="#home" className="hover:text-indigo-600 transition-colors">Home</a>
                <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
                <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
                <a href="#contact" className="hover:text-indigo-600 transition-colors">Contact</a>
              </nav>

              <div className="flex items-center gap-2">
                <button
                  id="teacher-login-nav-btn"
                  onClick={() => onOpenLogin?.('teacher')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-500" /> Teacher Portal
                </button>
                <button
                  id="parent-login-nav-btn"
                  onClick={() => onOpenLogin?.('parent')}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-all flex items-center gap-1.5"
                >
                  Parent Portal <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
