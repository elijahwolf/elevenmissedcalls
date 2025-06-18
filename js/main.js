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
    seekBar.value = (audio.currentTime / audio.duration) * 100;
    timeDisplay.textContent = formatTime(audio.currentTime);
  });
  
  seekBar.addEventListener('input', () => {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
  });
  
  playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      playPauseBtn.textContent = '▶';
    } else {
      audio.play();
      playPauseBtn.textContent = '⏸';
    }
    isPlaying = !isPlaying;
  });
  
  audio.addEventListener('ended', () => {
    isPlaying = false;
    playPauseBtn.textContent = '▶';
  });
  
  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
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
        startBtn.textContent = 'Continue Recording';
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
    startBtn.textContent = 'Start Recording';
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