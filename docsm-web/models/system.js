const mongoose = require('mongoose');
const SystemScemas = require('../schemas/system');

module.exports = mongoose.model('System', SystemScemas);
