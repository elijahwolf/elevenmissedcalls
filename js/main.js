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
  
  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  }
  
  function updateTimerDisplay() {
    const current = getRecordedTime();
    const max = getMaxTime();
    timerDisplay.textContent = `Recorded: ${current}s / ${max}s`;
  }
  
  function updateSeekBarProgress() {
    const value = (seekBar.value / seekBar.max) * 100;
    seekBar.style.setProperty('--progress', `${value}%`);
  }
  
  function previewRecording() {
    exportMergedRecording().then(blob => {
      const url = URL.createObjectURL(blob);
      audio.src = url;
      audioPreview.style.display = 'block';
      submitBtn.disabled = false;
      audio.load();
    });
  }
  
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      seekBar.value = (audio.currentTime / audio.duration) * 100;
      updateSeekBarProgress();
      timeDisplay.textContent = formatTime(audio.currentTime);
    }
  });
  
  seekBar.addEventListener('input', () => {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
    updateSeekBarProgress();
  });
  
  playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      playPauseBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20">
          <polygon points="5,3 19,12 5,21" fill="currentColor" />
        </svg>`;
    } else {
      audio.play();
      playPauseBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20">
          <rect x="6" y="4" width="4" height="16" fill="currentColor"></rect>
          <rect x="14" y="4" width="4" height="16" fill="currentColor"></rect>
        </svg>`;
    }
    isPlaying = !isPlaying;
  });
  
  audio.addEventListener('ended', () => {
    isPlaying = false;
    playPauseBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20">
        <polygon points="5,3 19,12 5,21" fill="currentColor" />
      </svg>`;
  });
  
  startBtn.addEventListener('click', () => {
    startRecording(
      () => {
        toggleRecordingUI(true, startBtn, stopBtn, micIndicator);
        startTimer(updateTimerDisplay);
      },
      () => {
        stopTimer();
        toggleRecordingUI(false, startBtn, stopBtn, micIndicator);
        startBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="20" height="20">
            <circle cx="12" cy="12" r="10" fill="currentColor" />
          </svg>`;
        updateTimerDisplay();
        previewRecording();
      }
    );
  });
  
  stopBtn.addEventListener('click', () => {
    stopRecording();
  });
  
  resetBtn.addEventListener('click', () => {
    resetRecording();
    resetTimer();
    resetUI(audioPreview, submitBtn, startBtn, stopBtn);
    startBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20">
        <polygon points="5,3 19,12 5,21" fill="currentColor" />
      </svg>`;
    updateTimerDisplay();
    audio.src = '';
    seekBar.value = 0;
    updateSeekBarProgress();
    timeDisplay.textContent = '0:00';
    isPlaying = false;
    playPauseBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20">
        <polygon points="5,3 19,12 5,21" fill="currentColor" />
      </svg>`;
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