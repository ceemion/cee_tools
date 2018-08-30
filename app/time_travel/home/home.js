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

// const timeHour = utils.byId('time-hr');
// const timeMins = utils.byId('time-mins');
// const amPm = utils.byId('ampm');
// const timezone = utils.byId('timezone');
const time = utils.byId('time');

// console.log(utils.timezoneNames)

// moment(time.valueAsDate).utc().format()


test = () => {
const timezone = utils.byId('timezone');

  console.log('timeHour - ', typeof(time.value))
  console.log('timeHour Value -', time.value)
  console.log('Time Zone - ', timezone.value)
}

(function init() {
  utils.populateTimezones()
})()
