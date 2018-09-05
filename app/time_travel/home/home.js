const moment = require('moment-timezone');

const utils = {
  currentTime: moment().format(),
  currentTimezone: moment.tz.guess(),
  timezoneNames: moment.tz.names(),
  byId: id => document.getElementById(id),
  buildOptions: () => {
    let options = [];
  
    utils.timezoneNames.forEach(zone => {
      options.push(`<option value="${zone}">${zone}</option>`)
    });
  
    return options;
  },
  populateTimezones: () => {
    const timezonesSelect = `
      <select id="timezone" class="cee-time-input cee-zone-select">
        <option value="">Choose timezone</option>
        ${utils.buildOptions()}
      </select>
    `;

    utils.byId('timezones').innerHTML = timezonesSelect;
  },
  inputChecks: (time, zone) => {
    if (!time || !zone) {
      let output = '';

      switch (true) {
        case !time && !zone:
          output = 'Please enter time and select a timezone';
          break;
        case !time:
          output = 'Please enter time';
          break;
        case !zone:
          output = 'Please select a timezone';
          break;
        default:
          break;
      }

      return `<div class="status-text" style="color:#f16f6f;">${output}</div>`;
    }
  },
  resultTemplate: (data) => {
    return `
      <div class="tt-card">
        <div>
          <button onclick="closeResult()">close</button>
        </div>
        <p>Time where you are now is</p>
        <h2>${data.time}</h2>
        <p>${data.date}</p>
        <p>${data.zone}</p>
      </div>
    `
  }
}

run = () => {
  const errorDiv = utils.byId('input-error'),
        time = utils.byId('time'),
        timezone = utils.byId('timezone'),
        resultDiv = utils.byId('result');

  let hour, mins, timezoneVal, timeInZone, timeConverted, errorText;

  // throw error if no time or zone entered
  errorText = utils.inputChecks(time.value, timezone.value);
  if (!!errorText) {
    errorDiv.innerHTML = errorText;
    return;
  }

  // clear error div
  errorDiv.innerHTML = '';

  hour = time.value.split(':')[0];
  mins = time.value.split(':')[1];

  // get timezone
  timezoneVal = timezone.value;

  // get time in utc
  timeInZone = moment.tz({hour: hour, minute: mins}, timezoneVal);


  // convert time to user's timezone
  timeConverted = moment.tz(timeInZone, utils.currentTimezone);

  const resultData = {
    time: timeConverted.format('LT'),
    date: timeConverted.format('ll'),
    zone: timeConverted.tz()
  };

  // output result to new page
  resultDiv.innerHTML = utils.resultTemplate(resultData);
}

closeResult = () => {
  utils.byId('result').innerHTML = '';
}

reset = () => {
  const errorDiv = utils.byId('input-error').innerHTML = '',
        time = utils.byId('time').value = '',
        timezone = utils.byId('timezone').value = '';
  return;
}

(function init() {
  utils.populateTimezones()
})()
