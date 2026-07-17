// ⚠️ Firebase 설정값 — 아래 값을 본인 Firebase 프로젝트 값으로 교체하세요.
// 설정 방법은 Firebase_설정법.md 참고 (약 3~5분 소요, 무료, 카드 등록 불필요)
var firebaseConfig = {
  apiKey: "AIzaSyBXyLUJJwiMCpe_1QxPwvIy25p4MM7VD7c",
  authDomain: "london-trip-83b9d.firebaseapp.com",
  projectId: "london-trip-83b9d",
  storageBucket: "london-trip-83b9d.firebasestorage.app",
  messagingSenderId: "935712734022",
  appId: "1:935712734022:web:21cace84298b30233d4347"
};

// 위 값을 교체하면 자동으로 true가 되어 메모 기능이 활성화됩니다.
var FIREBASE_READY = firebaseConfig.apiKey !== "london-trip-83b9d";
