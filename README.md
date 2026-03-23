# 🎓 파란수학학원 통합 관리 시스템

학생, 학부모, 선생님을 위한 스마트 학습 관리 시스템입니다.

## 🚀 Vercel 배포 방법 (가장 쉬움!)

### 방법 1: GitHub 연동 (추천)

1. **GitHub 저장소 생성**
   - GitHub에 로그인 후 새 저장소(Repository) 생성
   - 저장소 이름: `paran-math` (원하는 이름)

2. **파일 업로드**
   ```bash
   # Git 설치 후 터미널에서 실행
   cd paran-math-deploy
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/paran-math.git
   git push -u origin main
   ```

3. **Vercel 배포**
   - [Vercel](https://vercel.com) 접속 → GitHub 계정으로 로그인
   - "New Project" 클릭
   - GitHub 저장소 선택 → "Import"
   - "Deploy" 클릭 → 완료! 🎉

4. **배포 URL 확인**
   - 배포 완료 후 `https://paran-math.vercel.app` 형태의 URL 생성
   - 이 URL을 학부모/학생에게 공유!

---

### 방법 2: Vercel CLI 사용

1. **Node.js 설치**
   - [Node.js 다운로드](https://nodejs.org) → LTS 버전 설치

2. **Vercel CLI 설치 및 배포**
   ```bash
   # Vercel CLI 설치
   npm install -g vercel

   # 프로젝트 폴더로 이동
   cd paran-math-deploy

   # 의존성 설치
   npm install

   # Vercel 배포
   vercel

   # 프로덕션 배포
   vercel --prod
   ```

---

## 🌐 Netlify 배포 방법

1. **[Netlify](https://netlify.com) 접속** → 회원가입/로그인

2. **Sites 탭** → "Add new site" → "Deploy manually"

3. **빌드 후 업로드**
   ```bash
   cd paran-math-deploy
   npm install
   npm run build
   ```
   
4. **dist 폴더**를 Netlify에 드래그 & 드롭

5. **완료!** URL이 생성됩니다.

---

## 💻 로컬 개발/테스트

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

---

## 📱 기능 소개

### 👨‍💼 관리자/선생님
- 학생 관리 (등록, 수정, 삭제)
- 학습 보고서 작성 및 다운로드
- 시험/과제 관리
- 게이미피케이션 (포인트, 레벨, 뱃지)
- 대학 수준 예측
- 성격/적성 검사 & 직업 추천

### 👩‍👦 학부모
- 자녀 학습 현황 확인
- 대시보드 (성적 추이, 목표 달성)
- 학습 보고서 열람
- 상담 요청

### 👨‍🎓 학생
- 포인트/레벨/뱃지 확인
- 오답노트
- 복습 시스템
- 학습 목표 관리

---

## 🔐 기본 로그인 정보

| 역할 | ID/비밀번호 |
|-----|------------|
| 최고 관리자 | admin1234 |
| 원장 | director1234 |
| 선생님 | 선생님 이름 / 1234 (기본) |
| 학부모 | 자녀 이름 / 학부모 비밀번호 |
| 학생 | 학생 이름 / 학생 비밀번호 |

---

## 📂 프로젝트 구조

```
paran-math-deploy/
├── index.html          # HTML 템플릿
├── package.json        # 의존성 관리
├── vite.config.js      # Vite 설정
├── tailwind.config.js  # Tailwind CSS 설정
├── postcss.config.js   # PostCSS 설정
├── public/
│   └── favicon.svg     # 파비콘
└── src/
    ├── main.jsx        # React 진입점
    ├── index.css       # 전역 스타일
    └── App.jsx         # 메인 컴포넌트
```

---

## ❓ 문제 해결

### 빌드 오류 발생 시
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
npm install
npm run build
```

### 배포 후 빈 화면
- 브라우저 콘솔(F12)에서 오류 확인
- 빌드 로그 확인

---

## 📞 지원

문제가 있으면 언제든 문의해 주세요!

---

Made with ❤️ for 파란수학학원
