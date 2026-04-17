// theme.js — 다크/라이트 모드 전환, 유저 닉네임 표시, 및 마스터 볼륨 통합
(function () {
  const KEY = 'sf_theme';
  const VOL_KEY = 'sf_master_volume';
  const GUEST_KEY = 'sf_guest_id';
  
  const stored = localStorage.getItem(KEY) || 'light';
  
  // 마스터 볼륨 로드 (기본값 50%)
  window.masterVolume = parseFloat(localStorage.getItem(VOL_KEY));
  if (isNaN(window.masterVolume)) window.masterVolume = 0.5;

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    const btn = document.getElementById('themeToggleBtn');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  // DOM이 로드되기 전에 테마 미리 적용 (깜박임 방지)
  document.documentElement.setAttribute('data-theme', stored);

  document.addEventListener('DOMContentLoaded', () => {
    // 1. 공통 상단 플렉스 컨테이너
    const container = document.createElement('div');
    container.style.cssText = `
      position:fixed; top:1rem; right:1rem; z-index:9999;
      display:flex; align-items:center; gap:0.5rem;
    `;
    
    // 2. 유저 닉네임 뱃지 생성
    let guestId = localStorage.getItem(GUEST_KEY);
    if (!guestId) {
      guestId = `Guest-${Math.floor(10000 + Math.random() * 90000)}`;
      localStorage.setItem(GUEST_KEY, guestId);
    }
    const badge = document.createElement('div');
    badge.id = 'guestBadge';
    badge.title = '순위표에 등록될 당신의 닉네임입니다';
    badge.innerHTML = `<span style="opacity:0.6; margin-right:6px; font-weight:normal;">👤</span>${guestId}`;
    badge.style.cssText = `
      background:rgba(255,255,255,.1); backdrop-filter:blur(8px);
      border:1px solid rgba(255,255,255,.2); border-radius:30px;
      padding: 0 1rem; height:40px; display:flex; align-items:center;
      font-size:.85rem; font-weight:800; color:var(--text);
      box-shadow: 0 4px 10px rgba(0,0,0,.15);
      cursor: default; user-select: none;
    `;
    container.appendChild(badge);

    // 3. 글로벌 볼륨 제어기 생성
    const volWrap = document.createElement('div');
    volWrap.style.cssText = `
      background:rgba(255,255,255,.1); backdrop-filter:blur(8px);
      border:1px solid rgba(255,255,255,.2); border-radius:30px;
      padding: 0 12px; height:40px; display:flex; align-items:center; gap: 8px;
      box-shadow: 0 4px 10px rgba(0,0,0,.15); color:var(--text);
    `;
    const volIcon = document.createElement('span');
    volIcon.innerHTML = window.masterVolume > 0 ? '🔊' : '🔇';
    volIcon.style.cssText = `font-size: 1.1rem; cursor: pointer; line-height:1; user-select:none; filter:grayscale(0);`;
    
    const volSlider = document.createElement('input');
    volSlider.type = 'range';
    volSlider.min = '0'; volSlider.max = '1'; volSlider.step = '0.01';
    volSlider.value = window.masterVolume;
    volSlider.style.cssText = `width: 70px; cursor: pointer; accent-color: var(--accent); margin:0;`;
    
    const updateVol = (val) => {
      window.masterVolume = parseFloat(val);
      localStorage.setItem(VOL_KEY, window.masterVolume);
      volIcon.innerHTML = window.masterVolume > 0 ? '🔊' : '🔇';
      // 현재 열려있는 HTML의 모든 <audio> 태그에 즉각 적용
      const audios = document.querySelectorAll('audio');
      audios.forEach(a => a.volume = window.masterVolume);
    };
    
    volSlider.addEventListener('input', (e) => updateVol(e.target.value));
    volIcon.addEventListener('click', () => {
      if (window.masterVolume > 0) {
        volSlider.dataset.prev = window.masterVolume;
        volSlider.value = 0;
        updateVol(0);
      } else {
        const p = volSlider.dataset.prev || 0.5;
        volSlider.value = p;
        updateVol(p);
      }
    });
    
    volWrap.appendChild(volIcon);
    volWrap.appendChild(volSlider);
    container.appendChild(volWrap);

    // 4. 테마 전환 버튼 생성
    const btn = document.createElement('button');
    btn.id = 'themeToggleBtn';
    btn.title = '테마 전환 (다크/라이트)';
    btn.textContent = stored === 'dark' ? '☀️' : '🌙';
    btn.style.cssText = `
      background:rgba(255,255,255,.1); backdrop-filter:blur(8px);
      border:1px solid rgba(255,255,255,.2); border-radius:50%;
      width:40px; height:40px; font-size:1.1rem; color:var(--text);
      cursor:pointer; transition:all .2s; line-height:1;
      display:flex; align-items:center; justify-content:center;
      box-shadow: 0 4px 10px rgba(0,0,0,.15);
    `;
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      apply(current === 'dark' ? 'light' : 'dark');
    });
    container.appendChild(btn);
    
    // 바디에 병합 컨테이너 최종 추가
    document.body.appendChild(container);
  });
})();
