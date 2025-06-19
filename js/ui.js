// ui.js — handles UI state and tab switching

export function toggleRecordingUI(isRecording, startBtn, stopBtn, micIndicator) {
  if (!startBtn || !stopBtn || !micIndicator) return;
  startBtn.disabled = isRecording;
  stopBtn.disabled = !isRecording;
  micIndicator.style.display = isRecording ? 'block' : 'none';
}

export function resetUI(player, sendBtn, startBtn, stopBtn) {
  if (!player || !sendBtn || !startBtn || !stopBtn) return;
  player.style.display = 'none';
  sendBtn.disabled = true;
  startBtn.disabled = false;
  stopBtn.disabled = true;
  clearCustomAudio();
}

export function showTab(tabId) {
  if (!tabId) return;

  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // Deactivate all tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected tab
  const selectedTab = document.getElementById(tabId);
  if (selectedTab) selectedTab.classList.add('active');

  // Highlight selected button
  const matchingBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (matchingBtn) matchingBtn.classList.add('active');
}

// --- Audio preview container helpers ---

const audioContainer = document.getElementById('audioPreview');
const seekBar = document.getElementById('seekBar');
const timeDisplay = document.getElementById('timeDisplay');
const playPauseBtn = document.getElementById('playPauseBtn');

export function updateCustomAudioUI(blobUrl) {
  if (audioContainer) {
    audioContainer.style.display = 'flex';
  }
}

function clearCustomAudio() {
  if (audioContainer && seekBar && timeDisplay && playPauseBtn) {
    seekBar.value = 0;
    timeDisplay.textContent = '0:00';
    playPauseBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20">
        <polygon points="5,3 19,12 5,21" fill="currentColor" />
      </svg>
    `;
    audioContainer.style.display = 'none';
  }
}