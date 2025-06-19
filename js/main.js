// main.js — connects UI, timer, and recording logic

import {
  startRecording,
  stopRecording,
  resetRecording,
  exportMergedRecording
} from './record.js';

import {
  startTimer,
  stopTimer,
  resetTimer,
  getMaxTime
} from './timer.js';

import {
  toggleRecordingUI,
  resetUI,
  showTab
} from './ui.js';

// DOM Elements
const startBtn      = document.getElementById('startBtn');
const stopBtn       = document.getElementById('stopBtn');
const resetBtn      = document.getElementById('resetBtn');
const submitBtn     = document.getElementById('submitBtn');
const micIndicator  = document.getElementById('micIndicator');
const timeLeftEl    = document.getElementById('timeLeft');
const playPauseBtn  = document.getElementById('playPauseBtn');
const seekBar       = document.getElementById('seekBar');
const timeDisplay   = document.getElementById('timeDisplay');
const audioPreview  = document.getElementById('audioPreview');
const micStatus     = document.getElementById('micStatus');

let audio     = new Audio();
let isPlaying = false;

// Format seconds as M:SS
function formatTime(sec) {
  const m = Math.floor(sec/60);
  const s = Math.floor(sec%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

// Preview merged recording
function previewRecording() {
  exportMergedRecording().then(blob => {
    audioPreview.style.display = 'flex';
    submitBtn.disabled = false;
    audio.src = URL.createObjectURL(blob);
    audio.load();
  });
}

// Sync seek-bar & play/pause
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  seekBar.value = (audio.currentTime / audio.duration)*100;
  timeDisplay.textContent = formatTime(audio.currentTime);
});
seekBar.addEventListener('input', () => {
  if (!audio.duration) return;
  audio.currentTime = (seekBar.value/100)*audio.duration;
});
playPauseBtn.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause(); updatePlayIcon();
  } else {
    audio.play();  updatePauseIcon();
  }
  isPlaying = !isPlaying;
});
audio.addEventListener('ended', () => {
  isPlaying = false; updatePlayIcon();
});

// Icon helper functions
function updatePlayIcon() {
  playPauseBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20">
      <polygon points="5,3 19,12 5,21" fill="currentColor"/>
    </svg>
  `;
}
function updatePauseIcon() {
  playPauseBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20">
      <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
      <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
    </svg>
  `;
}
function updateStartIcon() {
  startBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20">
      <circle cx="12" cy="12" r="6" fill="currentColor"/>
    </svg>
  `;
}
function updateContinueIcon() {
  startBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20">
      <polygon points="5,3 19,12 5,21" fill="currentColor"/>
    </svg>
  `;
}
function updateResetIcon() {
  resetBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z" fill="currentColor"/>
    </svg>
  `;
}

// Check mic permission at load
async function checkMicPermissions() {
  try {
    const s = await navigator.mediaDevices.getUserMedia({audio:true});
    s.getTracks().forEach(t=>t.stop());
    micStatus.textContent = '';
  } catch {
    micStatus.textContent = '🎤 Mic needed. Click to retry.';
    micStatus.style.cursor = 'pointer';
    micStatus.onclick = () => {
      micStatus.textContent = 'Re-checking…';
      checkMicPermissions();
    };
  }
}

// START button — preserves remaining time
startBtn.addEventListener('click', () => {
  navigator.mediaDevices.getUserMedia({audio:true})
    .then(s => {
      s.getTracks().forEach(t=>t.stop());
      micIndicator.style.display = 'flex';
      timeLeftEl.textContent = `${getMaxTime()}s left`;

      startRecording(
        () => {
          toggleRecordingUI(true,startBtn,stopBtn,micIndicator);
          startTimer(sec => {
            const left = getMaxTime() - sec;
            timeLeftEl.textContent = `${Math.max(0,left)}s left`;
          });
          micStatus.textContent = '';
        },
        () => {
          stopTimer();
          toggleRecordingUI(false,startBtn,stopBtn,micIndicator);
          updateContinueIcon();
          micIndicator.style.display = 'none';
          previewRecording();
        }
      );
    })
    .catch(() => {
      micStatus.textContent = '🎤 Denied. Click to try again.';
      micStatus.style.cursor = 'pointer';
    });
});

// STOP button
stopBtn.addEventListener('click', stopRecording);

// RESET button
resetBtn.addEventListener('click', () => {
  resetRecording();
  resetTimer();
  resetUI(audioPreview, submitBtn, startBtn, stopBtn);
  updateStartIcon();
  updateResetIcon();
  micIndicator.style.display = 'none';
  timeLeftEl.textContent = `${getMaxTime()}s left`;
});

// SUBMIT stub
submitBtn.addEventListener('click', () => {
  alert("Message submitted! (stub)");
});

// TAB switching
document.querySelectorAll('.tab-btn').forEach(btn =>
  btn.addEventListener('click', () => showTab(btn.dataset.tab))
);

// Initialize icons & permission check
updateStartIcon();
updateResetIcon();
updatePlayIcon();
checkMicPermissions();