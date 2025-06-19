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
getRecordedTime,
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

// Mic permission banner
//const micStatus = document.getElementById('micPermissionStatus');

let audio     = new Audio();
let isPlaying = false;

// Helper to format mm:ss
function formatTime(sec) {
const m = Math.floor(sec/60);
const s = Math.floor(sec%60).toString().padStart(2,'0');
return `${m}:${s}`;
}

// ICON DRAWERS
function updateStartIcon() {
startBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20">
    <circle cx="12" cy="12" r="6" fill="currentColor"/>
    </svg>`;
}
function updatePauseIcon() {
playPauseBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20">
    <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
    <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
    </svg>`;
}
function updatePlayIcon() {
playPauseBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20">
    <polygon points="5,3 19,12 5,21" fill="currentColor"/>
    </svg>`;
}
function updateResetIcon() {
resetBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M12 5V1L7 6l5 5V7
                c3.3 0 6 2.7 6 6s-2.7 6-6 6
                -6-2.7-6-6H4c0 4.4 3.6 8 8 8
                s8-3.6 8-8-3.6-8-8-8z"
            fill="currentColor"/>
    </svg>`;
}

// PREVIEW MERGED RECORDING
function previewRecording() {
exportMergedRecording().then(blob => {
    audioPreview.style.display = 'flex';
    submitBtn.disabled = false;
    audio.src = URL.createObjectURL(blob);
    audio.load();
});
}

// SYNC custom audio controls
audio.addEventListener('timeupdate', () => {
if (!audio.duration) return;
seekBar.value = (audio.currentTime/audio.duration)*100;
timeDisplay.textContent = formatTime(audio.currentTime);
});
seekBar.addEventListener('input', () => {
if (!audio.duration) return;
audio.currentTime = (seekBar.value/100)*audio.duration;
});
['click', 'touchend'].forEach(evt =>
    playPauseBtn.addEventListener(evt, e => {
      e.preventDefault();            // kill the ghost-click
      if (isPlaying) {
        audio.pause();
        updatePlayIcon();
      } else {
        audio.play();
        updatePauseIcon();
      }
      isPlaying = !isPlaying;
    })
  );
audio.addEventListener('ended', () => {
isPlaying = false;
updatePlayIcon();
});

// CHECK MIC PERMISSIONS ON LOAD
/* async function checkMicPermissions() {
try {
    const s = await navigator.mediaDevices.getUserMedia({ audio: true });
    s.getTracks().forEach(t=>t.stop());
    micStatus.hidden = true;
} catch {
    micStatus.hidden = false;
    micStatus.textContent = 'mic needed. click to retry.';
    micStatus.style.cursor = 'pointer';
    micStatus.onclick = () => {
    micStatus.textContent = 're-checking…';
    checkMicPermissions();
    };
}
}*/

// START RECORD
startBtn.addEventListener('click', () => {
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(s => {
    s.getTracks().forEach(t=>t.stop());
    micIndicator.classList.add('active');
    const already = getRecordedTime();            // how many seconds already recorded
    const remaining = Math.max(0, getMaxTime() - already);
    timeLeftEl.textContent = `${remaining}s left`;
    startRecording(
        () => {
        toggleRecordingUI(true, startBtn, stopBtn, micIndicator);
        startTimer(sec => {
            const left2 = Math.max(0, getMaxTime() - sec);
            timeLeftEl.textContent = `${left2}s left`;
        });
        micStatus.hidden = true;
        },
        () => {
        stopTimer();
        toggleRecordingUI(false, startBtn, stopBtn, micIndicator);
        // ← HERE: keep the circle record icon
        updateStartIcon();  
        micIndicator.style.display = 'none';
        previewRecording();
        }
    );
    })
    .catch(() => {
    micStatus.hidden = false;
    micStatus.textContent = '🔇 Denied. Click to retry.';
    micStatus.style.cursor = 'pointer';
    });
});

// STOP
stopBtn.addEventListener('click', stopRecording);

// RESET
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

// TABS
document.querySelectorAll('.tab-btn').forEach(btn =>
btn.addEventListener('click', () => showTab(btn.dataset.tab))
);

// INIT
updateStartIcon();
updateResetIcon();
updatePlayIcon();
//checkMicPermissions();