// Firebase 설정 및 유틸리티
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, deleteDoc, query, where } from 'firebase/firestore';

let db = null;

// Firebase 설정 저장/로드
export const saveFirebaseConfig = (config) => {
  localStorage.setItem('paran:firebaseConfig', JSON.stringify(config));
};

export const loadFirebaseConfig = () => {
  try {
    const saved = localStorage.getItem('paran:firebaseConfig');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
};

// Firebase 초기화
export const initializeFirebase = (config) => {
  try {
    if (!config || !config.apiKey || !config.projectId) {
      console.log('Firebase 설정이 없습니다.');
      return false;
    }
    
    // 값 정리 (공백 제거)
    const cleanConfig = {
      apiKey: (config.apiKey || '').trim(),
      authDomain: (config.authDomain || '').trim(),
      projectId: (config.projectId || '').trim(),
      storageBucket: (config.storageBucket || '').trim(),
      messagingSenderId: (config.messagingSenderId || '').trim(),
      appId: (config.appId || '').trim()
    };
    
    console.log('Firebase 초기화 시도:', cleanConfig.projectId);
    
    // 이미 초기화된 앱이 있으면 그것을 사용
    let app;
    if (getApps().length > 0) {
      app = getApp();
      console.log('기존 Firebase 앱 사용');
    } else {
      app = initializeApp(cleanConfig);
      console.log('새 Firebase 앱 초기화');
    }
    
    db = getFirestore(app);
    console.log('Firebase 초기화 성공');
    return true;
  } catch (e) {
    console.error('Firebase 초기화 실패:', e);
    console.error('에러 상세:', e.message);
    return false;
  }
};

// Firebase 연결 테스트 (실제 읽기/쓰기 테스트)
export const testFirebaseConnection = async () => {
  if (!db) return { success: false, message: 'Firebase가 초기화되지 않았습니다.' };
  
  try {
    // 테스트 문서 쓰기
    const testRef = doc(db, 'test', 'connection');
    await setDoc(testRef, { 
      timestamp: new Date().toISOString(),
      test: true 
    });
    
    // 테스트 문서 읽기
    const testDoc = await getDoc(testRef);
    if (testDoc.exists()) {
      console.log('Firebase 연결 테스트 성공');
      return { success: true, message: '연결 성공!' };
    } else {
      return { success: false, message: '문서를 읽을 수 없습니다.' };
    }
  } catch (e) {
    console.error('Firebase 연결 테스트 실패:', e);
    return { success: false, message: `연결 실패: ${e.message}` };
  }
};

// Firebase 연결 상태 확인
export const isFirebaseConnected = () => {
  return db !== null;
};

// ========== 학생 데이터 ==========

// 학생 목록 저장
export const saveStudentsToFirebase = async (students, academyId = 'default') => {
  if (!db) return false;
  try {
    const docRef = doc(db, 'academies', academyId, 'data', 'students');
    await setDoc(docRef, { 
      students, 
      updatedAt: new Date().toISOString() 
    });
    console.log('학생 데이터 Firebase 저장 완료');
    return true;
  } catch (e) {
    console.error('학생 데이터 저장 실패:', e);
    return false;
  }
};

// 학생 목록 로드
export const loadStudentsFromFirebase = async (academyId = 'default') => {
  if (!db) return null;
  try {
    const docRef = doc(db, 'academies', academyId, 'data', 'students');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('학생 데이터 Firebase 로드 완료');
      return docSnap.data().students;
    }
    return null;
  } catch (e) {
    console.error('학생 데이터 로드 실패:', e);
    return null;
  }
};

// ========== 학습 보고서 ==========

// 학습 보고서 저장
export const saveReportToFirebase = async (studentName, reportData, academyId = 'default') => {
  if (!db) return false;
  try {
    const docRef = doc(db, 'academies', academyId, 'reports', studentName);
    await setDoc(docRef, { 
      ...reportData, 
      studentName,
      updatedAt: new Date().toISOString() 
    });
    console.log(`${studentName} 학습 보고서 Firebase 저장 완료`);
    return true;
  } catch (e) {
    console.error('학습 보고서 저장 실패:', e);
    return false;
  }
};

// 학습 보고서 로드
export const loadReportFromFirebase = async (studentName, academyId = 'default') => {
  if (!db) return null;
  try {
    const docRef = doc(db, 'academies', academyId, 'reports', studentName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log(`${studentName} 학습 보고서 Firebase 로드 완료`);
      const data = docSnap.data();
      delete data.studentName;
      delete data.updatedAt;
      return data;
    }
    return null;
  } catch (e) {
    console.error('학습 보고서 로드 실패:', e);
    return null;
  }
};

// ========== 메시지 ==========

// 메시지 저장
export const saveMessagesToFirebase = async (studentName, messages, academyId = 'default') => {
  if (!db) return false;
  try {
    const docRef = doc(db, 'academies', academyId, 'messages', studentName);
    await setDoc(docRef, { 
      messages, 
      updatedAt: new Date().toISOString() 
    });
    return true;
  } catch (e) {
    console.error('메시지 저장 실패:', e);
    return false;
  }
};

// 메시지 로드
export const loadMessagesFromFirebase = async (studentName, academyId = 'default') => {
  if (!db) return null;
  try {
    const docRef = doc(db, 'academies', academyId, 'messages', studentName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().messages;
    }
    return null;
  } catch (e) {
    console.error('메시지 로드 실패:', e);
    return null;
  }
};

// ========== 설정 데이터 ==========

// 설정 저장
export const saveSettingsToFirebase = async (settings, academyId = 'default') => {
  if (!db) return false;
  try {
    const docRef = doc(db, 'academies', academyId, 'data', 'settings');
    await setDoc(docRef, { 
      ...settings, 
      updatedAt: new Date().toISOString() 
    });
    return true;
  } catch (e) {
    console.error('설정 저장 실패:', e);
    return false;
  }
};

// 설정 로드
export const loadSettingsFromFirebase = async (academyId = 'default') => {
  if (!db) return null;
  try {
    const docRef = doc(db, 'academies', academyId, 'data', 'settings');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (e) {
    console.error('설정 로드 실패:', e);
    return null;
  }
};

// ========== 전체 데이터 동기화 ==========

// 모든 데이터를 Firebase에 업로드
export const uploadAllDataToFirebase = async (academyId = 'default') => {
  if (!db) return { success: false, message: 'Firebase가 연결되지 않았습니다.' };
  
  try {
    // 학생 데이터
    const studentsData = localStorage.getItem('paran:students');
    if (studentsData) {
      const students = JSON.parse(studentsData);
      await saveStudentsToFirebase(students, academyId);
    }
    
    // 학습 보고서들
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith('report:') || key.startsWith('paran:report:')) {
        const studentName = key.replace('paran:report:', '').replace('report:', '');
        const reportData = JSON.parse(localStorage.getItem(key));
        if (reportData) {
          await saveReportToFirebase(studentName, reportData, academyId);
        }
      }
      if (key.startsWith('paran:messages:')) {
        const studentName = key.replace('paran:messages:', '');
        const messages = JSON.parse(localStorage.getItem(key));
        if (messages) {
          await saveMessagesToFirebase(studentName, messages, academyId);
        }
      }
    }
    
    // 설정
    const settings = {
      academyName: localStorage.getItem('paran:academyName'),
      academyLogo: localStorage.getItem('paran:academyLogo'),
      notices: localStorage.getItem('paran:notices'),
      schedules: localStorage.getItem('paran:schedules'),
    };
    await saveSettingsToFirebase(settings, academyId);
    
    return { success: true, message: '모든 데이터가 Firebase에 업로드되었습니다.' };
  } catch (e) {
    return { success: false, message: `업로드 실패: ${e.message}` };
  }
};

// Firebase에서 모든 데이터 다운로드
export const downloadAllDataFromFirebase = async (academyId = 'default') => {
  if (!db) return { success: false, message: 'Firebase가 연결되지 않았습니다.' };
  
  try {
    // 학생 데이터
    const students = await loadStudentsFromFirebase(academyId);
    if (students) {
      localStorage.setItem('paran:students', JSON.stringify(students));
    }
    
    // 학습 보고서들
    const reportsRef = collection(db, 'academies', academyId, 'reports');
    const reportsSnap = await getDocs(reportsRef);
    reportsSnap.forEach(doc => {
      const data = doc.data();
      const studentName = doc.id;
      delete data.studentName;
      delete data.updatedAt;
      localStorage.setItem(`report:${studentName}`, JSON.stringify(data));
      localStorage.setItem(`paran:report:${studentName}`, JSON.stringify(data));
    });
    
    // 메시지
    const messagesRef = collection(db, 'academies', academyId, 'messages');
    const messagesSnap = await getDocs(messagesRef);
    messagesSnap.forEach(doc => {
      const data = doc.data();
      const studentName = doc.id;
      localStorage.setItem(`paran:messages:${studentName}`, JSON.stringify(data.messages));
    });
    
    // 설정
    const settings = await loadSettingsFromFirebase(academyId);
    if (settings) {
      if (settings.academyName) localStorage.setItem('paran:academyName', settings.academyName);
      if (settings.academyLogo) localStorage.setItem('paran:academyLogo', settings.academyLogo);
      if (settings.notices) localStorage.setItem('paran:notices', settings.notices);
      if (settings.schedules) localStorage.setItem('paran:schedules', settings.schedules);
    }
    
    return { success: true, message: 'Firebase에서 모든 데이터를 다운로드했습니다.' };
  } catch (e) {
    return { success: false, message: `다운로드 실패: ${e.message}` };
  }
};
