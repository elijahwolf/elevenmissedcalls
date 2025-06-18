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
  
  // Timer update function
  function updateTimerDisplay() {
    const current = getRecordedTime();
    const max = getMaxTime();
    timerDisplay.textContent = `Recorded: ${current}s / ${max}s`;
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
    previewRecording(); // auto-preview after stop
  };
  
  // Reset
  resetBtn.onclick = () => {
    resetRecording();
    resetTimer();
    resetUI(player, submitBtn, startBtn, stopBtn);
    updateTimerDisplay();
  };
  
  // Preview merged audio
  function previewRecording() {
    exportMergedRecording().then(blob => {
      const url = URL.createObjectURL(blob);
      player.src = url;
      player.style.display = 'block';
      submitBtn.disabled = false;
    });
  }
  
  // Dummy send handler
  submitBtn.onclick = () => {
    alert("Message submitted! (stub)");
  };
  
  // Tab switching via dataset
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        showTab(tabId);
      });
    });
  });