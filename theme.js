// theme.js — 다크/라이트 모드 전환 (localStorage 기반 영구 저장)
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
    // 버튼 생성
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
    `;
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      apply(current === 'dark' ? 'light' : 'dark');
    });
    document.body.appendChild(btn);
  });
})();
