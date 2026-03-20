// ============================================================
//  security.js — 도파민 게임 코드 보호 스크립트
//  ※ 클라이언트 사이드 보호는 전문 개발자에 의해 우회될 수 있습니다.
//    이 스크립트는 일반 사용자 수준의 임의 수정을 방지합니다.
// ============================================================

(function() {
  'use strict';

  // ── 1. 콘솔 경고 메시지 ──────────────────────────────────
  const WARN_STYLE = 'color:#ff4444;font-size:18px;font-weight:bold;';
  const INFO_STYLE = 'color:#6c3aff;font-size:12px;';
  console.log('%c⛔ 잠깐!', WARN_STYLE);
  console.log('%c이 사이트의 코드는 저작권으로 보호됩니다.\n광고 코드(AdSense) 무단 수정 및 도용은 법적 처벌을 받을 수 있습니다.', INFO_STYLE);
  console.log('%c© 도파민 게임. All Rights Reserved.', INFO_STYLE);

  // ── 2. 우클릭 비활성화 ───────────────────────────────────
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  });

  // ── 3. 키보드 단축키 차단 ────────────────────────────────
  document.addEventListener('keydown', function(e) {
    // F12
    if (e.key === 'F12') { e.preventDefault(); return false; }
    // Ctrl+U (소스보기), Ctrl+S (저장), Ctrl+Shift+I/J/C (개발자도구)
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) { e.preventDefault(); return false; }
    if (e.ctrlKey && (e.key === 's' || e.key === 'S')) { e.preventDefault(); return false; }
    if (e.ctrlKey && e.shiftKey && (
      e.key === 'I' || e.key === 'i' ||
      e.key === 'J' || e.key === 'j' ||
      e.key === 'C' || e.key === 'c'
    )) { e.preventDefault(); return false; }
  });

  // ── 4. 텍스트 드래그 선택 방지 ───────────────────────────
  document.addEventListener('selectstart', function(e) {
    // 입력 필드는 허용
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
  });

  // ── 5. 개발자 도구 감지 (크기 기반) ──────────────────────
  (function detectDevTools() {
    const threshold = 200;
    let warned = false;
    setInterval(function() {
      const widthDiff  = window.outerWidth  - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      if ((widthDiff > threshold || heightDiff > threshold) && !warned) {
        warned = true;
        console.clear();
        console.log('%c⛔ 개발자 도구 사용이 감지되었습니다.', WARN_STYLE);
        console.log('%c이 사이트의 광고 코드 및 게임 로직 무단 복제·수정을 금지합니다.\n© 도파민 게임. All Rights Reserved.', INFO_STYLE);
      }
      if (widthDiff <= threshold && heightDiff <= threshold) {
        warned = false;
      }
    }, 1500);
  })();

  // ── 6. 이미지/캔버스 드래그 방지 ────────────────────────
  document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'CANVAS') {
      e.preventDefault();
    }
  });

})();
