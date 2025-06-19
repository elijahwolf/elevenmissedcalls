// record.js — handles recording and exporting merged audio

let mediaRecorder;
let audioChunks   = [];
let blobSegments  = [];
let stream;
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

export function isRecording() {
  return mediaRecorder && mediaRecorder.state === 'recording';
}

export async function startRecording(onRecordingStart = () => {}, onRecordingStop = () => {}) {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // stop previous if any
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }

    const mimeType = MediaRecorder.isTypeSupported('audio/webm')
                   ? 'audio/webm'
                   : 'audio/mp4';
    mediaRecorder = new MediaRecorder(stream, { mimeType });
    audioChunks = [];

    mediaRecorder.ondataavailable = e => {
      if (e.data && e.data.size > 0) audioChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
      if (audioChunks.length) blobSegments.push(new Blob(audioChunks));
      onRecordingStop();
    };

    mediaRecorder.start();
    onRecordingStart(true);
  } catch (err) {
    console.error("Error accessing microphone:", err);
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }
    onRecordingStart(false);
  }
}

export function stopRecording() {
  if (isRecording()) mediaRecorder.stop();
}

export function resetRecording() {
  blobSegments = [];
}

export async function exportMergedRecording() {
  if (!blobSegments.length) {
    return new Blob([], { type: 'audio/wav' });
  }
  const buffers = await Promise.all(
    blobSegments.map(blob =>
      blob.arrayBuffer().then(buf => audioContext.decodeAudioData(buf))
    )
  );
  const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);
  const output = audioContext.createBuffer(1, totalLength, audioContext.sampleRate);

  let offset = 0;
  for (const b of buffers) {
    output.getChannelData(0).set(b.getChannelData(0), offset);
    offset += b.length;
  }
  return exportWAV(output);
}

function exportWAV(buffer) {
  const length = buffer.length * 2 + 44;
  const view   = new DataView(new ArrayBuffer(length));

  function writeString(v, o, s) {
    for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
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

  const audioData = buffer.getChannelData(0);
  let ptr = 44;
  for (let i = 0; i < audioData.length; i++, ptr += 2) {
    const s = Math.max(-1, Math.min(1, audioData[i]));
    view.setInt16(ptr, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}