// js/ui.js — handles UI state, tab‐switching and resetting audio

// Toggle the start/stop buttons + mic indicator
export function toggleRecordingUI(isRecording, startBtn, stopBtn, micIndicator) {
  if (!startBtn || !stopBtn || !micIndicator) return;
  startBtn.disabled = isRecording;
  stopBtn.disabled  = !isRecording;
  micIndicator.style.display = isRecording ? 'flex' : 'none';
}

// Reset everything back to “before you ever recorded”
export function resetUI(playerOrContainer, sendBtn, startBtn, stopBtn) {
  // disable send, re‐enable record buttons
  if (sendBtn)  sendBtn.disabled  = true;
  if (startBtn) startBtn.disabled = false;
  if (stopBtn)  stopBtn.disabled  = true;

  // if this _is_ an audio element (or JS Audio), stop it
  if (playerOrContainer && typeof playerOrContainer.pause === 'function') {
    playerOrContainer.pause();
    // clear its source
    if (playerOrContainer.removeAttribute) {
      playerOrContainer.removeAttribute('src');
    }
    // hide the built-in <audio>, if it has one
    if (playerOrContainer.style) {
      playerOrContainer.style.display = 'none';
    }
  }

  // tear down any custom UI you built in ui.js (seek bar, etc)
  clearCustomAudio();
}

// Simple tab switching
export function showTab(tabId) {
  if (!tabId) return;
  document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  const panel = document.getElementById(tabId);
  if (panel) panel.classList.add('active');

  const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (btn) btn.classList.add('active');
}

/* ————————————————————————————
   Custom audio controls teardown
   ———————————————————————————— */
const audioContainer  = document.getElementById('audioPreview');
const audioPlayer     = document.getElementById('player');       // if you have a fallback <audio>
const playPauseBtn    = document.getElementById('playPauseBtn');
const seekBar         = document.getElementById('seekBar');
const timeDisplay     = document.getElementById('timeDisplay');

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function updateCustomAudioUI(blobUrl) {
  if (!audioPlayer || !audioContainer) return;
  audioPlayer.src = blobUrl;
  audioPlayer.load();
  audioContainer.style.display = 'flex';
}

// Tear down custom controls state
function clearCustomAudio() {
  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.removeAttribute('src');
  }
  if (audioContainer) {
    audioContainer.style.display = 'none';
  }
  if (seekBar) {
    seekBar.value = 0;
  }
  if (timeDisplay) {
    timeDisplay.textContent = '0:00';
  }
  if (playPauseBtn) {
    playPauseBtn.textContent = '▶';
  }
}