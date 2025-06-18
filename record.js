// script.js — handles audio recording, playback, and tab UI logic

// DOM Elements
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const sendBtn = document.getElementById('sendBtn');
const player = document.getElementById('player');
const micIndicator = document.getElementById('micIndicator');
const timerDisplay = document.getElementById('timer');

// Audio state
let mediaRecorder;
let stream;
let audioChunks = [];
let blobSegments = [];
let audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Timer state
let timeLeft = 90;
let timerInterval = null;

// Event Listeners
startBtn.onclick = handleStartRecording;
stopBtn.onclick = handleStopRecording;
resetBtn.onclick = handleReset;
sendBtn.onclick = handleSend;

function handleStartRecording() {
  if (timeLeft <= 0) return;
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(userStream => {
      stream = userStream;
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      mediaRecorder = new MediaRecorder(stream, { mimeType });
      audioChunks = [];

      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        micIndicator.style.display = 'none';
        stream.getTracks().forEach(track => track.stop());
        stopBtn.disabled = true;
        startBtn.disabled = timeLeft <= 0;
        if (audioChunks.length > 0) blobSegments.push(new Blob(audioChunks));
        sendBtn.disabled = blobSegments.length === 0;
      };

      mediaRecorder.start();
      micIndicator.style.display = 'block';
      startBtn.disabled = true;
      stopBtn.disabled = false;
      sendBtn.disabled = true;

      if (!timerInterval) {
        timerInterval = setInterval(() => {
          timeLeft--;
          if (timeLeft <= 0) {
            timeLeft = 0;
            clearInterval(timerInterval);
            timerInterval = null;
            if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop();
          }
          timerDisplay.textContent = `${timeLeft}s remaining`;
        }, 1000);
      }
    })
    .catch(err => alert('Microphone access error: ' + err.message));
}

function handleStopRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }
}

function handleReset() {
  blobSegments = [];
  timeLeft = 90;
  timerDisplay.textContent = '90s remaining';
  clearInterval(timerInterval);
  timerInterval = null;
  player.src = '';
  player.style.display = 'none';
  sendBtn.disabled = true;
  startBtn.disabled = false;
  stopBtn.disabled = true;
}

async function handleSend() {
  const buffers = await Promise.all(blobSegments.map(blob =>
    blob.arrayBuffer().then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
  ));

  const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);
  const output = audioContext.createBuffer(1, totalLength, audioContext.sampleRate);

  let offset = 0;
  for (const b of buffers) {
    output.getChannelData(0).set(b.getChannelData(0), offset);
    offset += b.length;
  }

  const wavBlob = exportWAV(output);
  const url = URL.createObjectURL(wavBlob);
  player.src = url;
  player.style.display = 'block';
}

function exportWAV(buffer) {
  const length = buffer.length * 2 + 44;
  const view = new DataView(new ArrayBuffer(length));

  function writeString(view, offset, str) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeString(view, 0, 'RIFF');
  view.setUint32(4, length - 8, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, buffer.length * 2, true);

  const audio = buffer.getChannelData(0);
  let offset = 44;
  for (let i = 0; i < audio.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, audio[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}

// Tab UI toggle
function showTab(id) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelector(`.tab-btn[onclick="showTab('${id}')"]`).classList.add('active');
}