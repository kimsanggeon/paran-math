// 데모 학생(파란데모) + 데모 선생님 전체 삭제 스크립트
// 사용법: 프로젝트 폴더에서  ->  node demo-tools/delete-demo.mjs
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

const cfg = {
  apiKey: "AIzaSyAmqER5913WWFzhVcoABBEibhouvFk2WUg",
  authDomain: "paran-math.firebaseapp.com",
  projectId: "paran-math",
  storageBucket: "paran-math.firebasestorage.app",
  messagingSenderId: "876432468378",
  appId: "1:876432468378:web:0d921baad20f3522293223"
};

const DEMO_DOCID = 'demo2026';
const DEMO_NAME = '파란데모';
const TEACHER_ID = 'demoTeacher2026';
const keyToDocId = (k) => k.replace(/\//g, '_').replace(/:/g, '__');

const t = setTimeout(() => { console.error('TIMEOUT'); process.exit(2); }, 30000);
(async () => {
  try {
    const app = initializeApp(cfg);
    const db = getFirestore(app);

    // 1) 학생 / 보고서 / 메시지 삭제
    await deleteDoc(doc(db, 'academies', 'default', 'students', DEMO_DOCID));
    await deleteDoc(doc(db, 'academies', 'default', 'reports', DEMO_NAME));
    try { await deleteDoc(doc(db, 'academies', 'default', 'messages', DEMO_NAME)); } catch (e) {}

    // 2) storage 컬렉션의 보고서 사본 삭제
    for (const key of [`report:${DEMO_NAME}`, `paran:report:${DEMO_NAME}`]) {
      try { await deleteDoc(doc(db, 'storage', keyToDocId(key))); } catch (e) {}
    }

    // 3) 선생님 목록에서 데모 선생님 제거 (다른 선생님 보존)
    const tRef = doc(db, 'academies', 'default', 'data', 'teachers');
    const tSnap = await getDoc(tRef);
    if (tSnap.exists() && Array.isArray(tSnap.data().teachers)) {
      const remaining = tSnap.data().teachers.filter(x => x.id !== TEACHER_ID);
      await setDoc(tRef, { teachers: remaining, updatedAt: new Date().toISOString() });
    }

    console.log('OK: 데모 학생(파란데모) + 데모 선생님이 모두 삭제되었습니다.');
    console.log('※ 이미 로그인/실행 중이던 기기는 새로고침(또는 캐시 초기화) 후 반영됩니다.');
    clearTimeout(t); process.exit(0);
  } catch (e) {
    console.error('ERR', e && e.message);
    clearTimeout(t); process.exit(1);
  }
})();
