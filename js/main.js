// main.js — imports modules and wires everything together

import {
    startRecording,
    stopRecording,
    resetRecording,
    exportMergedRecording,
    getTimeLeft,
    isRecording,
    getTotalRecordedTime
  } from './js/record.js';
  
  import {
    updateTimerDisplay,
    resetTimerDisplay,
    updateRecordedLength
  } from './js/timer.js';
  
  import {
    toggleRecordingUI,
    resetUI,
    showTab
  } from './js/ui.js';
  
  // DOM elements
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const resetBtn = document.getElementById('resetBtn');
  const previewBtn = document.getElementById('previewBtn');
  const sendBtn = document.getElementById('sendBtn');
  const player = document.getElementById('player');
  const micIndicator = document.getElementById('micIndicator');
  const timerDisplay = document.getElementById('timer');
  const recordedLengthDisplay = document.getElementById('recordedLength');
  
  let hasPreviewed = false;
  
  // Event: Start Recording
  startBtn.onclick = () => startRecording(
    () => {
      toggleRecordingUI(false, startBtn, stopBtn, micIndicator);
      sendBtn.disabled = true;
    },
    (time) => {
      updateTimerDisplay(time, timerDisplay);
      updateRecordedLength(getTotalRecordedTime(), recordedLengthDisplay);
    },
    (isRecording) => {
      toggleRecordingUI(isRecording, startBtn, stopBtn, micIndicator);
    }
  );
  
  // Event: Stop Recording
  stopBtn.onclick = () => stopRecording();
  
  // Event: Reset
  resetBtn.onclick = () => {
    resetRecording();
    resetTimerDisplay(timerDisplay);
    updateRecordedLength(0, recordedLengthDisplay);
    resetUI(player, sendBtn, previewBtn, startBtn, stopBtn);
    hasPreviewed = false;
  };
  
  // Event: Preview
  previewBtn.onclick = async () => {
    const blob = await exportMergedRecording();
    const url = URL.createObjectURL(blob);
    player.src = url;
    player.style.display = 'block';
    hasPreviewed = true;
    sendBtn.disabled = false;
  };
  
  // Event: Send (for now, just replay)
  sendBtn.onclick = () => {
    if (!hasPreviewed) return;
    player.play();
  };
  
  // Tabs
  window.showTab = showTab;