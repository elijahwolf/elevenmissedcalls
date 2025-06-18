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
  const sendBtn = document.getElementById('sendBtn');
  const player = document.getElementById('player');
  const micIndicator = document.getElementById('micIndicator');
  const timerDisplay = document.getElementById('timer');
  
  // Timer update function
  function updateTimerDisplay() {
    const current = getRecordedTime();
    const max = getMaxTime();
    timerDisplay.textContent = `Recorded: ${current} / ${max}s`;
  }
  
  // Start recording
  startBtn.onclick = () => {
    startRecording(() => {
      toggleRecordingUI(true, startBtn, stopBtn, micIndicator);
      startTimer(updateTimerDisplay);
    });
  };
  
  // Stop recording
  stopBtn.onclick = () => {
    stopRecording();
    stopTimer();
    toggleRecordingUI(false, startBtn, stopBtn, micIndicator);
    updateTimerDisplay();
    previewRecording(); // Auto-preview on stop
  };
  
  // Reset everything
  resetBtn.onclick = () => {
    resetRecording();
    resetTimer();
    resetUI(player, sendBtn, startBtn, stopBtn);
    updateTimerDisplay();
  };
  
  // Preview merged recording
  function previewRecording() {
    exportMergedRecording().then(blob => {
      const url = URL.createObjectURL(blob);
      player.src = url;
      player.style.display = 'block';
      sendBtn.disabled = false;
    });
  }
  
  // Send (stub for now)
  sendBtn.onclick = () => {
    alert("Message submitted! (stub)");
  };
  
  // Tab logic
  window.showTab = showTab;