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
  const startBtn     = document.getElementById('startBtn');
  const stopBtn      = document.getElementById('stopBtn');
  const resetBtn     = document.getElementById('resetBtn');
  const submitBtn    = document.getElementById('submitBtn');
  const micIndicator = document.getElementById('micIndicator');
  const timeLeftEl   = document.getElementById('timeLeft');
  const micStatus    = document.getElementById('micPermissionStatus');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const seekBar      = document.getElementById('seekBar');
  const timeDisplay  = document.getElementById('timeDisplay');
  const audioPreview = document.getElementById('audioPreview');
  
  let audio = new Audio();
  let isPlaying = false;
  
  // --- Icon helpers ---
  function updatePlayIcon() {
    playPauseBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20">
        <polygon points="5,3 19,12 5,21" fill="currentColor" />
      </svg>`;
  }
  function updatePauseIcon() {
    playPauseBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20">
        <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
        <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
      </svg>`;
  }
  function updateStartIcon() {
    startBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20">
        <circle cx="12" cy="12" r="6" fill="currentColor"/>
      </svg>`;
  }
  function updateContinueIcon() {
    startBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20">
        <polygon points="5,3 19,12 5,21" fill="currentColor"/>
      </svg>`;
  }
  function updateResetIcon() {
    resetBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6
                 s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8
                 s8-3.6 8-8-3.6-8-8-8z" fill="currentColor" />
      </svg>`;
  }
  
  // --- Time formatting ---
  function formatTime(sec) {
    const m = Math.floor(sec/60);
    const s = String(Math.floor(sec%60)).padStart(2,'0');
    return `${m}:${s}`;
  }
  
  // --- Preview merged audio ---
  function previewRecording() {
    exportMergedRecording().then(blob => {
      const url = URL.createObjectURL(blob);
      audioPreview.style.display = 'flex';
      submitBtn.disabled = false;
      audio.src = url;
      audio.load();
    });
  }
  
  // --- Custom audio controls syncing ---
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    seekBar.value = (audio.currentTime/audio.duration)*100;
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
      audio.play(); updatePauseIcon();
    }
    isPlaying = !isPlaying;
  });
  audio.addEventListener('ended', () => {
    isPlaying = false; updatePlayIcon();
  });
  
  // --- Check mic ahead of time ---
  async function checkMicPermissions() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      s.getTracks().forEach(t => t.stop());
      micStatus.hidden = true;
    } catch {
      micStatus.hidden = false;
      micStatus.textContent = 'Mic needed. Click to retry.';
      micStatus.style.cursor = 'pointer';
      micStatus.onclick = () => {
        micStatus.textContent = 'Re-checking…';
        checkMicPermissions();
      };
    }
  }
  
  // --- Record button -- only asks once, resumes counter ---
  startBtn.addEventListener('click', () => {
    micIndicator.style.display = 'flex';
    // show remaining
    const used = startTimer._recorded || 0;
    timeLeftEl.textContent = `${getMaxTime()-used}s left`;
  
    startRecording(
      success => {
        if (!success) {
          micStatus.hidden = false;
          micStatus.textContent = 'Access denied. Click to retry.';
          return;
        }
        micStatus.hidden = true;
        toggleRecordingUI(true, startBtn, stopBtn, micIndicator);
        startTimer(sec => {
          const left = Math.max(0, getMaxTime()-sec);
          timeLeftEl.textContent = `${left}s left`;
        });
        updateContinueIcon();
      },
      () => {
        stopTimer();
        toggleRecordingUI(false, startBtn, stopBtn, micIndicator);
        micIndicator.style.display = 'none';
        previewRecording();
      }
    );
  });
  
  // --- Stop / Reset / Submit ---
  stopBtn.addEventListener('click', stopRecording);
  
  resetBtn.addEventListener('click', () => {
    resetRecording();
    resetTimer();
    resetUI(audioPreview, submitBtn, startBtn, stopBtn);
    micIndicator.style.display = 'none';
    timeLeftEl.textContent = `${getMaxTime()}s left`;
    updateStartIcon();
    updateResetIcon();
  });
  
  submitBtn.addEventListener('click', () => {
    alert('Message submitted! (stub)');
  });
  
  // --- Tabs ---
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => showTab(btn.dataset.tab));
  });
  
  // --- Init ---
  updateStartIcon();
  updateResetIcon();
  updatePlayIcon();
  checkMicPermissions();