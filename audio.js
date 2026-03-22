// audio.js — 전역 공통 오디오 이펙트 엔진 (Web Audio API)
const sfAudio = (function() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let ctx = null;

  function init() {
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();
  }

  function play(type) {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    if (type === 'tap') {
      // 짧고 가벼운 탭 (UI 클릭 등)
      osc.type = 'sine'; osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now); osc.stop(now + 0.05);
    } else if (type === 'pass' || type === 'success') {
      // 띠리링 상승음 (성공, 레벨업)
      osc.type = 'square'; osc.frequency.setValueAtTime(400, now); osc.frequency.setValueAtTime(600, now + 0.1);
      gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.2);
      osc.start(now); osc.stop(now + 0.2);
    } else if (type === 'fail' || type === 'wrong') {
      // 웅~ 하락음 (실패, 게임오버)
      osc.type = 'square'; osc.frequency.setValueAtTime(200, now); osc.frequency.exponentialRampToValueAtTime(50, now + 0.4);
      gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now); osc.stop(now + 0.4);
    } else if (type === 'tick') {
      // 짧은 틱 (타이머)
      osc.type = 'sine'; osc.frequency.setValueAtTime(1000, now);
      gain.gain.setValueAtTime(0.05, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now); osc.stop(now + 0.05);
    } else if (type === 'result' || type === 'gold') {
      // 번쩍! 강렬한 하이라이트 (최종 결과, 정답 신호)
      osc.type = 'sine'; osc.frequency.setValueAtTime(1200, now); osc.frequency.exponentialRampToValueAtTime(2000, now + 0.1);
      gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'fake') {
      // 기분 나쁜 삐- (가짜 신호)
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now); osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
      gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now); osc.stop(now + 0.15);
    }
  }

  // 브라우저 AudioContext 자동 해제 (첫 클릭 시)
  const unlock = () => {
    init();
    document.removeEventListener('pointerdown', unlock);
    document.removeEventListener('keydown', unlock);
  };
  document.addEventListener('pointerdown', unlock);
  document.addEventListener('keydown', unlock);

  return { init, play };
})();
window.sfAudio = sfAudio;
