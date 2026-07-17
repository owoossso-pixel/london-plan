# 팀 메모 기능 설정법 (Firebase, 무료, 약 3~5분)

이 앱의 "팀 메모" 기능은 Firebase Realtime Database를 씁니다. 아래 순서대로 한 번만 설정하면, `firebase-config.js`에 값을 채우기 전까지는 메모창에
"Firebase 설정이 아직 안 되어있어요"라는 안내만 뜨고 나머지 기능(지도, 일정)은 정상 작동합니다.

## 1. 프로젝트 만들기
1. https://console.firebase.google.com 접속 → 구글 계정으로 로그인
2. "프로젝트 추가" 클릭 → 이름 입력 (예: `london-trip`) → Google 애널리틱스는 꺼도 무방 → 만들기

## 2. 웹 앱 등록
1. 프로젝트 개요 화면에서 `</>` (웹) 아이콘 클릭
2. 앱 닉네임 아무거나 입력 (예: `london`) → "Firebase 호스팅 설정"은 체크 안 해도 됨 → 앱 등록
3. 화면에 나오는 `firebaseConfig = {...}` 객체를 통째로 복사

## 3. Realtime Database 켜기
1. 왼쪽 메뉴 → 빌드 → Realtime Database → 데이터베이스 만들기
2. 위치는 아무 곳이나(가까운 지역 권장) → 시작 모드는 **테스트 모드**로 선택 (친구들끼리 짧은 기간 쓰는 용도라 무난함)
3. 만들어지면 상단에 `https://프로젝트ID-default-rtdb.firebaseio.com` 형태의 URL이 보임 — 이게 `databaseURL`

## 4. 값 붙여넣기
이 폴더의 `firebase-config.js` 파일을 열어서 2번에서 복사한 값으로 아래 부분을 교체:
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXyLUJJwiMCpe_1QxPwvIy25p4MM7VD7c",
  authDomain: "london-trip-83b9d.firebaseapp.com",
  projectId: "london-trip-83b9d",
  storageBucket: "london-trip-83b9d.firebasestorage.app",
  messagingSenderId: "935712734022",
  appId: "1:935712734022:web:21cace84298b30233d4347"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
```js
var firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

저장하면 `FIREBASE_READY`가 자동으로 `true`가 되면서 메모 기능이 켜집니다.

## 5. (선택) 규칙 조금 더 안전하게
테스트 모드는 30일 후 만료되며 그 전까지는 누구나 읽고 쓸 수 있습니다. 여행 기간이 짧으니 기본값이면 충분하지만,
더 안전하게 하려면 Realtime Database → 규칙 탭에서 아래처럼 바꿔도 됩니다 (여전히 로그인 없이 쓰지만 구조를 제한):

```json
{
  "rules": {
    "london-trip-notes": {
      ".read": true,
      ".write": true,
      ".indexOn": ["ts"]
    }
  }
}
```

## 6. 팀원과 공유하기
`london_plan.html`(또는 `index.html`)을 GitHub Pages, Netlify, Vercel 등 아무 정적 호스팅에 올려서 팀원들에게 같은 링크를 보내주면
전부 같은 Firebase 데이터베이스를 보게 되어 실시간으로 메모가 동기화됩니다. (파일을 그냥 더블클릭해서 로컬로 열어도 동작은 하지만, 팀원마다 다른 파일을 열게 되므로 반드시 웹에 올려서 같은 링크로 공유해야 합니다.)
