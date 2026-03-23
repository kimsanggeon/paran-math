# 📱 파란수학 앱 배포 가이드 (PWA)

## ✅ 완료된 작업
- PWA 서비스워커 등록 (오프라인 지원)
- 앱 아이콘 전체 사이즈 생성 (72~512px)
- iOS Safari 홈 화면 추가 지원
- Android Chrome 설치 지원
- 자동 업데이트 알림
- 설치 유도 배너 (Android 자동 / iOS 단계별 안내)

---

## 🚀 Vercel 배포 방법 (추천 · 무료)

### 1단계: GitHub에 올리기
```bash
git init
git add .
git commit -m "PWA 적용"
git remote add origin https://github.com/아이디/paran-math.git
git push -u origin main
```

### 2단계: Vercel 연결
1. https://vercel.com 접속 → GitHub 로그인
2. "New Project" → paran-math 저장소 선택
3. Framework: **Vite** 자동 감지됨
4. "Deploy" 클릭

### 3단계: 배포 완료
- 자동으로 `https://paran-math.vercel.app` 같은 주소 생성
- 이후 GitHub push 할 때마다 자동 재배포

### (선택) 커스텀 도메인 연결
- Vercel 대시보드 → Settings → Domains
- `app.파란수학.com` 같은 도메인 연결 가능

---

## 📲 학생·학부모에게 배포하는 방법

### 카카오톡으로 링크 전송
```
📱 파란수학 앱 설치 안내

아래 링크를 클릭하여 앱을 설치해 주세요!
👉 https://paran-math.vercel.app

[iPhone 사용자]
1. Safari로 링크 열기 (Chrome ❌)
2. 하단 □↑ 공유 버튼 탭
3. '홈 화면에 추가' 선택
4. '추가' 탭 → 완료!

[Android 사용자]
1. Chrome으로 링크 열기
2. 하단 '앱 설치' 배너 탭 → 완료!
   (또는 주소창 오른쪽 ⋮ → '앱 설치')
```

---

## 🔄 앱 업데이트 방법
코드 수정 후 GitHub에 push하면 **자동으로 앱이 업데이트**됩니다.
사용자는 앱을 다시 설치할 필요 없이, 다음 접속 시 "새 버전이 있습니다" 배너가 표시됩니다.

---

## 📋 PWA 체크리스트

| 항목 | 상태 |
|------|------|
| manifest.webmanifest | ✅ |
| 서비스워커 (sw.js) | ✅ |
| HTTPS 배포 (Vercel) | ✅ |
| 아이콘 192px | ✅ |
| 아이콘 512px | ✅ |
| iOS apple-touch-icon | ✅ |
| 오프라인 지원 | ✅ |
| 설치 유도 배너 | ✅ |
| 자동 업데이트 알림 | ✅ |
