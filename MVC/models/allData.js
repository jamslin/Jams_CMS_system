const mongoose = require('mongoose');

// Define a flexible schema for the collection
const flexibleSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model('posts', flexibleSchema);