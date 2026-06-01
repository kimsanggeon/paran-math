// 데모 선생님 생성 + 데모 학생 배정 + 보고서를 선생님 편집기에서도 보이도록 기록
// 사용법: 프로젝트 폴더에서  ->  node demo-tools/seed-demo-teacher.mjs
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const cfg = {
  apiKey: "AIzaSyAmqER5913WWFzhVcoABBEibhouvFk2WUg",
  authDomain: "paran-math.firebaseapp.com",
  projectId: "paran-math",
  storageBucket: "paran-math.firebasestorage.app",
  messagingSenderId: "876432468378",
  appId: "1:876432468378:web:0d921baad20f3522293223"
};

const DEMO_NAME = '파란데모';
const DEMO_DOCID = 'demo2026';
const TEACHER_ID = 'demoTeacher2026';
const TEACHER_NAME = '데모 선생님';
const TEACHER_PW = '1234';
const keyToDocId = (k) => k.replace(/\//g, '_').replace(/:/g, '__');

const t = setTimeout(() => { console.error('TIMEOUT'); process.exit(2); }, 40000);
(async () => {
  try {
    const app = initializeApp(cfg);
    const db = getFirestore(app);

    // 1) 선생님 목록에 데모 선생님 추가 (기존 선생님 보존)
    const tRef = doc(db, 'academies', 'default', 'data', 'teachers');
    const tSnap = await getDoc(tRef);
    let teachers = (tSnap.exists() && Array.isArray(tSnap.data().teachers)) ? tSnap.data().teachers : [];
    console.log('기존 선생님 수:', teachers.length, '| 샘플 키:', teachers[0] ? Object.keys(teachers[0]).join(',') : '(없음)');
    teachers = teachers.filter(x => x.id !== TEACHER_ID); // 중복 제거
    const demoTeacher = { id: TEACHER_ID, name: TEACHER_NAME, password: TEACHER_PW, isDemo: true };
    teachers.push(demoTeacher);
    await setDoc(tRef, { teachers, updatedAt: new Date().toISOString() });
    console.log('OK: 데모 선생님 추가 ->', TEACHER_NAME, '/ PW', TEACHER_PW);

    // 2) 데모 학생을 데모 선생님에게 배정
    const sRef = doc(db, 'academies', 'default', 'students', DEMO_DOCID);
    const sSnap = await getDoc(sRef);
    if (!sSnap.exists()) throw new Error('데모 학생(demo2026)이 없습니다. 먼저 seed-demo.mjs 실행');
    const student = sSnap.data();
    student.teacherId = TEACHER_ID;
    await setDoc(sRef, { ...student, updatedAt: new Date().toISOString() });
    console.log('OK: 데모 학생 배정 ->', student.name, 'teacherId=', TEACHER_ID);

    // 3) 보고서를 window.storage 경로에도 기록 (선생님 편집기 + 학부모/학생 뷰 모두 호환)
    const repRef = doc(db, 'academies', 'default', 'reports', DEMO_NAME);
    const repSnap = await getDoc(repRef);
    if (!repSnap.exists()) throw new Error('보고서(reports/파란데모)가 없습니다. 먼저 seed-demo.mjs 실행');
    const report = repSnap.data();
    delete report.updatedAt;
    const value = JSON.stringify(report);
    for (const key of [`report:${DEMO_NAME}`, `paran:report:${DEMO_NAME}`]) {
      await setDoc(doc(db, 'storage', keyToDocId(key)), { key, value, updatedAt: new Date().toISOString() });
      console.log('OK: storage 기록 ->', key, '(doc:', keyToDocId(key) + ')');
    }

    console.log('\n=== 완료 ===');
    console.log('선생님 로그인: 선생님 선택 [데모 선생님] / 비밀번호 1234');
    console.log('→ 학생 관리에 [파란데모] 표시, 학습 보고서 탭에서 9회차 내용 확인 가능');
    clearTimeout(t); process.exit(0);
  } catch (e) {
    console.error('ERR', e && e.message);
    clearTimeout(t); process.exit(1);
  }
})();
