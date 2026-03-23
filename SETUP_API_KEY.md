# 🔑 AI 분석 기능 활성화 방법

## Anthropic API 키 발급
1. https://console.anthropic.com 접속 → 로그인
2. "API Keys" 메뉴 → "Create Key" 클릭
3. 키 이름 입력 후 생성 → 복사해 두기

## Vercel 환경 변수 설정
1. https://vercel.com 접속 → paran-math 프로젝트 클릭
2. 상단 **Settings** 탭 → 좌측 **Environment Variables**
3. 아래 내용 입력 후 **Save** 클릭:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...` (발급받은 키)
   - Environment: Production, Preview, Development 모두 체크

4. **Deployments** 탭 → 최신 배포 우측 `···` → **Redeploy** 클릭

## 확인
배포 완료 후 선생님 통계 → 개별 학생 분석 → AI 분석 실행 버튼 클릭 시 정상 작동 확인
