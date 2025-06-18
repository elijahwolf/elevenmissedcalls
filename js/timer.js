// timer.js — handles timer display and formatting

export function updateTimerDisplay(time, element) {
    element.textContent = `${time}s remaining`;
  }
  
  export function resetTimerDisplay(element) {
    element.textContent = `90s remaining`;
  }