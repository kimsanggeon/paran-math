import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

const cfg = {
  apiKey: "AIzaSyAmqER5913WWFzhVcoABBEibhouvFk2WUg",
  authDomain: "paran-math.firebaseapp.com",
  projectId: "paran-math",
  storageBucket: "paran-math.firebasestorage.app",
  messagingSenderId: "876432468378",
  appId: "1:876432468378:web:0d921baad20f3522293223"
};

// ===== 데모 학생 설정 =====
const DEMO_NAME = '파란데모';
const DEMO_DOCID = 'demo2026';
const DEMO_ID = 9990001;
const PARENT_PW = '1234';
const STUDENT_PW = '1234';

const hardTimeout = setTimeout(() => { console.error('TIMEOUT'); process.exit(2); }, 45000);
const clean = (o) => JSON.parse(JSON.stringify(o)); // drop undefined

(async () => {
  try {
    const app = initializeApp(cfg);
    const db = getFirestore(app);

    // 1) 템플릿(실제 학생) 읽기 — 구조만 차용
    const snap = await getDocs(collection(db, 'academies', 'default', 'students'));
    let tpl = null;
    snap.forEach(d => { const x = d.data(); if (x.name === '박건영') tpl = x; });
    if (!tpl) throw new Error('template student not found');
    const repSnap = await getDoc(doc(db, 'academies', 'default', 'reports', '박건영'));
    const tplReport = repSnap.exists() ? repSnap.data() : { sessions: [] };

    // 2) 세션 날짜 (2026-04-01 이후여야 몰입의 탑에 반영)
    const dates = ['2026-04-07','2026-04-11','2026-04-15','2026-04-21','2026-04-25','2026-05-02','2026-05-09','2026-05-16','2026-05-23'];
    const errPool = ['계산','조건','해석','전략','단위','시간','개념'];
    const tplSessions = (tplReport.sessions || []).slice(0, dates.length);

    const sessions = dates.map((date, i) => {
      const src = tplSessions[i] || {};
      const s = {
        id: 5000000 + i,
        sessionNumber: i + 1,
        date,
        sessionType: 'regular',
        attendanceStatus: 'present',
        // 학습 태도 (모두 우수)
        understanding: 5, participation: 5, attitude: 5, concentration: 5,
        persistence: 5, problemSolving: 5, questioning: 2, selfDirected: 5,
        studyTime: 70,
        hasHomework: true, homework: 5, homeworkExempt: false,
        // 수업 내용 (실제 단원 구조 차용)
        lessonContents: clean(src.lessonContents || []),
        assignments: clean((src.assignments || []).map(a => ({ ...a, completed: true }))),
        studentChecklists: [],
        additionalClasses: [],
        note: '',
        praiseMessage: i % 3 === 0 ? '개념을 스스로 설명하는 모습이 인상적이었어요!' : '',
        // 기본 시험 필드
        testType: '', customTestName: '', testScore: '', testTotal: '',
        testScope: '', testAnswers: [], testErrorTypes: [], wrongTypes: [],
        testQuestionCount: 0, tests: [],
        problemSets: [],
        awards: [],
      };

      // 시험 부여 (대부분 통과 — 1문제만 오답)
      if (i === 5) {
        // 정기고사 (등수 기반): 5등 → 몰입의 탑 +10
        s.testType = '정기고사'; s.customTestName = '1학기 중간고사';
        s.testScore = 92; s.testTotal = 100; s.testScope = '소인수분해~정수와 유리수';
        s.testRank = '5'; s.testRankTotal = '120';
        s.testQuestionCount = 25;
      } else if (i % 2 === 1) {
        // 주간테스트 (10문항, 1오답) → 통과 + 고난도 보너스
        s.testType = '주간테스트'; s.customTestName = `${i + 1}주차 주간테스트`;
        s.difficulty = 'high';
        s.testScope = (s.lessonContents[0] && s.lessonContents[0].mainUnit) || '소인수분해';
        s.testQuestionCount = 10;
        const ans = Array(10).fill(true); ans[3] = false;
        s.testAnswers = ans;
        const et = Array(10).fill(''); et[3] = errPool[i % errPool.length];
        s.testErrorTypes = et;
        s.testScore = 90; s.testTotal = 100;
      } else {
        // 일일테스트 (5문항 만점)
        s.testType = '일일테스트'; s.customTestName = `${i + 1}차 일일테스트`;
        s.testScope = (s.lessonContents[0] && s.lessonContents[0].mainUnit) || '소인수분해';
        s.testQuestionCount = 5;
        s.testAnswers = Array(5).fill(true);
        s.testScore = 100; s.testTotal = 100;
      }

      // 문제풀이 세트 (정답률 ~90%, 오답유형 표본)
      const wrongList = [{ number: 7, errorType: errPool[i % errPool.length] }];
      if (i % 2 === 0) wrongList.push({ number: 14, errorType: errPool[(i + 2) % errPool.length] });
      s.problemSets = [{
        textbook: (s.assignments[0] && s.assignments[0].textbook) || '쎈 중1-1',
        pages: (s.assignments[0] && s.assignments[0].pages) || 'p.20~28',
        totalProblems: 20,
        correctAnswers: 20 - wrongList.length,
        wrongProblemsList: wrongList,
        wrongTypes: [],
      }];

      // 상장 (몇 회차에 부여)
      if (i === 1) s.awards = ['effort'];
      if (i === 4) s.awards = ['improvement'];
      if (i === 5) s.awards = ['excellence'];
      if (i === 7) s.awards = ['perfect'];
      if (i === 8) s.awards = ['diligence'];

      return clean(s);
    });

    // 3) 데모 리포트 (실제 리포트 구조 차용 + 정돈)
    const rep = clean(tplReport);
    rep.studentName = DEMO_NAME;
    rep.schoolName = '○○중학교';
    rep.className = '데모반';
    rep.grade = '중1';
    rep.schoolGrade = '중1';
    rep.schoolSemester = '1학기';
    rep.teacher = '담임 선생님';
    rep.goalAccuracy = 90;
    rep.goalDescription = '매 수업 정답률 90% 이상 유지';
    rep.shortTermGoal = '매일 오답노트 3문제 복습하기';
    rep.longTermGoal = '중3까지 공통수학 1회독, 고1 내신 1등급';
    rep.homeStudyGuide = '매일 30분 연산 훈련 + 오답 1회 재풀이';
    rep.teacherComment = '개념을 자기 말로 설명하는 힘이 부쩍 좋아졌습니다. 계산 실수만 더 줄이면 최상위권으로 도약할 수 있습니다. 꾸준함이 가장 큰 강점입니다.';
    rep.additionalStrengths = ['스스로 개념을 설명하는 힘', '꾸준한 학습 태도', '적극적인 질문'];
    rep.additionalImprovements = ['계산 정확도 높이기', '시험 시간 관리'];
    // 템플릿에서 복제된 잔여 데이터 정리 (오래된 날짜·내용 제거)
    rep.upcomingTests = [{ testType: '주간테스트', testDate: '2026-05-30', testScope: '정수와 유리수 전체', customTestName: '', difficulty: 'high', actualAccuracyMin: '', actualAccuracyMax: '' }];
    rep.repeatAlerts = [];
    rep.retestPenalties = [];
    rep.personalityTest = null;
    rep.nextClassPrep = ['개념노트 정리 / 오답 3문제 재풀이'];
    rep.schoolScores = [];
    rep.transferHistory = [];
    delete rep.previousTeacher;
    rep.sessions = sessions;
    rep.currentSessionIndex = sessions.length - 1;
    rep.reportDate = '2026-05-23';
    delete rep.updatedAt;

    // 4) 데모 학생 (실제 구조 차용 + 익명화)
    const demo = clean(tpl);
    demo.id = DEMO_ID;
    demo.name = DEMO_NAME;
    demo.parentName = '파란데모 학부모';
    demo.parentPhone = '010-0000-0000';
    demo.phone = '010-0000-0000';
    demo.schoolName = '○○중학교';
    demo.className = '데모반';
    demo.grade = '중1'; demo.schoolGrade = '중1'; demo.schoolSemester = '1학기';
    demo.parentPassword = PARENT_PW;
    demo.studentPassword = STUDENT_PW;
    demo.exp = 1350; demo.streak = 14; demo.levelStage = 'medium';
    demo.shortTermGoal = rep.shortTermGoal;
    demo.longTermGoal = rep.longTermGoal;
    demo.teacherMessage = '이번 주도 정말 성실하게 잘 따라와 주었어요! 오답 복습만 꾸준히 하면 다음 시험 1등급도 충분합니다. 화이팅! 💪';
    demo.badges = clean((tpl.badges || []).slice(0, 5));
    demo.tests = [];
    demo.expHistory = [];
    demo.classSchedule = [];
    demo.schoolScores = [
      { name: '1학기 중간고사', subject: '수학', score: 92, date: '2026-05-02' },
    ];
    // 숙제 (모두 완료, 최근 날짜)
    const hwTextbooks = [
      ['수학의 바이블 개념', 'p.20~24'], ['쎈 중1-1', 'p.15~18'], ['수학의 바이블 유형', 'p.30~35'],
      ['RPM 중1-1', 'p.12~17'], ['쎈 중1-1', 'p.40~44'], ['개념원리 중1-1', 'p.51~56'],
    ];
    const todayMs = Date.parse('2026-05-29');
    demo.homework = hwTextbooks.map((t, i) => ({
      id: 6000000 + i,
      textbook: t[0], pages: t[1],
      title: `${t[0]} ${t[1]}`,
      assignedDate: new Date(todayMs - (10 - i) * 86400000).toISOString().slice(0, 10),
      dueDate: new Date(todayMs - (6 - i) * 86400000).toISOString().slice(0, 10),
      completed: true,
    }));
    // 오답노트 (반복학습/오답유형 표본 — errorType 부여)
    const wnUnits = [
      ['소인수분해', '최대공약수와 최소공배수', '계산'],
      ['정수와 유리수', '유리수의 덧셈과 뺄셈', '조건'],
      ['정수와 유리수', '유리수의 곱셈과 나눗셈', '계산'],
      ['문자와 식', '일차방정식의 활용', '해석'],
      ['문자와 식', '일차식의 계산', '전략'],
      ['좌표평면과 그래프', '정비례와 반비례', '해석'],
      ['소인수분해', '소인수분해를 이용한 약수', '단위'],
      ['정수와 유리수', '절댓값', '개념'],
    ];
    demo.wrongNotes = wnUnits.map((u, i) => ({
      id: `demo_wn_${i}`,
      textbook: i % 3 === 0 ? '시험' : '수학의 바이블 개념',
      customTextbook: i % 3 === 0 ? '주간테스트' : '',
      unit: u[0],
      page: `${u[0]} - ${u[1]}`,
      problemNumber: String(3 + i),
      errorType: u[2],
      difficulty: 'medium',
      conquered: false,
      reviewCount: i % 3,
      sessionDate: new Date(todayMs - (12 - i) * 86400000).toISOString().slice(0, 10),
      nextReviewDate: new Date(todayMs + (i % 4) * 86400000).toISOString().slice(0, 10),
      createdAt: new Date(todayMs - (12 - i) * 86400000).toISOString(),
      wrongAnswer: '', correctAnswer: '', explanation: '', type: '',
    }));
    // 저장된 타워(표시용 — 뷰에서 재계산되지만 폴백 대비)
    demo.tower = {
      currentFloor: 28, highestFloor: 28, defenseStatus: 'safe',
      breakdown: { test: 14, checking: 0, exam: 10, homework: 2.8, attitude: 9, studyTime: 4.5, combo: 1, defense: 0, manualPoints: 0 },
      milestones: [10, 20], lastUpdated: new Date().toISOString(),
    };
    demo.isDemo = true;
    delete demo.status; // 템플릿이 퇴원/관이동 상태일 수 있어 명시적으로 제거
    delete demo.updatedAt; delete demo.lastSynced; delete demo.syncStats;

    // 5) 쓰기
    await setDoc(doc(db, 'academies', 'default', 'students', DEMO_DOCID), { ...demo, updatedAt: new Date().toISOString() });
    await setDoc(doc(db, 'academies', 'default', 'reports', DEMO_NAME), { ...rep, studentName: DEMO_NAME, updatedAt: new Date().toISOString() });

    console.log('OK: demo student created');
    console.log('  이름:', DEMO_NAME, '| 학부모 PW:', PARENT_PW, '| 학생 PW:', STUDENT_PW);
    console.log('  sessions:', sessions.length, '| homework:', demo.homework.length, '| wrongNotes:', demo.wrongNotes.length);
    clearTimeout(hardTimeout);
    process.exit(0);
  } catch (e) {
    console.error('ERR', e && e.message);
    clearTimeout(hardTimeout);
    process.exit(1);
  }
})();
