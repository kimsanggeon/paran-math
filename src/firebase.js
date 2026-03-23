// Firebase 설정 및 유틸리티
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, deleteDoc, collection, getDocs, writeBatch } from 'firebase/firestore';

let db = null;

// ★ Firebase 설정 하드코딩 (모든 기기 자동 연결)
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyAmqER5913WWFzhVcoABBEibhouvFk2WUg",
  authDomain:        "paran-math.firebaseapp.com",
  projectId:         "paran-math",
  storageBucket:     "paran-math.firebasestorage.app",
  messagingSenderId: "876432468378",
  appId:             "1:876432468378:web:0d921baad20f3522293223"
};

// Firebase 설정 저장/로드
export const saveFirebaseConfig = (config) => {
  localStorage.setItem('paran:firebaseConfig', JSON.stringify(config));
};
export const loadFirebaseConfig = () => FIREBASE_CONFIG;

// Firebase 초기화
export const initializeFirebase = (config) => {
  try {
    const cfg = config || FIREBASE_CONFIG;
    let app;
    if (getApps().length > 0) {
      app = getApp();
    } else {
      app = initializeApp(cfg);
    }
    db = getFirestore(app);
    console.log('Firebase 초기화 성공:', cfg.projectId);
    return true;
  } catch (e) {
    console.error('Firebase 초기화 실패:', e.message);
    return false;
  }
};

// ★ 앱 시작 시 자동 초기화
initializeFirebase(FIREBASE_CONFIG);

export const testFirebaseConnection = async () => {
  if (!db) return { success: false, message: 'Firebase가 초기화되지 않았습니다.' };
  try {
    const testRef = doc(db, 'test', 'connection');
    await setDoc(testRef, { timestamp: new Date().toISOString(), test: true });
    const testDoc = await getDoc(testRef);
    if (testDoc.exists()) return { success: true, message: '연결 성공!' };
    return { success: false, message: '문서를 읽을 수 없습니다.' };
  } catch (e) {
    return { success: false, message: `연결 실패: ${e.message}` };
  }
};

export const isFirebaseConnected = () => db !== null;

// ========== 학생 데이터 (개별 문서 저장 - 1MB 제한 해결) ==========
export const saveStudentsToFirebase = async (students, academyId = 'default') => {
  if (!db) return false;
  try {
    const studentsCol = collection(db, 'academies', academyId, 'students');

    // 현재 Firebase에 있는 학생 ID 목록 조회
    const existingSnap = await getDocs(studentsCol);
    const existingIds = new Set();
    existingSnap.forEach(d => existingIds.add(d.id));

    // 새 학생 목록의 ID
    const newIds = new Set(students.map(s => String(s.id)));

    // 삭제된 학생 제거
    const batch = writeBatch(db);
    existingSnap.forEach(d => {
      if (!newIds.has(d.id)) {
        batch.delete(d.ref);
      }
    });
    await batch.commit();

    // 각 학생을 개별 문서로 저장 (병렬 처리)
    await Promise.all(students.map(student =>
      setDoc(doc(db, 'academies', academyId, 'students', String(student.id)), {
        ...student,
        updatedAt: new Date().toISOString()
      })
    ));

    return true;
  } catch (e) {
    console.error('학생 저장 실패:', e);
    return false;
  }
};

export const loadStudentsFromFirebase = async (academyId = 'default') => {
  if (!db) return null;
  try {
    // 새 방식: 개별 문서 서브컬렉션에서 로드
    const studentsCol = collection(db, 'academies', academyId, 'students');
    const snap = await getDocs(studentsCol);
    if (!snap.empty) {
      const students = [];
      snap.forEach(d => {
        const data = d.data();
        delete data.updatedAt;
        students.push(data);
      });
      return students;
    }

    // 하위 호환: 기존 단일 문서에서 로드 (마이그레이션 전 데이터)
    const oldSnap = await getDoc(doc(db, 'academies', academyId, 'data', 'students'));
    if (oldSnap.exists() && oldSnap.data().students) {
      const oldStudents = oldSnap.data().students;
      // 자동 마이그레이션: 개별 문서로 저장
      console.log('학생 데이터 마이그레이션 시작:', oldStudents.length, '명');
      await Promise.all(oldStudents.map(student =>
        setDoc(doc(db, 'academies', academyId, 'students', String(student.id)), {
          ...student,
          updatedAt: new Date().toISOString()
        })
      ));
      console.log('학생 데이터 마이그레이션 완료');
      return oldStudents;
    }

    return null;
  } catch (e) {
    console.error('학생 로드 실패:', e);
    return null;
  }
};

// ========== 선생님 데이터 ==========
export const saveTeachersToFirebase = async (teachers, academyId = 'default') => {
  if (!db) return false;
  try {
    await setDoc(doc(db, 'academies', academyId, 'data', 'teachers'), {
      teachers, updatedAt: new Date().toISOString()
    });
    return true;
  } catch (e) { return false; }
};

export const loadTeachersFromFirebase = async (academyId = 'default') => {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, 'academies', academyId, 'data', 'teachers'));
    return snap.exists() ? snap.data().teachers : null;
  } catch (e) { return null; }
};

// ========== 학습 보고서 ==========
export const saveReportToFirebase = async (studentName, reportData, academyId = 'default') => {
  if (!db) return false;
  try {
    await setDoc(doc(db, 'academies', academyId, 'reports', studentName), {
      ...reportData, studentName, updatedAt: new Date().toISOString()
    });
    return true;
  } catch (e) { return false; }
};

export const loadReportFromFirebase = async (studentName, academyId = 'default') => {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, 'academies', academyId, 'reports', studentName));
    if (!snap.exists()) return null;
    const data = snap.data();
    delete data.studentName; delete data.updatedAt;
    return data;
  } catch (e) { return null; }
};

// ========== 메시지 ==========
export const saveMessagesToFirebase = async (studentName, messages, academyId = 'default') => {
  if (!db) return false;
  try {
    await setDoc(doc(db, 'academies', academyId, 'messages', studentName), {
      messages, updatedAt: new Date().toISOString()
    });
    return true;
  } catch (e) { return false; }
};

export const loadMessagesFromFirebase = async (studentName, academyId = 'default') => {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, 'academies', academyId, 'messages', studentName));
    return snap.exists() ? snap.data().messages : null;
  } catch (e) { return null; }
};

// ========== 설정 데이터 ==========
export const saveSettingsToFirebase = async (settings, academyId = 'default') => {
  if (!db) return false;
  try {
    await setDoc(doc(db, 'academies', academyId, 'data', 'settings'), {
      ...settings, updatedAt: new Date().toISOString()
    });
    return true;
  } catch (e) { return false; }
};

export const loadSettingsFromFirebase = async (academyId = 'default') => {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, 'academies', academyId, 'data', 'settings'));
    return snap.exists() ? snap.data() : null;
  } catch (e) { return null; }
};

// ========== 전체 데이터 동기화 ==========
export const uploadAllDataToFirebase = async (academyId = 'default') => {
  if (!db) return { success: false, message: 'Firebase가 연결되지 않았습니다.' };
  try {
    const studentsData = localStorage.getItem('paran:students');
    if (studentsData) await saveStudentsToFirebase(JSON.parse(studentsData), academyId);
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith('report:') || key.startsWith('paran:report:')) {
        const studentName = key.replace('paran:report:', '').replace('report:', '');
        const data = JSON.parse(localStorage.getItem(key));
        if (data) await saveReportToFirebase(studentName, data, academyId);
      }
      if (key.startsWith('paran:messages:')) {
        const studentName = key.replace('paran:messages:', '');
        const data = JSON.parse(localStorage.getItem(key));
        if (data) await saveMessagesToFirebase(studentName, data, academyId);
      }
    }
    return { success: true, message: '모든 데이터가 Firebase에 업로드되었습니다.' };
  } catch (e) {
    return { success: false, message: `업로드 실패: ${e.message}` };
  }
};

export const downloadAllDataFromFirebase = async (academyId = 'default') => {
  if (!db) return { success: false, message: 'Firebase가 연결되지 않았습니다.' };
  try {
    const students = await loadStudentsFromFirebase(academyId);
    if (students) localStorage.setItem('paran:students', JSON.stringify(students));
    const reportsRef = collection(db, 'academies', academyId, 'reports');
    const reportsSnap = await getDocs(reportsRef);
    reportsSnap.forEach(d => {
      const data = d.data(); const name = d.id;
      delete data.studentName; delete data.updatedAt;
      localStorage.setItem(`report:${name}`, JSON.stringify(data));
      localStorage.setItem(`paran:report:${name}`, JSON.stringify(data));
    });
    const messagesRef = collection(db, 'academies', academyId, 'messages');
    const messagesSnap = await getDocs(messagesRef);
    messagesSnap.forEach(d => {
      localStorage.setItem(`paran:messages:${d.id}`, JSON.stringify(d.data().messages));
    });
    return { success: true, message: 'Firebase에서 모든 데이터를 다운로드했습니다.' };
  } catch (e) {
    return { success: false, message: `다운로드 실패: ${e.message}` };
  }
};
