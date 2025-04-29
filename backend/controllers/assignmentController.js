const Assignment = require('../models/Assignment');

// Create Assignment
exports.createAssignment = async (req, res) => {
    const { courseId, title, description, dueDate } = req.body;

    try {
        const assignment = new Assignment({ courseId, title, description, dueDate });
        await assignment.save();
        res.status(201).json({ message: 'Assignment created successfully', assignment });
    } catch (error) {
        res.status(500).json({ message: 'Error creating assignment', error });
    }
};

// Update Assignment
exports.updateAssignment = async (req, res) => {
    const { assignmentId, title, description, dueDate } = req.body;

    try {
        const assignment = await Assignment.findByIdAndUpdate(assignmentId, { title, description, dueDate }, { new: true });
        res.status(200).json({ message: 'Assignment updated successfully', assignment });
    } catch (error) {
        res.status(500).json({ message: 'Error updating assignment', error });
    }
};

// Get All Assignments
exports.getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving assignments', error });
    }
};
