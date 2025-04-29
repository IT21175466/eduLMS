const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    modules: [{ type: String }],
});

module.exports = mongoose.model('Course', courseSchema);
