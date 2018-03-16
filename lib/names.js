// names of things

const events = {
  amber: 'Amber Alert',
  surf: 'High Surf Advisory',
  missile: 'Missile Inbound',
  tsunami: 'Tsunami',
  other: 'Other',
};

const alertMethods = {
  siren: 'Warning Sirens',
  sms: 'Text Messages',
  reverse911: 'Reverse 911',
  eas: 'Emergency Alert System',
};
const cancelMethods = { ...alertMethods };

/*
const cancelMethods = {
  sms: alertMethods.sms,
  reverse911: alertMethods.reverse911,
  eas: alertMethods.eas,
};
*/

const locations = {
  hawaii: 'Hawaiʻi',
  maui: 'Maui',
  oahu: 'Oʻahu',
  kauai: 'Kauaʻi',
  molokai: 'Molokaʻi',
  lanai: 'Lānaʻi',
  niihau: 'Niʻihau',
  kahoolawe: 'Kahoʻolawe',
};

const names = {
  events,
  alertMethods,
  cancelMethods,
  locations,
};

module.exports = names;
