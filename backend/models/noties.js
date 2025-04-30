const mongoose = require('mongoose');

const noticesSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
});

module.exports = mongoose.model('Noties', noticesSchema);
