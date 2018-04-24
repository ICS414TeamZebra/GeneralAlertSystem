const notImplemented = require('lib/notImplemented')('DeviceSMS');

class DeviceSMS {
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

module.exports = DeviceSMS;
