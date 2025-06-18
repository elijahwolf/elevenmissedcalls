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
  const player = document.getElementById('player');
  const micIndicator = document.getElementById('micIndicator');
  const timerDisplay = document.getElementById('recordedLength');
  
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
      player.src = url;
      player.style.display = 'block';
      submitBtn.disabled = false;
    });
  }
  
  // Start recording
  startBtn.addEventListener('click', () => {
    startRecording(
      () => {
        toggleRecordingUI(true, startBtn, stopBtn, micIndicator);
        startTimer(updateTimerDisplay);
        startBtn.textContent = "Continue Recording";
      },
      () => {
        stopTimer();
        toggleRecordingUI(false, startBtn, stopBtn, micIndicator);
        updateTimerDisplay();
        previewRecording(); // triggered AFTER audio saved
      }
    );
  });
  
  // Stop only
  stopBtn.addEventListener('click', () => {
    stopRecording();
  });
  
  // Reset
  resetBtn.addEventListener('click', () => {
    resetRecording();
    resetTimer();
    resetUI(player, submitBtn, startBtn, stopBtn);
    startBtn.textContent = "Start Recording";
    updateTimerDisplay();
  });
  
  // Submit
  submitBtn.addEventListener('click', () => {
    alert("Message submitted! (stub)");
  });
  
  // Tab switching — now using event delegation
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      showTab(tabId);
    });
  });