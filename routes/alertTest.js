const DeviceManager = require('lib/DeviceManager');

const router = require('lib/alertRouter')(
  'test', 'TEST ALERT',
  (alert) => {
    const config = '';
    for (const device of alert.methods) {
      DeviceManager.open(device);
      DeviceManager.configure(config);
      DeviceManager.warningON(device, alert.message);
      DeviceManager.close(device);
    }
  },
);

module.exports = router;

