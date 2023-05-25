'use strict';

require('dotenv').config();
const { db } = require('./src/models');
const appAPI = require('./src/server');
// const appAUTH = require('./auth-server/src/server')
const PORT1 = process.env.PORT1 || 3002;
// const PORT2 = process.env.POR2 || 3003;

db.sync().then(() => {
  appAPI.start(PORT1);
  // appAUTH.start(PORT2);
});
