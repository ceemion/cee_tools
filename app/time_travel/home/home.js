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
      <div>
        <select id="timezone" class="select-time-zone">
          <option value="">Choose timezone</option>
          ${utils.buildOptions()}
        </select>
      </div>
    `;

    utils.byId('timezones').innerHTML = timezonesSelect;
  }
}

run = () => {
  const time = utils.byId('time');
  const timezone = utils.byId('timezone');

  // throw error if no time entered
  if (!time.value) {
    console.log('enter time');
    return;
  }

  const hour = time.value.split(':')[0];
  const mins = time.value.split(':')[1];


  console.log('time: ', time.value);


  // get timezone
  const timezoneVal = timezone.value;

  // get time in utc
  const timeInZone = moment.tz({hour: hour, minute: mins}, timezoneVal);


  // convert time to user's timezone
  const timeConverted = moment.tz(timeInZone, utils.currentTimezone);
  console.log('timeConverted: ', timeConverted.format())

  // output result to new page
}

(function init() {
  utils.populateTimezones()
})()
