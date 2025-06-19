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
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const submitBtn = document.getElementById('submitBtn');
const micIndicator = document.getElementById('micIndicator');
const timerDisplay = document.getElementById('recordedLength');
const playPauseBtn = document.getElementById('playPauseBtn');
const seekBar = document.getElementById('seekBar');
const timeDisplay = document.getElementById('timeDisplay');
const audioPreview = document.getElementById('audioPreview');

let audio = new Audio();
let isPlaying = false;

// Timer update
function updateTimerDisplay() {
    const current = getRecordedTime();
    const max = getMaxTime();
    timerDisplay.textContent = `Recorded: ${current}s / ${max}s`;
}

// Auto-preview
function previewRecording() {
    exportMergedRecording().then(blob => {
        const url = URL.createObjectURL(blob);
        audio.src = url;
        audioPreview.style.display = 'block';
        submitBtn.disabled = false;
        audio.load();
    });
}

// Sync seek bar
audio.addEventListener('timeupdate', () => {
    if (audio.duration > 0) {
        seekBar.value = (audio.currentTime / audio.duration) * 100;
        timeDisplay.textContent = formatTime(audio.currentTime);
    }
});

seekBar.addEventListener('input', () => {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
});

playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        updatePlayIcon();
    } else {
        audio.play();
        updatePauseIcon();
    }
    isPlaying = !isPlaying;
});

audio.addEventListener('ended', () => {
    isPlaying = false;
    updatePlayIcon();
});

function updatePlayIcon() {
    playPauseBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20">
            <polygon points="5,3 19,12 5,21" fill="currentColor" />
        </svg>
    `;
}

function updatePauseIcon() {
    playPauseBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20">
            <rect x="6" y="4" width="4" height="16" fill="currentColor" />
            <rect x="14" y="4" width="4" height="16" fill="currentColor" />
        </svg>
    `;
}

function updateStartIcon() {
    startBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20">
            <circle cx="12" cy="12" r="6" fill="currentColor" />
        </svg>
    `;
}

function updateContinueIcon() {
    startBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20">
            <polygon points="5,3 19,12 5,21" fill="currentColor" />
        </svg>
    `;
}

function updateResetIcon() {
    resetBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z" fill="currentColor" />
        </svg>
    `;
}

// Start recording
startBtn.addEventListener('click', () => {
    startRecording(
        () => {
            toggleRecordingUI(true, startBtn, stopBtn, micIndicator);
            startTimer(updateTimerDisplay);
        },
        () => {
            stopTimer();
            toggleRecordingUI(false, startBtn, stopBtn, micIndicator);
            updateContinueIcon();
            updateTimerDisplay();
            previewRecording();
        }
    );
});

stopBtn.addEventListener('click', stopRecording);

resetBtn.addEventListener('click', () => {
    resetRecording();
    resetTimer();
    resetUI(audioPreview, submitBtn, startBtn, stopBtn);
    updateStartIcon();
    updateResetIcon();
    updateTimerDisplay();
});

submitBtn.addEventListener('click', () => {
    alert("Message submitted! (stub)");
});

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        showTab(tabId);
    });
});

// Init icons
updateStartIcon();
updateResetIcon();
updatePlayIcon();