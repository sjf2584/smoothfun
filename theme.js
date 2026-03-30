// theme.js — 다크/라이트 모드 전환 및 유저 닉네임 표시
(function () {
  const KEY = 'sf_theme';
  const stored = localStorage.getItem(KEY) || 'dark';

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    const btn = document.getElementById('themeToggleBtn');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  // DOM이 로드되기 전에 테마 미리 적용 (깜박임 방지)
  document.documentElement.setAttribute('data-theme', stored);

  document.addEventListener('DOMContentLoaded', () => {
    // 1. 유저 닉네임 뱃지 생성 (db.js의 로직과 동일하게 fallback 지원)
    const GUEST_KEY = 'sf_guest_id';
    let guestId = localStorage.getItem(GUEST_KEY);
    if (!guestId) {
      const num = Math.floor(10000 + Math.random() * 90000);
      guestId = `Guest-${num}`;
      localStorage.setItem(GUEST_KEY, guestId);
    }

    const badge = document.createElement('div');
    badge.id = 'guestBadge';
    badge.title = '순위표에 등록될 당신의 닉네임입니다';
    // 이모지와 함께 구성
    badge.innerHTML = `<span style="opacity:0.6; margin-right:6px; font-weight:normal;">👤</span>${guestId}`;
    badge.style.cssText = `
      position:fixed; top:1rem; right:4.5rem; z-index:9999;
      background:rgba(255,255,255,.1); backdrop-filter:blur(8px);
      border:1px solid rgba(255,255,255,.2); border-radius:30px;
      padding: 0 1rem; height:40px; display:flex; align-items:center;
      font-size:.85rem; font-weight:800; color:var(--text);
      box-shadow: 0 4px 10px rgba(0,0,0,.15);
      cursor: default; user-select: none;
    `;
    document.body.appendChild(badge);

    // 2. 테마 전환 버튼 생성
    const btn = document.createElement('button');
    btn.id = 'themeToggleBtn';
    btn.title = '테마 전환';
    btn.textContent = stored === 'dark' ? '☀️' : '🌙';
    btn.style.cssText = `
      position:fixed; top:1rem; right:1rem; z-index:9999;
      background:rgba(255,255,255,.1); backdrop-filter:blur(8px);
      border:1px solid rgba(255,255,255,.2); border-radius:50%;
      width:40px; height:40px; font-size:1.1rem;
      cursor:pointer; transition:all .2s; line-height:1;
      display:flex; align-items:center; justify-content:center;
      box-shadow: 0 4px 10px rgba(0,0,0,.15);
    `;
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      apply(current === 'dark' ? 'light' : 'dark');
    });
    document.body.appendChild(btn);
  });
})();
