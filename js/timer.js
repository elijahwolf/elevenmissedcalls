// timer.js — tracks total recorded duration

let maxSeconds = 90;
let recordedSeconds = 0;
let countdownInterval = null;

export function startTimer(onUpdate) {
  stopTimer(); // Clear any previous interval

  countdownInterval = setInterval(() => {
    if (recordedSeconds >= maxSeconds) {
      stopTimer();
    } else {
      recordedSeconds++;
      onUpdate(recordedSeconds);
    }
  }, 1000);
}

export function stopTimer() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

export function resetTimer() {
  stopTimer();
  recordedSeconds = 0;
}

export function getRecordedTime() {
  return recordedSeconds;
}

export function getMaxTime() {
  return maxSeconds;
}

export function isMaxReached() {
  return recordedSeconds >= maxSeconds;
}