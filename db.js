import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, get, push, remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAGLmQxbqGjtbog8O3caRky-6GZLuvjDxI",
  authDomain: "smoothfun.firebaseapp.com",
  databaseURL: "https://smoothfun-default-rtdb.firebaseio.com",
  projectId: "smoothfun",
  storageBucket: "smoothfun.firebasestorage.app",
  messagingSenderId: "188626382329",
  appId: "1:188626382329:web:56932b79b7025cb557a128"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 대한민국 시간 기준 YYYY-MM-DD 가져오기
function getTodayStr() {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const kst = new Date(utc + (9 * 3600000));
  const y = kst.getFullYear();
  const m = String(kst.getMonth() + 1).padStart(2, '0');
  const dd = String(kst.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

// 1. 과거 스코어 초기화 (오늘 날짜가 아닌 폴더 삭제)
async function cleanupOldData() {
  try {
    const today = getTodayStr();
    const snap = await get(ref(db, 'leaderboard'));
    if (!snap.exists()) return;
    
    const dates = snap.val();
    for (const dateKey in dates) {
      if (dateKey < today) {
        await remove(ref(db, `leaderboard/${dateKey}`));
        console.log(`[DB] Cleaned up old data: ${dateKey}`);
      }
    }
  } catch(e) { console.error('[DB] Cleanup error', e); }
}

// 2. 랭킹 가져오기
// order: 'desc' (높을수록 좋음 - 정확도, 점수)
// order: 'asc'  (낮을수록 좋음 - 오차 시간)
async function getTop10(gameId, category, order = 'desc') {
  try {
    const today = getTodayStr();
    const snap = await get(ref(db, `leaderboard/${today}/${gameId}/${category}`));
    if (!snap.exists()) return [];
    
    const data = snap.val();
    let list = Object.keys(data).map(k => ({ id:k, ...data[k] }));
    
    if (order === 'desc') {
      list.sort((a,b) => b.score - a.score || a.timestamp - b.timestamp);
    } else {
      list.sort((a,b) => a.score - b.score || a.timestamp - b.timestamp);
    }
    
    return list.slice(0, 10);
  } catch(e) {
    console.error('[DB] getTop10 error', e);
    return [];
  }
}

// 3. 기록 저장
async function saveScore(gameId, category, name, score, extraText) {
  try {
    const today = getTodayStr();
    await push(ref(db, `leaderboard/${today}/${gameId}/${category}`), {
      name,
      score,
      extraText,
      timestamp: Date.now()
    });
  } catch(e) { console.error('[DB] saveScore error', e); }
}

// 4. Top 10 진입 가능성 판단
async function isTop10(gameId, category, myScore, order = 'desc') {
  try {
    const list = await getTop10(gameId, category, order);
    if (list.length < 10) return true;
    
    const worstScore = list[list.length - 1].score;
    if (order === 'desc') {
      return myScore > worstScore;
    } else {
      return myScore < worstScore;
    }
  } catch(e) { return false; }
}

// Global API 등록 (인라인 HTML 스크립트에서 자유롭게 호출 가능)
window.dbAPI = {
  getTop10,
  saveScore,
  isTop10
};

// 페이지 로드 시 백그라운드에서 하루 전 데이터 정리 수행
cleanupOldData();
