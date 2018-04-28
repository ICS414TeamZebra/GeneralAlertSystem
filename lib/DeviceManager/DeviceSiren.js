const DeviceGeneric = require('lib/DeviceManager/DeviceGeneric');
const debug = require('lib/debugger')('DeviceSiren');
const names = require('lib/names');

let locations;

class DeviceSiren extends DeviceGeneric {
  static open() {
    console.log('Connected to siren network.');
  }
  static configure(strCommand) {
    const conf = JSON.parse(strCommand);
    ({ locations } = conf);
  }
  static test(strTest, strResult) {
    for (const location of locations) {
      console.log(`Siren testing in ${names.locations[location]}`);
    }
  }
  static warningON(mode) {
    for (const location of locations) {
      console.log(`Siren starting in ${names.locations[location]}`);
    }
  }
  static warningOFF() {
    for (const location of locations) {
      console.log(`Siren stopping in ${names.locations[location]}`);
    }
  }
  static close() {
    console.log('Disconnected from siren network.');
  }
}

module.exports = DeviceSiren;
