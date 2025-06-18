// ui.js — handles UI state and tab switching

export function toggleRecordingUI(isRecording, startBtn, stopBtn, micIndicator) {
    if (!startBtn || !stopBtn || !micIndicator) return;
    startBtn.disabled = isRecording;
    stopBtn.disabled = !isRecording;
    micIndicator.style.display = isRecording ? 'block' : 'none';
  }
  
  export function resetUI(player, sendBtn, startBtn, stopBtn) {
    if (!player || !sendBtn || !startBtn || !stopBtn) return;
    player.src = '';
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
  
  // Custom Audio Controls
  const audioContainer = document.getElementById('audioPreview');
  const audioPlayer = document.getElementById('player');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const seekBar = document.getElementById('seekBar');
  const timeDisplay = document.getElementById('timeDisplay');
  
  if (audioPlayer && playPauseBtn && seekBar && timeDisplay) {
    playPauseBtn.addEventListener('click', () => {
      if (audioPlayer.paused) {
        audioPlayer.play();
      } else {
        audioPlayer.pause();
      }
    });
  
    audioPlayer.addEventListener('play', () => {
      playPauseBtn.textContent = '⏸';
    });
  
    audioPlayer.addEventListener('pause', () => {
      playPauseBtn.textContent = '▶️';
    });
  
    audioPlayer.addEventListener('timeupdate', () => {
      seekBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
      timeDisplay.textContent = formatTime(audioPlayer.currentTime);
    });
  
    seekBar.addEventListener('input', () => {
      audioPlayer.currentTime = (seekBar.value / 100) * audioPlayer.duration;
    });
  }
  
  export function updateCustomAudioUI(blobUrl) {
    if (audioContainer && audioPlayer) {
      audioPlayer.src = blobUrl;
      audioContainer.style.display = 'flex';
      audioPlayer.load();
    }
  }
  
  function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(1, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
  
  function clearCustomAudio() {
    if (audioPlayer && audioContainer) {
      audioPlayer.pause();
      audioPlayer.removeAttribute('src');
      audioContainer.style.display = 'none';
      seekBar.value = 0;
      timeDisplay.textContent = '0:00';
      playPauseBtn.textContent = '▶️';
    }
  }