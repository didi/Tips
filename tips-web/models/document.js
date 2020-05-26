const mongoose = require('mongoose');
const DocumentScemas = require('../schemas/document');

module.exports = mongoose.model('Document', DocumentScemas);
