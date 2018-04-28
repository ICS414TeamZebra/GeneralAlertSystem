const DeviceGeneric = require('lib/DeviceManager/DeviceGeneric');
const debug = require('lib/debugger')('DeviceR911');
const names = require('lib/names');

const testLocations = Object.keys(names.locations);
const testNumbers = {};
for (const location of testLocations) {
  testNumbers[location] = ['808-555-1234', '808-422-2222'];
}

let locations;
let message;

class DeviceR911 extends DeviceGeneric {
  static open() {
    console.log('Connected to email server.');
  }
  static configure(strCommand) {
    const conf = JSON.parse(strCommand);
    ({ locations, message } = conf);
  }
  static test(strTest, strResult) {
    for (const location of locations) {
      console.log(`Calling people in ${names.locations[location]}`);
      for (const number of testNumbers[location]) {
        console.log(`\t- Placing test call saying "${message}" to ${number}`);
      }
    }
  }
  static warningON(mode) {
    for (const location of locations) {
      console.log(`Calling people in ${names.locations[location]}`);
      for (const number of testNumbers[location]) {
        console.log(`\t- Placing test call saying "${message}" to ${number}`);
      }
    }
  }
  static warningOFF() {
    for (const location of locations) {
      console.log(`Calling people in ${names.locations[location]}`);
      for (const number of testNumbers[location]) {
        console.log(`\t- Placing test call saying "${message}" to ${number}`);
      }
    }
  }
  static close() {
    console.log('Disconnected from email server.');
  }
}
module.exports = DeviceR911;
