import './styles/main.scss';

// Get inputs

let settings;

// TODO: use self executing function
function initialSetup() {
  if (checkForLocalStorage()) {
    // load settings from local storage
  } else {
    settings = {
      sessionTime: 25,
      breakTime: 5,
      sessionCount: 3,
    };
  }
  const inputSessionTime = document.querySelector('#input-session-time');
  const inputBreakTime = document.querySelector('#input-break-time');
  const inputSessionCount = document.querySelector('#input-session-count');

  inputSessionTime.value = settings.sessionTime;
  inputBreakTime.value = settings.breakTime;
  inputSessionCount.value = settings.sessionCount;

  applySettings(settings);
}

function getCurrentSettings() {
  const sessionTimeValue = document.querySelector('#input-session-time').value;
  const breakTimeValue = document.querySelector('#input-break-time').value;
  const sessionCountValue = document.querySelector(
    '#input-session-count'
  ).value;
  return {
    sessionTime: sessionTimeValue,
    breakTime: breakTimeValue,
    sessionCount: sessionCountValue,
  };
}

function checkForLocalStorage() {
  // TODO: create functions to store to local storage
  return false;
}

function applySettings(settings) {
  // TODO: implement timer
}

initialSetup();

function toggleSettingsPopup() {
  const settings = document.querySelector('#settings-popup');
  if (settings.classList.contains('active')) {
    settings.classList.remove('active');
  } else {
    settings.classList.add('active');
  }
}

// Listener
document.querySelector('#settings').addEventListener('click', () => {
  toggleSettingsPopup();
});

document.querySelectorAll('.settings-input').forEach((e) => {
  e.addEventListener('change', () => {
    applySettings(getCurrentSettings());
  });
});

document.addEventListener("click", function(event) {

  if (event.target.closest("#settings-popup")) return;
  if (event.target.closest("#settings")) return;

  const settings = document.querySelector('#settings-popup');
  settings.classList.remove("active");
})
