import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { AttendanceRecord, Notice, Meeting, Student } from '../types';

/**
 * Normalizes any raw Firestore document (from 'students' or 'student')
 * into the strict Student TypeScript type with graceful fallbacks
 */
export function normalizeStudent(id: string, raw: Record<string, any>): Student {
  const name = raw.name || raw.studentName || raw.fullName || 'Unnamed Student';
  const rollNumber = String(raw.rollNumber || raw.roll || raw.rollNo || id.slice(-4));
  const studentClass = String(raw.class || raw.grade || raw.standard || '10');
  const section = String(raw.section || 'A');
  const parentName = raw.parentName || raw.guardianName || raw.fatherName || 'Guardian';
  const parentEmail = raw.parentEmail || raw.email || 'guardian@school.edu';
  const parentPhone = raw.parentPhone || raw.phone || raw.contact || '+91 98765 00000';
  const gender = (raw.gender === 'Female' || raw.gender === 'female') 
    ? 'Female' 
    : (raw.gender === 'Other' ? 'Other' : 'Male');
  const dob = raw.dob || raw.dateOfBirth || '2010-01-01';
  const profilePhoto = raw.profilePhoto || raw.photo || raw.photoURL || raw.avatar || 
    `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`;
  const emergencyContact = raw.emergencyContact || parentPhone;
  const bloodGroup = raw.bloodGroup || 'B+';
  const address = raw.address || 'Smart School District';
  const attendanceRate = typeof raw.attendanceRate === 'number' 
    ? raw.attendanceRate 
    : (typeof raw.attendance === 'number' ? raw.attendance : 95);

  return {
    id,
    name,
    rollNumber,
    class: studentClass,
    section,
    parentId: raw.parentId || `p_${id}`,
    parentName,
    parentEmail,
    parentPhone,
    gender,
    dob,
    profilePhoto,
    emergencyContact,
    bloodGroup,
    address,
    attendanceRate
  };
}

/**
 * FIRESTORE DATABASE SERVICE
 * Dedicated service methods for saving and synchronizing Smart Education System data.
 */

// 1. SUBSCRIBE TO LIVE STUDENTS (checks both 'students' and 'student' collections)
export function subscribeToLiveStudents(callback: (firestoreStudents: Student[]) => void) {
  const studentsMap = new Map<string, Student>();

  const updateAndNotify = () => {
    callback(Array.from(studentsMap.values()));
  };

  // Listener for 'students' collection (standard plural)
  const unsubPlural = onSnapshot(
    collection(db, 'students'),
    (snapshot) => {
      snapshot.forEach((docSnap) => {
        studentsMap.set(docSnap.id, normalizeStudent(docSnap.id, docSnap.data()));
      });
      updateAndNotify();
    },
    (err) => {
      console.warn('Could not listen to "students" collection:', err);
    }
  );

  // Listener for 'student' collection (singular)
  const unsubSingular = onSnapshot(
    collection(db, 'student'),
    (snapshot) => {
      snapshot.forEach((docSnap) => {
        studentsMap.set(docSnap.id, normalizeStudent(docSnap.id, docSnap.data()));
      });
      updateAndNotify();
    },
    (err) => {
      console.warn('Could not listen to "student" collection:', err);
    }
  );

  return () => {
    unsubPlural();
    unsubSingular();
  };
}

// 2. CREATE A NEW STUDENT DIRECTLY IN FIRESTORE
export async function createStudentInFirestore(studentData: Partial<Student>) {
  try {
    const studentId = studentData.id || `std_${Date.now()}`;
    const docRef = doc(db, 'students', studentId);
    
    const payload = {
      ...studentData,
      id: studentId,
      createdAt: serverTimestamp()
    };
    
    await setDoc(docRef, payload, { merge: true });
    return { success: true, id: studentId };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'students');
    return { success: false, error };
  }
}

// 3. SAVE DAILY ATTENDANCE
export async function saveAttendanceToFirestore(
  date: string, 
  classSection: string, 
  attendanceRecords: { studentId: string; rollNumber: string; studentName: string; status: 'present' | 'absent' | 'late' }[],
  markedBy: string
) {
  const docId = `${date}_${classSection.replace(/\s+/g, '_')}`;
  const docRef = doc(db, 'attendance', docId);

  try {
    await setDoc(docRef, {
      date,
      classSection,
      records: attendanceRecords,
      markedBy,
      totalStudents: attendanceRecords.length,
      presentCount: attendanceRecords.filter(r => r.status === 'present').length,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true, docId };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `attendance/${docId}`);
    return { success: false, error };
  }
}

// 2. SAVE OR PUBLISH A NOTICE / CIRCULAR
export async function publishNoticeToFirestore(notice: Omit<Notice, 'id'> & { id?: string }) {
  const noticeId = notice.id || `notice_${Date.now()}`;
  const docRef = doc(db, 'notices', noticeId);

  try {
    const payload = {
      ...notice,
      id: noticeId,
      createdAt: serverTimestamp()
    };
    await setDoc(docRef, payload);
    return { success: true, id: noticeId };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `notices/${noticeId}`);
    return { success: false, error };
  }
}

// 3. LISTEN TO LIVE NOTICES
export function subscribeToLiveNotices(callback: (notices: Notice[]) => void) {
  const q = query(collection(db, 'notices'));
  return onSnapshot(q, (snapshot) => {
    const notices: Notice[] = [];
    snapshot.forEach(docSnap => {
      notices.push(docSnap.data() as Notice);
    });
    callback(notices);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'notices');
  });
}

// 4. BOOK OR REQUEST A PTM MEETING
export async function requestPTMMeetingToFirestore(meeting: Omit<Meeting, 'id'>) {
  try {
    const colRef = collection(db, 'meetings');
    const docRef = await addDoc(colRef, {
      ...meeting,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'meetings');
    return { success: false, error };
  }
}

// 5. UPDATE MEETING STATUS (Confirmed / Completed)
export async function updateMeetingStatusInFirestore(meetingId: string, status: 'confirmed' | 'completed' | 'cancelled') {
  const docRef = doc(db, 'meetings', meetingId);
  try {
    await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `meetings/${meetingId}`);
    return { success: false, error };
  }
}
