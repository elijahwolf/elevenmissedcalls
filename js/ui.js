// ui.js — handles UI state and tab switching

export function toggleRecordingUI(isRecording, startBtn, stopBtn, micIndicator) {
  if (!startBtn || !stopBtn || !micIndicator) return;
  startBtn.disabled = isRecording;
  stopBtn.disabled  = !isRecording;
  micIndicator.style.display = isRecording ? 'flex' : 'none';
}

export function resetUI(player, sendBtn, startBtn, stopBtn) {
  if (!player || !sendBtn || !startBtn || !stopBtn) return;
  player.pause();
  player.removeAttribute('src');
  player.style.display = 'none';
  sendBtn.disabled = true;
  startBtn.disabled = false;
  stopBtn.disabled = true;
}

export function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(tabId)?.classList.add('active');
  document.querySelector(`.tab-btn[data-tab="${tabId}"]`)?.classList.add('active');
}