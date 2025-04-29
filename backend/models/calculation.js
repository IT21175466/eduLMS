const mongoose = require('mongoose');

const calculationSchema = new mongoose.Schema({
    num1: { type: Number, required: true },
    num2: { type: Number, required: true },
    result: { type: Number },
    operation: { type: String, required: true },
    associatedCourseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Optional: Link calculation to a specific course
});

module.exports = mongoose.model('Calculation', calculationSchema);
