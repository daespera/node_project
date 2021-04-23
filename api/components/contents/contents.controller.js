const contentsRepo = require('./contents.repository');

module.exports = {
  ...require('../../infrastructure/base.controller')(contentsRepo)
};
