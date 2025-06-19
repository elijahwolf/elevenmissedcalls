// ui.js — handles UI state and tab switching

export function toggleRecordingUI(isRecording, startBtn, stopBtn, micIndicator) {
    startBtn.disabled = isRecording;
    stopBtn.disabled = !isRecording;
    micIndicator.style.display = isRecording ? 'block' : 'none';
  }
  
  export function resetUI(player, sendBtn, startBtn, stopBtn) {
    player.src = '';
    player.style.display = 'none';
    sendBtn.disabled = true;
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
  
  export function showTab(id) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active');
    });
  
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
  
    // Show selected tab content
    const activeTab = document.getElementById(id);
    if (activeTab) activeTab.classList.add('active');
  
    // Highlight selected tab button
    const activeButton = document.querySelector(`.tab-btn[data-tab="${id}"]`);
    if (activeButton) activeButton.classList.add('active');
  }