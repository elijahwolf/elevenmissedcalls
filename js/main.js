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
  startBtn.onclick = () => {
    startRecording(
      () => {
        toggleRecordingUI(true, startBtn, stopBtn, micIndicator);
        startTimer(updateTimerDisplay);
      },
      () => {
        stopTimer();
        toggleRecordingUI(false, startBtn, stopBtn, micIndicator);
        updateTimerDisplay();
        previewRecording(); // triggered AFTER audio saved
      }
    );
  };
  
  // Stop button now only stops
  stopBtn.onclick = () => {
    stopRecording();
  };
  
  // Reset recording
  resetBtn.onclick = () => {
    resetRecording();
    resetTimer();
    resetUI(player, submitBtn, startBtn, stopBtn);
    updateTimerDisplay();
  };
  
  // Submit (stub)
  submitBtn.onclick = () => {
    alert("Message submitted! (stub)");
  };
  
  // Tab switcher
  window.showTab = showTab;