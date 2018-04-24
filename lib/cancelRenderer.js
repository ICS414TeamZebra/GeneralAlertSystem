// passing to renderer

const names = require('lib/names');

function create(res, args, err) {
  const {
    alert,
    alerts,
    message,
    methods = [],
    locations = [],
    urlForm,
  } = args;

  // console.log(alerts);

  const alertsSelected = alerts.map((salert, index) => {
    // console.log(salert);
    return {
      id: salert.id,
      name: names.events[salert.event],
      selected: (alert && alert.id === salert.id) || false,
    };
  });
  // console.log(alertsSelected);

  const methodsSelected = Object.entries(names.cancelMethods).map(([id, name]) => (
    { id, name, selected: methods.includes(id) }
  ));
  const locationsSelected = Object.entries(names.locations).map(([id, name]) => (
    { id, name, selected: locations.includes(id) }
  ));

  res.render('cancel/create', {
    error: err,
    alerts: alertsSelected,
    message,
    methods: methodsSelected,
    locations: locationsSelected,
    urlForm,
  });
}

function confirm(res, args, err) {
  const {
    urlForm,
    alert,
    date,
    message,
    methods,
    locations,
    confirmString,
    username = '',
  } = args;


  const alertName = names.events[alert.event];
  const alertDate = alert.date;
  const methodsSelected = Object.entries(names.cancelMethods).map(([id, name]) => (
    { id, name, selected: methods.includes(id) }
  ));
  const locationsSelected = Object.entries(names.locations).map(([id, name]) => (
    { id, name, selected: locations.includes(id) }
  ));

  const summary = {
    alertName,
    alertDate,
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
    error: err,
  });
}

function receipt(res, args) {
  const {
    alert,
    date,
    message,
    methods,
    locations,
    urlFinish,
  } = args;

  // demo info
  const alertName = names.events[alert.event];
  const alertDate = alert.date;
  const methodsSelected = Object.entries(names.cancelMethods).map(([id, name]) => (
    { id, name, selected: methods.includes(id) }
  ));
  const locationsSelected = Object.entries(names.locations).map(([id, name]) => (
    { id, name, selected: locations.includes(id) }
  ));

  const summary = {
    alertName,
    alertDate,
    message,
    methods: methodsSelected,
    locations: locationsSelected,
  };

  res.render('cancel/receipt', {
    summary,
    date,
    urlFinish,
  });
}

const cancelRenderer = {
  create,
  confirm,
  receipt,
};

module.exports = cancelRenderer;
