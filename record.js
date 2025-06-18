let mediaRecorder;
let audioChunks = [];
let blobSegments = [];
let timeLeft = 90;
let timerInterval;
let stream;
let audioContext = new (window.AudioContext || window.webkitAudioContext)();

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const sendBtn = document.getElementById('sendBtn');
const player = document.getElementById('player');
const micIndicator = document.getElementById('micIndicator');
const timerDisplay = document.getElementById('timer');

startBtn.onclick = async () => {
    if (timeLeft <= 0) return;
    try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
    mediaRecorder = new MediaRecorder(stream, { mimeType });
    audioChunks = [];

    mediaRecorder.ondataavailable = (e) => {
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
        timerDisplay.textContent = timeLeft + 's remaining';
        }, 1000);
    }

    } catch (err) {
    alert('Microphone access error: ' + err.message);
    }
};

stopBtn.onclick = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    }
};

resetBtn.onclick = () => {
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
};

sendBtn.onclick = async () => {
    const buffers = await Promise.all(blobSegments.map(async (blob) => {
    const arrayBuffer = await blob.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
    }));

    const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);
    const output = audioContext.createBuffer(1, totalLength, audioContext.sampleRate);

    let offset = 0;
    for (let b of buffers) {
    output.getChannelData(0).set(b.getChannelData(0), offset);
    offset += b.length;
    }

    const wavBlob = exportWAV(output);
    const url = URL.createObjectURL(wavBlob);
    player.src = url;
    player.style.display = 'block';
};

function exportWAV(buffer) {
    const length = buffer.length * 2 + 44;
    const bufferView = new DataView(new ArrayBuffer(length));

    function writeString(view, offset, str) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    }

    writeString(bufferView, 0, 'RIFF');
    bufferView.setUint32(4, length - 8, true);
    writeString(bufferView, 8, 'WAVE');
    writeString(bufferView, 12, 'fmt ');
    bufferView.setUint32(16, 16, true);
    bufferView.setUint16(20, 1, true);
    bufferView.setUint16(22, 1, true);
    bufferView.setUint32(24, buffer.sampleRate, true);
    bufferView.setUint32(28, buffer.sampleRate * 2, true);
    bufferView.setUint16(32, 2, true);
    bufferView.setUint16(34, 16, true);
    writeString(bufferView, 36, 'data');
    bufferView.setUint32(40, buffer.length * 2, true);

    const audio = buffer.getChannelData(0);
    let offset = 44;
    for (let i = 0; i < audio.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, audio[i]));
    bufferView.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return new Blob([bufferView], { type: 'audio/wav' });
}

function showTab(id) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelector(`.tab-btn[onclick="showTab('${id}')"]`).classList.add('active');
}