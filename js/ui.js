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