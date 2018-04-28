const DeviceManager = require('lib/DeviceManager');

const router = require('./alert')(
  'live', 'LIVE ALERT',
  (alert) => {
    const config = JSON.stringify({
      message: alert.message,
      locations: alert.locations,
    });
    for (const device of alert.methods) {
      DeviceManager.open(device);
      DeviceManager.configure(device, config);
      DeviceManager.warningON(device);
      DeviceManager.close(device);
    }
  },
);

module.exports = router;
