# 우리 아기 준비물 체크리스트

월령별(신생아~6개월) 육아용품 체크리스트. 새것/중고 구분, 쿠팡/당근 검색 링크 연결.

## 로컬에서 실행하기

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속.

## Vercel로 배포하기

1. 이 프로젝트를 GitHub 저장소에 올리기
2. https://vercel.com 에서 GitHub 계정으로 로그인
3. "New Project" → 방금 만든 저장소 선택 → Deploy
4. 별도 설정 없이 자동으로 Next.js 프로젝트를 인식해서 배포됨 (몇 분 소요)
5. 배포되면 `프로젝트명.vercel.app` 형태의 무료 URL 생성됨

## 다음에 할 일 (TODO)

- [ ] 쿠팡파트너스 가입 후, coupangUrl 함수의 검색 URL에 파트너스 어필리에이트 파라미터 추가
- [x] 체크 상태(이미 있음)를 새로고침해도 유지되도록 저장 기능 추가 (localStorage)
- [x] 방문자 수 카운팅 (Vercel Analytics) 연동
- [ ] "새것 필수" 표시한 안전 관련 항목(카시트, 매트리스, 체온계, 이유식 식기 등) 소아과/육아 전문 자료로 최종 검증
- [ ] 가격대(priceRange) 최신 시세로 업데이트
- [ ] 실제 서비스 오픈 시 통신판매업 신고 등 사업자 절차 확인

## 방문자 수 확인하는 방법

1. vercel.com 대시보드에서 baby-checklist 프로젝트 클릭
2. 상단 탭에서 "Analytics" 클릭
3. 처음이면 "Enable" 버튼이 보이는데, 눌러서 활성화 (무료 플랜은 월 일정 이벤트 수까지 무료)
4. 배포 후 방문자가 사이트에 들어오면 자동으로 집계 시작. 며칠 지나면 방문자 수, 인기 페이지 등을 볼 수 있음
5. "월령 선택" 클릭 수, "새것 구매"/"중고 찾기" 버튼 클릭 수는 Analytics 탭 안의 "Events" 항목에서 stage_selected / click_buy_new / click_find_used 이름으로 확인 가능
