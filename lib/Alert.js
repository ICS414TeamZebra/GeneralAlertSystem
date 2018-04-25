const flatfile = require('flat-file-db');
const uid = require('uid-safe');

const filename = 'db/Alert.db';
let db = null;

const ActionLog = require('lib/ActionLog');
const debug = require('lib/debugger')('Alert');

function dbLoad() {
  if (!db) {
    db = flatfile.sync(filename);
  }
}

class Alert {
  // create(obj) - returns unique key
  static create(model) {
    dbLoad();
    let id = null;
    while (!id || db.has(id)) {
      id = uid.sync(18);
    }
    db.put(id, { id, ...model });
    ActionLog.logAlertCreate(id, model);
    debug.log(`new: ${id}`, model);
    return id;
  }
  static exists(id) {
    dbLoad();
    return db.has(id);
  }
  static delete(id) {
    dbLoad();
    if (db.has(id)) {
      db.del(id);
      debug.log(`deleted: ${id}`);
      return true;
    }
    return false;
  }
  static get(id) {
    dbLoad();
    if (db.has(id)) {
      return db.get(id);
    }
    return false;
  }

  static send(id, user, supervisor) {
    dbLoad();
    if (db.has(id)) {
      const model = db.get(id);
      model.sent = {
        user,
        supervisor,
        date: new Date(),
      };
      model.status = 'sent';
      ActionLog.logAlertSent(id, model);
      debug.log(`sent: ${id}`, model);
      db.put(id, model);
      return true;
    }
    return false;
  }
  static cancel(id, user, supervisor) {
    dbLoad();
    if (db.has(id)) {
      const model = db.get(id);
      model.cancelled = {
        ...model.cancelled,
        user,
        supervisor,
        date: new Date(),
      };
      model.status = 'cancelled';
      ActionLog.logAlertCancel(id, model);
      debug.log(`cancelled: ${id}`, model);
      db.put(id, model);
      return true;
    }
    return false;
  }

  static checkSent(id) {
    dbLoad();
    if (db.has(id)) {
      const model = db.get(id);
      return model.status === 'sent';
    }
    return false;
  }
  static checkCancelled(id) {
    dbLoad();
    if (db.has(id)) {
      const model = db.get(id);
      return model.status === 'cancelled';
    }
    return false;
  }

  static setCancelled(id) {

  }

  // update(key, obj) - only works key exists
  static update(id, model) {
    dbLoad();
    if (db.has(id)) {
      debug.log(`updated: ${id}`, model);
      db.put(id, model);
      return true;
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
  static list() {
    dbLoad();
    return db.keys();
  }
}

module.exports = Alert;
