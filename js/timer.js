// timer.js — handles countdown and duration display

let timeLeft = 90;

export function getTimeLeft() {
  return timeLeft;
}

export function updateTimerDisplay(time, timerElement) {
  timeLeft = time;
  timerElement.textContent = `${time}s remaining`;
}

export function resetTimerDisplay(timerElement) {
  timeLeft = 90;
  timerElement.textContent = '90s remaining';
}

// NEW: show recorded time like "Recorded: 23s / 90s"
export function updateRecordedLength(seconds, element) {
  element.textContent = `Recorded: ${seconds}s / 90s`;
}