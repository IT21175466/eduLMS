const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    courseId: { type: String, required: false },
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
});

module.exports = mongoose.model('Assignment', assignmentSchema);
