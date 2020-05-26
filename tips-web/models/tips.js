const mongoose = require('mongoose');
const TipsScemas = require('../schemas/tips');

module.exports = mongoose.model('Tips', TipsScemas);
