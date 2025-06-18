// main.js — handles recording, preview, and tab logic

import {
    startRecording,
    stopRecording,
    resetRecording,
    exportMergedRecording,
    getTimeLeft,
    isRecording
  } from './record.js';
  
  import {
    updateTimerDisplay,
    resetTimerDisplay
  } from './timer.js';
  
  import {
    toggleRecordingUI,
    resetUI,
    showTab
  } from './ui.js';
  
  // DOM elements
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const resetBtn = document.getElementById('resetBtn');
  const previewBtn = document.getElementById('previewBtn');
  const submitBtn = document.getElementById('submitBtn');
  const sendBtn = document.getElementById('sendBtn'); // deprecated
  const player = document.getElementById('player');
  const micIndicator = document.getElementById('micIndicator');
  const timerDisplay = document.getElementById('timer');
  const recordedLengthDisplay = document.getElementById('recordedLength');
  
  // Event listeners
  startBtn.onclick = () => startRecording(
    () => {
      toggleRecordingUI(false, startBtn, stopBtn, micIndicator);
      submitBtn.disabled = true;
    },
    time => {
      updateTimerDisplay(time, timerDisplay);
      const recorded = 90 - time;
      recordedLengthDisplay.textContent = `Recorded: ${recorded}s / 90s`;
    },
    isRecording => toggleRecordingUI(isRecording, startBtn, stopBtn, micIndicator)
  );
  
  stopBtn.onclick = () => stopRecording();
  
  resetBtn.onclick = () => {
    resetRecording();
    resetTimerDisplay(timerDisplay);
    recordedLengthDisplay.textContent = 'Recorded: 0s / 90s';
    resetUI(player, previewBtn, startBtn, stopBtn);
    submitBtn.disabled = true;
  };
  
  previewBtn.onclick = async () => {
    const blob = await exportMergedRecording();
    const url = URL.createObjectURL(blob);
    player.src = url;
    player.style.display = 'block';
    submitBtn.disabled = false;
  };
  
  submitBtn.onclick = () => {
    alert('Your recording has been submitted.');
    // Optional: Implement upload to backend
  };
  
  // Tabs
  document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.dataset.tab;
      showTab(tabId);
    });
  });
  