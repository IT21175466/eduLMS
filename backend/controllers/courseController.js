const Course = require('../models/Course');

// Create Course
exports.createCourse = async (req, res) => {
    const { title, description, modules } = req.body;

    try {
        const course = new Course({ instructorId: req.userId, title, description, modules });
        await course.save();
        res.status(201).json({ message: 'Course created successfully', course });
    } catch (error) {
        res.status(500).json({ message: 'Error creating course', error });
    }
};

// Update Course
exports.updateCourse = async (req, res) => {
    const { courseId, title, description, modules } = req.body;

    try {
        const course = await Course.findByIdAndUpdate(courseId, { title, description, modules }, { new: true });
        res.status(200).json({ message: 'Course updated successfully', course });
    } catch (error) {
        res.status(500).json({ message: 'Error updating course', error });
    }
};

// Delete Course
exports.deleteCourse = async (req, res) => {
    const { courseId } = req.body;

    try {
        await Course.findByIdAndDelete(courseId);
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting course', error });
    }
};

// Get All Courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving courses', error });
    }
};
