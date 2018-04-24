const flatfile = require('flat-file-db');
// const uid = require('uid-safe');

const filename = 'db/Alert.db';
let db = null;

const debug = require('lib/debugger')('Alert');

function dbLoad() {
  if (!db) {
    db = flatfile.sync(filename);
  }
}

class ActionLog {
  // create(obj) - returns unique key
  static log(message) {
    dbLoad();
    const id = db.keys().length + 1;
    const model = {
      message,
      date: new Date(),
    };
    db.put(id, model);
    debug.log(`${model.date}: ${model.message}`);
    return id;
  }

  static logLogin(username) {
    ActionLog.log(`Login from ${username}`);
  }
  static logAlertCreate(id, alert) {
    ActionLog.log(`${alert.type} alert ${id} created by ${alert.user}`);
  }
  static logAlertDelete(id, alert) {
    ActionLog.log(`${alert.type} alert ${id} deleted by ${alert.user}`);
  }
  static logAlertSent(id, alert) {
    ActionLog.log(`${alert.type} alert ${id} sent by ${alert.sent.user}, approved by ${alert.sent.supervisor}`);
  }
  static logAlertCancelCreate(id, alert) {
    ActionLog.log(`Cancellation for ${alert.type} ${id} created by ${alert.cancel.user}`);
  }
  static logAlertCancelConfirm(id, alert) {
    ActionLog.log(`Cancellation for ${alert.type} ${id} created by ${alert.cancel.user}`);
  }

  static get(id) {
    dbLoad();
    if (db.has(id)) {
      return db.get(id);
    }
    return false;
  }

  static all() {
    dbLoad();
    const all = [];
    for (const key of db.keys()) {
      all.push(db.get(key));
    }
    return all;
  }
  static clear() {
    dbLoad();
    debug.log('cleared.');
    db.clear();
  }
  static count() {
    dbLoad();
    return db.keys().length;
  }
}

module.exports = ActionLog;
