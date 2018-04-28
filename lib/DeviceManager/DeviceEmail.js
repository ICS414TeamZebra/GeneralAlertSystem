const DeviceGeneric = require('lib/DeviceManager/DeviceGeneric');
const debug = require('lib/debugger')('DeviceEmail');
const names = require('lib/names');

const testLocations = Object.keys(names.locations);
const testEmails = {};
for (const location of testLocations) {
  testEmails[location] = [`${location}@example.com`, `${location}2@example.com`];
}

let locations;
let message;

class DeviceEmail extends DeviceGeneric {
  static open() {
    debug.log('Connected to email server.');
  }
  static configure(strCommand) {
    const conf = JSON.parse(strCommand);
    ({ locations, message } = conf);
  }
  static test(strTest, strResult) {
    for (const location of locations) {
      debug.log(`Emailing people in ${names.locations[location]}`);
      for (const email of testEmails[location]) {
        debug.log(`\t- Sending test email "${message}" to ${email}`);
      }
    }
  }
  static warningON(mode) {
    for (const location of locations) {
      debug.log(`Emailing people in ${names.locations[location]}`);
      for (const email of testEmails[location]) {
        debug.log(`\t- Sending warning email "${message}" to ${email}`);
      }
    }
  }
  static warningOFF() {
    for (const location of locations) {
      debug.log(`Emailing people in ${names.locations[location]}`);
      for (const email of testEmails[location]) {
        debug.log(`\t- Sending cancellation email "${message}" to ${email}`);
      }
    }
  }
  static close() {
    debug.log('Disconnected from email server.');
  }
}

module.exports = DeviceEmail;
