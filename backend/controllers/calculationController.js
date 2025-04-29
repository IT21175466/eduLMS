const Calculation = require('../models/Calculation');

// Perform calculation
exports.calculate = async (req, res) => {
    const { num1, num2, operation, associatedCourseId } = req.body;
    let result;

    if (operation === 'add') {
        result = num1 + num2;
    } else if (operation === 'subtract') {
        result = num1 - num2;
    } else {
        return res.status(400).json({ message: 'Invalid operation' });
    }

    try {
        const calculation = new Calculation({ num1, num2, result, operation, associatedCourseId });
        await calculation.save();
        res.status(201).json({ result });
    } catch (error) {
        res.status(500).json({ message: 'Error performing calculation', error });
    }
};
