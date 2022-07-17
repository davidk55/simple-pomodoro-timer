import './styles/main.scss';
import alarm from './assets/alarm.wav';

class Settings {
  constructor(pomodoroTime, breakTime, pomodoroCount) {
    this.pomodoroTime = pomodoroTime;
    this.breakTime = breakTime;
    this.pomodoroCount = pomodoroCount;
  }
}

let settings;
const remainingTimeButton = document.querySelector('#remaining-time');
let audio = new Audio(alarm);

(() => {
  if (checkForSettingsInLocalStorage()) {
    settings = new Settings(
      localStorage.getItem('pomodoro-time'),
      localStorage.getItem('break-time'),
      localStorage.getItem('pomodoro-count')
    );
  } else {
    settings = new Settings(25, 5, 3);
  }

  const settingsPomodoroTime = document.querySelector(
    '#settings-pomodoro-time'
  );
  const settingsBreakTime = document.querySelector('#settings-break-time');
  const settingsPomodoroCount = document.querySelector(
    '#settings-pomodoro-count'
  );

  // load default settings
  settingsPomodoroTime.value = settings.pomodoroTime;
  settingsBreakTime.value = settings.breakTime;
  settingsPomodoroCount.value = settings.pomodoroCount;

  updateButton(toRemainingString(settings.pomodoroTime * 60 * 1000));
})();

function getNewSettings() {
  const pomodoroTimeValue = document.querySelector(
    '#settings-pomodoro-time'
  ).value;
  const breakTimeValue = document.querySelector('#settings-break-time').value;
  const pomodoroCountValue = document.querySelector(
    '#settings-pomodoro-count'
  ).value;
  return new Settings(pomodoroTimeValue, breakTimeValue, pomodoroCountValue);
}

function checkForSettingsInLocalStorage() {
  if (localStorage.getItem('pomodoro-time')) {
    return true;
  }
  return false;
}

function saveSettingsToLocalStorage() {
  localStorage.setItem('pomodoro-time', settings.pomodoroTime);
  localStorage.setItem('break-time', settings.breakTime);
  localStorage.setItem('pomodoro-count', settings.pomodoroCount);
}

function applySettings(given_settings) {
  settings.pomodoroTime = given_settings.pomodoroTime;
  settings.breakTime = given_settings.breakTime;
  settings.pomodoroCount = given_settings.pomodoroCount;
}

function toRemainingString(remainingMilliseconds) {
  const minutes = Math.floor(remainingMilliseconds / 1000 / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor((remainingMilliseconds / 1000) % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function timerHandler(
  timerDurationMinutes,
  classedToAddAtBeginning,
  classesToRemoveAtBeginning,
  classesToAddAtEnding,
  classesToRemoveAtEnding
) {
  remainingTimeButton.classList.add(...classedToAddAtBeginning);
  remainingTimeButton.classList.remove(...classesToRemoveAtBeginning);

  const endingFunction = function () {
    remainingTimeButton.classList.add(...classesToAddAtEnding);
    remainingTimeButton.classList.remove(...classesToRemoveAtEnding);
    audio.loop = true;
    audio.play();
  };

  startTimer(timerDurationMinutes, endingFunction);
}

function startTimer(timerDurationMinutes, functionExecuteAtEnding) {
  const endTime = Date.parse(new Date()) + timerDurationMinutes * 60 * 1000;
  let remainingMilliseconds;
  const interval = setInterval(() => {
    remainingMilliseconds = endTime - Date.parse(new Date());

    if (remainingMilliseconds <= 0) {
      functionExecuteAtEnding();
      clearInterval(interval);
    }
    updateButton(toRemainingString(remainingMilliseconds));
  }, 1000);
}

function updateButton(remainingString) {
  document.querySelector('#remaining-time').innerText = remainingString;
}

function toggleSettingsPopup() {
  const settings_popup = document.querySelector('#settings-popup');
  if (settings_popup.classList.contains('active')) {
    settings_popup.classList.remove('active');
  } else {
    settings_popup.classList.add('active');
  }
}

function getLeftPomodorosClass() {
  for (let cl of remainingTimeButton.classList) {
    if (cl.match(/left-pomodoros-\d/)) {
      return cl;
    }
  }
}

function checkForFinish() {
  let cl = getLeftPomodorosClass();
  if (!cl) return false;

  return cl.match('left-pomodoros-0');
}

function decreaseLeftPomodoros() {
  let cl = getLeftPomodorosClass();
  if (!cl) return;

  remainingTimeButton.classList.remove(cl);
  let num = parseInt(cl.split('-')[2]);
  num--;
  remainingTimeButton.classList.add('left-pomodoros-' + num);
}

function updateSessesioInformation() {
  const sessInfo = document.querySelector('#session-information');
  let cl = getLeftPomodorosClass();
  if (!cl) return;

  let pomodorosLeft = parseInt(cl.split('-')[2]);

  let pomodoroCount = settings.pomodoroCount;
  sessInfo.innerText = pomodoroCount - pomodorosLeft + 1 + '/' + pomodoroCount;
}

// Listener
document.querySelector('#settings').addEventListener('click', () => {
  toggleSettingsPopup();
});

document.querySelectorAll('.settings-input').forEach((e) => {
  e.addEventListener('change', () => {
    applySettings(getNewSettings());
    saveSettingsToLocalStorage();

    if (remainingTimeButton.classList.contains('ready-for-session')) {
      updateButton(toRemainingString(settings.pomodoroTime * 60 * 1000));
    }
  });
});

document.addEventListener('click', (event) => {
  if (event.target.closest('#settings-popup')) return;
  if (event.target.closest('#settings')) return;

  const settings_popup = document.querySelector('#settings-popup');
  settings_popup.classList.remove('active');
});

document.querySelector('#remaining-time').addEventListener('click', () => {
  if (remainingTimeButton.classList.contains('ready-for-session')) {
    timerHandler(
      settings.pomodoroTime,
      ['pomodoro-running', 'left-pomodoros-' + settings.pomodoroCount],
      ['ready-for-session'],
      ['ready-for-break'],
      ['pomodoro-running']
    );
    updateSessesioInformation();
  }

  if (remainingTimeButton.classList.contains('ready-for-break')) {
    audio.pause();
    audio.currentTime = 0;
    timerHandler(
      settings.breakTime,
      ['break-running'],
      ['ready-for-break'],
      ['ready-for-pomodoro'],
      ['break-running']
    );
  }

  if (remainingTimeButton.classList.contains('ready-for-pomodoro')) {
    audio.pause();
    audio.currentTime = 0;
    decreaseLeftPomodoros();
    if (checkForFinish()) {
      remainingTimeButton.classList.remove(
        'left-pomodoros-0',
        'ready-for-pomodoro'
      );
      remainingTimeButton.classList.add('ready-for-session');
      updateButton(toRemainingString(settings.pomodoroTime * 1000 * 60));
      return;
    }
    updateSessesioInformation();

    timerHandler(
      settings.pomodoroTime,
      ['pomodoro-running'],
      ['ready-for-pomodoro'],
      ['ready-for-break'],
      ['pomodoro-running']
    );
  }
});
