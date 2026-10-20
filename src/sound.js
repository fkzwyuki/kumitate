// 効果音（Web Audio で作る。音声ファイルなし）と振動。読み上げは使わない（DESIGN.md D5）
import { CFG } from './config.js?v=6250ca2';

let ac = null;

function audio() {
  if (!ac) {
    try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ac = null; }
  }
  if (ac && ac.state === 'suspended') { try { ac.resume(); } catch (e) { /* 何もしない */ } }
  return ac;
}

/** 最初のタップのあとから音を鳴らせるようにする（ブラウザの決まり）*/
export function unlock() { audio(); }

function tone(freq, dur, type = 'square', vol = 0.15, when = 0) {
  const a = audio(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.value = freq;
  const t = a.currentTime + when;
  g.gain.setValueAtTime(vol * CFG.SOUND_VOLUME, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur);
}

// パチンの「パッ」という短いノイズ
function snapNoise() {
  const a = audio(); if (!a) return;
  const n = Math.floor(a.sampleRate * 0.05), b = a.createBuffer(1, n, a.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 4);
  const s = a.createBufferSource(); s.buffer = b;
  const f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2200;
  const g = a.createGain(); g.gain.value = 0.6 * CFG.SOUND_VOLUME;
  s.connect(f).connect(g).connect(a.destination); s.start();
}

export const SND = {
  pop()  { snapNoise(); tone(1400, 0.05, 'triangle', 0.12); },                        // パチン（外れる）
  click(){ tone(1800, 0.04, 'square', 0.12); tone(2600, 0.05, 'square', 0.1, 0.05); }, // カチッ（はまる）
  huh()  { tone(440, 0.16, 'sine', 0.1); tone(587, 0.26, 'sine', 0.1, 0.14); },        // あれ？（入れ忘れ。やわらかい2音で、だんだん上がる）
  back() { tone(700, 0.08, 'sine', 0.1); tone(500, 0.1, 'sine', 0.1, 0.06); },         // 戻る
  fanfare() {                                                                          // できた！
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.25, 'triangle', 0.18, i * 0.13));
    tone(1047, 0.6, 'triangle', 0.18, 0.55);
  },
};

/** 振動（対応端末だけ）*/
export function buzz(pattern) {
  try {
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;   // まだ一度もさわっていないときは鳴らさない（ブラウザが警告を出すので）
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch (e) { /* 何もしない */ }
}

KP.sound = { SND, buzz, unlock };
