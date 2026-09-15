# Airbnb Clone — Frontend

숙박 예약 플랫폼의 웹 클라이언트입니다. 게스트의 숙소 검색·예약과 호스트의 숙소 등록 흐름을 구현했습니다.

## 기술 스택

React 19 · Vite 7 · React Router 7 · Zustand · Tailwind CSS 4 · shadcn/ui · Recharts · react-day-picker

## 주요 화면

| 경로 | 내용 |
|---|---|
| `/` | 메인, 숙소 검색·인기 숙소 |
| `/room/:accommodationId` | 숙소 상세, 예약 |
| `/reservation/:reservationCode` | 예약 상세 |
| `/profile` · `/profile/bookings` · `/profile/wishlists` | 프로필, 예약 내역, 위시리스트 |
| `/message` · `/message/:reservationCode` | 메시지 목록·작성 |
| `/review/:reservationCode/write` | 리뷰 작성 |
| `/hosting/...` | 숙소 등록(구조·위치·편의시설·사진·요금 등 단계별 입력), 호스팅 목록·수정 |
| `/sign-up` · `/log-in` | 회원가입, 로그인 |

## 실행

```bash
npm install
npm run dev            # http://localhost:5173
```

백엔드 주소는 소스 코드에 `http://192.168.0.17:8080`으로 들어 있습니다. 로컬에서 실행할 때는 이 값을 본인 환경에 맞게 바꿔 주세요.

## 관련 저장소

- Backend: https://github.com/carino2000/Airbnb-Clone
