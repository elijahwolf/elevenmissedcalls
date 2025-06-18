// main.js — imports modules and wires everything together

import {
    startRecording,
    stopRecording,
    resetRecording,
    exportMergedRecording,
    getTimeLeft,
    isRecording
  } from './js/record.js';
  import { updateTimerDisplay, resetTimerDisplay } from './js/timer.js';
  import { toggleRecordingUI, resetUI, showTab } from './js/ui.js';
  
  // DOM elements
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const resetBtn = document.getElementById('resetBtn');
  const sendBtn = document.getElementById('sendBtn');
  const player = document.getElementById('player');
  const micIndicator = document.getElementById('micIndicator');
  const timerDisplay = document.getElementById('timer');
  
  // Event listeners
  startBtn.onclick = () => startRecording(
    () => {
      toggleRecordingUI(false, startBtn, stopBtn, micIndicator);
      sendBtn.disabled = getTimeLeft() <= 0;
    },
    time => updateTimerDisplay(time, timerDisplay),
    isRecording => toggleRecordingUI(isRecording, startBtn, stopBtn, micIndicator)
  );
  
  stopBtn.onclick = () => stopRecording();
  
  resetBtn.onclick = () => {
    resetRecording();
    resetTimerDisplay(timerDisplay);
    resetUI(player, sendBtn, startBtn, stopBtn);
  };
  
  sendBtn.onclick = async () => {
    const blob = await exportMergedRecording();
    const url = URL.createObjectURL(blob);
    player.src = url;
    player.style.display = 'block';
  };
  
  // Tabs
  window.showTab = showTab;