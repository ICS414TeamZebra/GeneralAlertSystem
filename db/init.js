const ActionLog = require('lib/ActionLog');
const Alert = require('lib/Alert');
const User = require('lib/User');
const debug = require('lib/debugger')('db/init');

ActionLog.clear();
Alert.clear();
User.clear();
User.create('bill', 'password');
User.create('john', 'password', 'supervisor');
debug.log('Actions: ', Alert.list());
debug.log('Alerts: ', Alert.list());
debug.log('Users: ', User.list());
