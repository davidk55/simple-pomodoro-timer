import './styles/main.scss';

class Settings {
  constructor(pomodoroTime, breakTime, pomodoroCount) {
    this.pomodoroTime = pomodoroTime;
    this.breakTime = breakTime;
    this.pomodoroCount = pomodoroCount;
  }
}

let settings;
const remainingTimeButton = document.querySelector('#remaining-time');

(() => {
  if (checkForLocalStorage()) {
    // load settings from local storage
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

  settingsPomodoroTime.value = settings.pomodoroTime;
  settingsBreakTime.value = settings.breakTime;
  settingsPomodoroCount.value = settings.pomodoroCount;

  applySettings(settings);
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

function checkForLocalStorage() {
  // TODO: create functions to store to local storage
  return false;
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
    // TODO: play sound
  };

  startTimer(timerDurationMinutes, endingFunction);
}

function startTimer(timerDurationMinutes, functionExecuteAtEnding) {
  const endTime = Date.parse(new Date()) + timerDurationMinutes * 60 * 1000;
  console.log(Date.parse(new Date()));
  console.log(timerDurationMinutes * 60 * 1000);
  let remainingMilliseconds;
  // updateButton(toRemainingString(endTime - Date.parse(new Date()) - 1000));
  const interval = setInterval(() => {
    remainingMilliseconds = endTime - Date.parse(new Date());

    if (remainingMilliseconds <= 0) {
      clearInterval(interval);
      functionExecuteAtEnding();
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

function checkForFinish() {
  let finished = false;
  for (let cl of remainingTimeButton.classList) {
    if (cl.match('left-pomodoros-0')) {
      finished = true;
      break;
    }
  }
  return finished;
}

function decreaseLeftPomodoros() {
  for (let cl of remainingTimeButton.classList) {
    if (cl.match(/left-pomodoros-\d/)) {
      remainingTimeButton.classList.remove(cl);
      let num = parseInt(cl.split('-')[2]);
      console.log(num);
      num--;
      remainingTimeButton.classList.add('left-pomodoros-' + num);
      break;
    }
  }
}

// Listener
document.querySelector('#settings').addEventListener('click', () => {
  toggleSettingsPopup();
});

document.querySelectorAll('.settings-input').forEach((e) => {
  e.addEventListener('change', () => {
    applySettings(getNewSettings());

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
  }

  if (remainingTimeButton.classList.contains('ready-for-break')) {
    timerHandler(
      settings.breakTime,
      ['break-running'],
      ['ready-for-break'],
      ['ready-for-pomodoro'],
      ['break-running']
    );
  }

  if (remainingTimeButton.classList.contains('ready-for-pomodoro')) {
    decreaseLeftPomodoros();
    if (checkForFinish()) {
      remainingTimeButton.classList.remove(
        'left-pomodoros-0',
        'ready-for-pomodoro'
      );
      remainingTimeButton.classList.add('ready-for-session');
      updateButton(settings.pomodoroTime);
      return;
    }

    timerHandler(
      settings.pomodoroTime,
      ['pomodoro-running'],
      ['ready-for-pomodoro'],
      ['ready-for-break'],
      ['pomodoro-running']
    );
  }
});
