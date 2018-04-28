const DeviceGeneric = require('lib/DeviceManager/DeviceGeneric');
const debug = require('lib/debugger')('DeviceSMS');
const names = require('lib/names');

const testLocations = Object.keys(names.locations);
const testNumbers = {};
for (const location of testLocations) {
  testNumbers[location] = ['808-555-1234', '808-422-2222'];
}

let locations;
let message;

class DeviceSMS extends DeviceGeneric {
  static open() {
    debug.log('Connected to SMS server.');
  }
  static configure(strCommand) {
    const conf = JSON.parse(strCommand);
    ({ locations, message } = conf);
  }
  static test(strTest, strResult) {
    for (const location of locations) {
      debug.log(`Texting people in ${names.locations[location]}`);
      for (const number of testNumbers[location]) {
        debug.log(`\t- Sent SMS saying "${message}" to ${number}`);
      }
    }
  }
  static warningON(mode) {
    for (const location of locations) {
      debug.log(`Texting people in ${names.locations[location]}`);
      for (const number of testNumbers[location]) {
        debug.log(`\t- Sent SMS saying "${message}" to ${number}`);
      }
    }
  }
  static warningOFF() {
    for (const location of locations) {
      debug.log(`Texting people in ${names.locations[location]}`);
      for (const number of testNumbers[location]) {
        debug.log(`\t- Sent SMS saying "${message}" to ${number}`);
      }
    }
  }
  static close() {
    debug.log('Disconnected from SMS server.');
  }
}
module.exports = DeviceSMS;
