const DeviceManager = require('lib/DeviceManager');

const router = require('./alert')(
  'test', 'TEST ALERT',
  (alert) => {
    const config = '';
    for (const device of alert.methods) {
      DeviceManager.open(device);
      DeviceManager.configure(device, config);
      DeviceManager.warningON(device, alert.message);
      DeviceManager.close(device);
    }
  },
);

module.exports = router;

