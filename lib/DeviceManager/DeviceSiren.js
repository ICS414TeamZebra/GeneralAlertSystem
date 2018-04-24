const notImplemented = require('lib/notImplemented')('DeviceSiren');

class DeviceSiren {
  static open() {
    notImplemented('open');
  }
  static configure(strCommand) {
    notImplemented('configure');
  }
  static test(strTest, strResult) {
    notImplemented('test');
  }
  static warningON(mode) {
    notImplemented('warningON');
  }
  static warningOFF() {
    notImplemented('warningOFF');
  }
  static close() {
    notImplemented('close');
  }
}

module.exports = DeviceSiren;
