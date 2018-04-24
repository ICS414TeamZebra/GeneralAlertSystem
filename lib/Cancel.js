const flatfile = require('flat-file-db');
const uid = require('uid-safe');

const filename = 'db/Cancel.db';
let db = null;

const debug = require('lib/debugger')('Cancel');

function dbLoad() {
  if (!db) {
    db = flatfile.sync(filename);
  }
}

class Cancel {
  // create(obj) - returns unique key
  static create(model) {
    dbLoad();
    let id = null;
    while (!id || db.has(id)) {
      id = uid.sync(18);
    }
    db.put(id, model);
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

  static checkSent(id) {
    dbLoad();
    if (db.has(id)) {
      const model = db.get(id);
      return model.sent;
    }
    return false;
  }

  static setSent(id, supervisor) {
    dbLoad();
    if (db.has(id)) {
      const model = db.get(id);
      model.sent = new Date();
      debug.log(`sent: ${id}`, model);
      db.put(id, model);
      return true;
    }
    return false;
  }
  static setCancelled(id) {
    dbLoad();
    if (db.has(id)) {
      const model = db.get(id);
      model.cancelled = new Date();
      debug(`cancelled: ${id}`, model);
      db.put(id, model);
      return true;
    }
    return false;
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

module.exports = Cancel;
