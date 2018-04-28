const DeviceGeneric = require('lib/DeviceManager/DeviceGeneric');
const debug = require('lib/debugger')('DeviceEAS');
const names = require('lib/names');

let locations;
let message;

class DeviceEAS extends DeviceGeneric {
  static open() {
    debug.log('Connected to EAS.');
  }
  static configure(strCommand) {
    const conf = JSON.parse(strCommand);
    ({ locations, message } = conf);
  }
  static test(strTest, strResult) {
    for (const location of locations) {
      debug.log(`EAS testing "${message}" in ${names.locations[location]}`);
    }
  }
  static warningON(mode) {
    for (const location of locations) {
      debug.log(`EAS starting warning with "${message}" in ${names.locations[location]}`);
    }
  }
  static warningOFF() {
    for (const location of locations) {
      debug.log(`EAS ending warning with "${message}" in ${names.locations[location]}`);
    }
  }
  static close() {
    debug.log('Disconnected from EAS.');
  }
}

module.exports = DeviceEAS;
