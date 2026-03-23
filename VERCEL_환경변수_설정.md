# Vercel 환경변수 설정 가이드

Vercel에 배포할 때 아래 환경변수를 설정하면
**모든 기기(원장폰, 학생폰, 노트북)에서 Firebase가 자동 연결**됩니다.

## 설정 방법

1. [Vercel 대시보드](https://vercel.com) 접속
2. 프로젝트 선택 → **Settings** → **Environment Variables**
3. 아래 변수들을 하나씩 추가:

| 변수명 | 값 (Firebase 콘솔에서 복사) |
|--------|---------------------------|
| `VITE_FIREBASE_API_KEY` | apiKey 값 |
| `VITE_FIREBASE_AUTH_DOMAIN` | authDomain 값 |
| `VITE_FIREBASE_PROJECT_ID` | projectId 값 |
| `VITE_FIREBASE_STORAGE_BUCKET` | storageBucket 값 |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | messagingSenderId 값 |
| `VITE_FIREBASE_APP_ID` | appId 값 |

4. **Redeploy** (재배포) 실행

## Firebase 설정값 찾는 방법

1. [Firebase 콘솔](https://console.firebase.google.com) 접속
2. 프로젝트 선택 → 톱니바퀴(⚙️) → **프로젝트 설정**
3. **내 앱** 섹션에서 firebaseConfig 객체 확인

```javascript
// 이런 형태입니다
const firebaseConfig = {
  apiKey: "AIza...",           → VITE_FIREBASE_API_KEY
  authDomain: "xxx.firebaseapp.com",  → VITE_FIREBASE_AUTH_DOMAIN
  projectId: "xxx",            → VITE_FIREBASE_PROJECT_ID
  storageBucket: "xxx.appspot.com",   → VITE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456", → VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123:web:abc"       → VITE_FIREBASE_APP_ID
};
```

## 환경변수 설정 후 동작

- 앱 접속 즉시 Firebase 자동 연결
- 원장이 학생 등록 → Firebase에 즉시 저장
- 학생 폰에서 앱 열기 → Firebase에서 자동 로드 → 바로 로그인 가능
