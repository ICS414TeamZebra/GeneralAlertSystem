// passing to renderer

const names = require('./names');

function create(res, alertType, args, err) {
  const {
    urlForm,
    event,
    message,
    methods,
    locations,
  } = args;

  const eventsSelected = Object.entries(names.events).map(([id, name]) => (
    { id, name, selected: (event === id) }
  ));
  const methodsSelected = Object.entries(names.alertMethods).map(([id, name]) => (
    { id, name, selected: methods.includes(id) }
  ));
  const locationsSelected = Object.entries(names.locations).map(([id, name]) => (
    { id, name, selected: locations.includes(id) }
  ));

  res.render('alert/create', {
    alertType,
    live: (alertType === 'live'),
    error: err,
    events: eventsSelected,
    message,
    methods: methodsSelected,
    locations: locationsSelected,
    urlForm,
  });
}

function confirm(res, alertType, args, err) {
  const {
    urlForm,
    alertId,
    event,
    message,
    methods,
    locations,
    confirmString,
    username = '',
  } = args;


  const eventSelected = names.events[event];
  const methodsSelected = Object.entries(names.alertMethods).map(([id, name]) => (
    { id, name, selected: methods.includes(id) }
  ));
  const locationsSelected = Object.entries(names.locations).map(([id, name]) => (
    { id, name, selected: locations.includes(id) }
  ));

  const summary = {
    event: eventSelected,
    message,
    methods: methodsSelected,
    locations: locationsSelected,
  };

  res.render('alert/confirm', {
    alertType,
    live: (alertType === 'live'),
    alertId,
    summary,
    // never prefill confirm
    username,
    // never prefill password
    confirmString,
    urlForm,
    error: err,
  });
}

function receipt(res, alertType, args) {
  const {
    alertId,
    event,
    message,
    methods,
    locations,
    date,
    urlCancel,
    urlFinish,
  } = args;

  // demo info
  const eventSelected = names.events[event];
  const methodsSelected = Object.entries(names.alertMethods).map(([id, name]) => (
    { id, name, selected: methods.includes(id) }
  ));
  const locationsSelected = Object.entries(names.locations).map(([id, name]) => (
    { id, name, selected: locations.includes(id) }
  ));

  const summary = {
    event: eventSelected,
    message,
    methods: methodsSelected,
    locations: locationsSelected,
  };

  res.render('alert/receipt', {
    alertType,
    live: (alertType === 'live'),
    alertId,
    summary,
    date,
    urlCancel,
    urlFinish,
  });
}

const alertRenderer = {
  create,
  confirm,
  receipt,
};

module.exports = alertRenderer;