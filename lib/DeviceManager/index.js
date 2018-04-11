/* We are going to take the approach that the original UNIX system kernel used for i/o devices. No matter what the device (a disk, a modem, a printer, a keyboard ....) the application programmer's interface was the same system calls. For this project we'll call them open(device), configure(device, commandstring), test(device, teststring, resultstring), warningON(device, devicemode), warningOFF(device), close(device), where the type device represents different warning modes (siren, reverse 911, SMS (text) message, email, EAS) */

const DeviceStub = require('./DeviceStub');

const devices = {
  siren: DeviceStub,
  sms: DeviceStub,
  reverse911: DeviceStub,
  eas: DeviceStub,
};

function validDevice(device, fn) {
  try {
    if (!devices[device]) {
      throw new Error(`No device called "${device}".`);
    }
    if ((typeof devices[device][fn]) !== 'function') {
      throw new Error(`"${device}" doesn't have a static method "${fn}".`);
    }
    return true;
  } catch (e) {
    console.error(`DeviceManager ${e.name}`, `${e.message}`);
    return false;
  }
}

class DeviceManager {
  static open(device) {
    if (validDevice(device, 'open')) {
      return devices[device].open();
    }
  }
  static configure(device, strCommand) {
    if (validDevice(device, 'configure')) {
      return devices[device].configure(strCommand);
    }
  }
  static test(device, strTest, strResult) {
    if (validDevice(device, 'test')) {
      return devices[device].test(strTest, strResult);
    }
  }
  static warningON(device, mode) {
    if (validDevice(device, 'warningON')) {
      return devices[device].warningON(mode);
    }
  }
  static warningOFF(device) {
    if (validDevice(device, 'warningOFF')) {
      return devices[device].warningOFF();
    }
  }
  static close(device) {
    if (validDevice(device, 'close')) {
      return devices[device].close();
    }
  }
}

module.exports = DeviceManager;
