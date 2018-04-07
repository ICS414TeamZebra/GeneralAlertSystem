const notImplemented = require('./../notImplemented')('DeviceStub');

class DeviceStub {
  static open(device) {
    notImplemented('open');
  }
  static configure(device, strCommand) {
    notImplemented('configure');
  }
  static test(device, strTest, strResult) {
    notImplemented('test');
  }
  static warningON(device, mode) {
    notImplemented('warningON');
  }
  static warningOFF(device) {
    notImplemented('warningOFF');
  }
  static close(device) {
    notImplemented('close');
  }
}

module.exports = DeviceStub;
