const cron = require('node-cron');
const runKnimeWithPath = require('../services/runKnimeWithPath');

cron.schedule('0 8 * * *', () => {
  runKnimeWithPath('C:/Kflux/workflows/daily-report.knwf');
});
