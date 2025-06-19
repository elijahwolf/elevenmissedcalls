// timer.js — tracks total recorded duration

let maxSeconds       = 90;
let recordedSeconds  = 0;
let countdownInterval;

export function startTimer(onUpdate) {
  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    if (recordedSeconds >= maxSeconds) {
      clearInterval(countdownInterval);
    } else {
      recordedSeconds++;
      onUpdate(recordedSeconds);
    }
  }, 1000);
}

export function stopTimer() {
  clearInterval(countdownInterval);
}

export function resetTimer() {
  recordedSeconds = 0;
  clearInterval(countdownInterval);
}

export function getRecordedTime() {
  return recordedSeconds;
}

export function getMaxTime() {
  return maxSeconds;
}