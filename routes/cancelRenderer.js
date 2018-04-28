// passing to renderer

const names = require('lib/names');

function create(res, args, errors) {
  const {
    alertId,
    alerts,
    message,
    urlForm,
  } = args;

  const alertsSelected = Object.values(alerts).map(alert => ({
    id: alert.id,
    name: `${names.events[alert.event]} - sent ${new Date(alert.sent.date).toUTCString()}`,
    selected: (alertId === alert.id),
  }));

  res.render('cancel/create', {
    errors,
    alerts: alertsSelected,
    message,
    urlForm,
  });
}

function confirm(res, args, errors) {
  const {
    urlForm,
    alert,
    message,
    confirmString,
    username = '',
  } = args;


  const methodsSelected = Object.entries(names.cancelMethods).map(([id, name]) => (
    { id, name, selected: alert.methods.includes(id) }
  ));
  const locationsSelected = Object.entries(names.locations).map(([id, name]) => (
    { id, name, selected: alert.locations.includes(id) }
  ));

  const summary = {
    name: names.events[alert.event],
    date: new Date(alert.sent.date).toUTCString(),
    message,
    methods: methodsSelected,
    locations: locationsSelected,
  };

  res.render('cancel/confirm', {
    summary,
    // never prefill confirm
    username,
    // never prefill password
    confirmString,
    urlForm,
    errors,
  });
}

function receipt(res, args) {
  const {
    alert,
    urlFinish,
  } = args;

  // demo info
  const methodsSelected = Object.entries(names.cancelMethods).map(([id, name]) => (
    { id, name, selected: alert.methods.includes(id) }
  ));
  const locationsSelected = Object.entries(names.locations).map(([id, name]) => (
    { id, name, selected: alert.locations.includes(id) }
  ));

  const summary = {
    name: names.events[alert.event],
    date: new Date(alert.sent.date).toUTCString(),
    message: alert.cancelled.message,
    methods: methodsSelected,
    locations: locationsSelected,
  };

  res.render('cancel/receipt', {
    alert,
    summary,
    urlFinish,
  });
}

const cancelRenderer = {
  create,
  confirm,
  receipt,
};

module.exports = cancelRenderer;
