// ui.js — handles UI state changes and tab controls

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
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelector(`.tab-btn[onclick="showTab('${id}')"]`).classList.add('active');
  }