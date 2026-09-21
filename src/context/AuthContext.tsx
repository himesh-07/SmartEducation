import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Student, NotificationItem } from '../types';
import { DEMO_USERS, DEMO_STUDENTS, DEMO_NOTIFICATIONS } from '../data/sampleData';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  firebaseSignOut, 
  onAuthStateChanged,
  db
} from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { subscribeToLiveStudents } from '../lib/firestoreService';

interface AuthContextType {
  currentUser: User | null;
  currentStudent: Student | null;
  students: Student[];
  firestoreStudentIds: string[];
  notifications: NotificationItem[];
  unreadCount: number;
  login: (email: string, role?: 'teacher' | 'parent') => boolean;
  loginWithGoogle: (role: 'teacher' | 'parent') => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (role: 'teacher' | 'parent') => void;
  logout: () => void;
  markNotificationAsRead: (id: string) => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => void;
  switchChildStudent: (studentId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('smart_edu_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [currentStudent, setCurrentStudent] = useState<Student | null>(() => {
    return DEMO_STUDENTS[0]; // Default Aarav Sharma
  });

  const [students, setStudents] = useState<Student[]>(DEMO_STUDENTS);
  const [firestoreStudentIds, setFirestoreStudentIds] = useState<string[]>([]);

  const [notifications, setNotifications] = useState<NotificationItem[]>(DEMO_NOTIFICATIONS);

  // Subscribe to live Firestore students (checks both 'students' and 'student' collections)
  useEffect(() => {
    const unsubscribe = subscribeToLiveStudents((fbStudents) => {
      if (fbStudents.length > 0) {
        setFirestoreStudentIds(fbStudents.map(s => s.id));
        // Put Firestore students at the top, followed by demo students not already present
        const merged = [
          ...fbStudents,
          ...DEMO_STUDENTS.filter(d => !fbStudents.some(f => f.id === d.id || f.rollNumber === d.rollNumber))
        ];
        setStudents(merged);

        // If parent is viewing, or if student was just added, update currentStudent if needed
        setCurrentStudent(prev => {
          if (!prev) return merged[0];
          const found = merged.find(s => s.id === prev.id);
          return found || prev;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync session with localStorage & child student
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('smart_edu_user', JSON.stringify(currentUser));
      if (currentUser.role === 'parent' && currentUser.childStudentId) {
        const student = students.find(s => s.id === currentUser.childStudentId);
        if (student) setCurrentStudent(student);
      }
    } else {
      localStorage.removeItem('smart_edu_user');
    }
  }, [currentUser, students]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser && !currentUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          let assignedRole: 'teacher' | 'parent' = 'parent';
          if (snap.exists() && snap.data().role) {
            assignedRole = snap.data().role;
          }

          const restoredUser: User = {
            id: fbUser.uid,
            name: fbUser.displayName || 'Google User',
            email: fbUser.email || '',
            role: assignedRole,
            avatar: fbUser.photoURL || undefined,
            assignedClass: assignedRole === 'teacher' ? 'Class 10-A' : undefined,
            childStudentId: assignedRole === 'parent' ? DEMO_STUDENTS[0].id : undefined
          };
          setCurrentUser(restoredUser);
        } catch {
          // If Firestore is pending, restore basic user session
          const basicUser: User = {
            id: fbUser.uid,
            name: fbUser.displayName || 'Google User',
            email: fbUser.email || '',
            role: 'parent',
            avatar: fbUser.photoURL || undefined,
            childStudentId: DEMO_STUDENTS[0].id
          };
          setCurrentUser(basicUser);
        }
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const loginWithGoogle = async (role: 'teacher' | 'parent'): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      let resolvedRole = role;

      // Persist user record in Firestore
      try {
        const userDocRef = doc(db, 'users', fbUser.uid);
        const snap = await getDoc(userDocRef);
        if (snap.exists() && snap.data().role) {
          resolvedRole = snap.data().role;
        } else {
          await setDoc(userDocRef, {
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || (role === 'teacher' ? 'Teacher User' : 'Parent User'),
            photoURL: fbUser.photoURL || '',
            role: role,
            createdAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn('Firestore profile sync note:', err);
      }

      const googleUser: User = {
        id: fbUser.uid,
        name: fbUser.displayName || (resolvedRole === 'teacher' ? 'Teacher' : 'Parent'),
        email: fbUser.email || `${resolvedRole}@school.edu`,
        role: resolvedRole,
        avatar: fbUser.photoURL || undefined,
        assignedClass: resolvedRole === 'teacher' ? 'Class 10-A' : undefined,
        childStudentId: resolvedRole === 'parent' ? DEMO_STUDENTS[0].id : undefined
      };

      setCurrentUser(googleUser);
      if (resolvedRole === 'parent') {
        setCurrentStudent(DEMO_STUDENTS[0]);
      }
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign-in encountered an error.';
      console.error('Google Sign-In failed:', err);
      return { success: false, error: errorMessage };
    }
  };

  const login = (email: string, role?: 'teacher' | 'parent'): boolean => {
    const user = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (user) {
      setCurrentUser(user);
      return true;
    }
    // If not found by email, fallback by role
    if (role) {
      const roleUser = DEMO_USERS.find(u => u.role === role);
      if (roleUser) {
        setCurrentUser(roleUser);
        return true;
      }
    }
    return false;
  };

  const loginAsDemo = (role: 'teacher' | 'parent') => {
    const demoUser = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    setCurrentUser(demoUser);
    if (role === 'parent') {
      const student = DEMO_STUDENTS.find(s => s.id === demoUser.childStudentId) || DEMO_STUDENTS[0];
      setCurrentStudent(student);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Firebase signout note:', e);
    }
    setCurrentUser(null);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `ntf-${Date.now()}`,
      read: false,
      createdAt: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const switchChildStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) setCurrentStudent(student);
  };

  const unreadCount = notifications.filter(
    n => !n.read && (currentUser ? n.userId === currentUser.id || n.userId === 'all' : true)
  ).length;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentStudent,
        students,
        firestoreStudentIds,
        notifications,
        unreadCount,
        login,
        loginWithGoogle,
        loginAsDemo,
        logout,
        markNotificationAsRead,
        addNotification,
        switchChildStudent
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

