const flatfile = require('flat-file-db');
const bcrypt = require('bcrypt');

const filename = 'db/User.db';
let db = null;

const debug = require('lib/debugger')('User');
const ActionLog = require('lib/ActionLog');

const salts = 10;

function dbLoad() {
  if (!db) {
    db = flatfile.sync(filename);
  }
}

class User {
  static login(id, password) {
    if (User.checkLogin(id, password)) {
      ActionLog.logLogin(id);
      return true;
    }
    return false;
  }
  static checkLogin(id, password) {
    dbLoad();
    if (db.has(id)) {
      const user = db.get(id);
      return bcrypt.compareSync(password, user.hash);
    }
    return false;
  }
  static checkRole(id, role) {
    dbLoad();
    if (db.has(id)) {
      const user = db.get(id);
      return user.role === role;
    }
    return false;
  }
  static create(id, password, role = 'default') {
    dbLoad();
    if (!db.has(id)) {
      const hash = bcrypt.hashSync(password, salts);
      const user = { hash, role };

      debug.log(`new: ${id}, ${role}`);
      db.put(id, user);
      return true;
    }
    return false;
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

module.exports = User;
