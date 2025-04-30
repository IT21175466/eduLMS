const Noties = require('../models/noties');

// Create Noties
exports.createNoties = async (req, res) => {
    const { title, description, category } = req.body;

    try {
        const noties = new Noties({ title, description, category });
        await noties.save();
        res.status(201).json({ message: 'Noties created successfully', noties });
    } catch (error) {
        res.status(500).json({ message: 'Error creating noties', error });
    }
};

// Update Noties
exports.updateNoties = async (req, res) => {
    const { notiesId, title, description, category } = req.body;

    try {
        const noties = await Noties.findByIdAndUpdate(notiesId, { title, description, category }, { new: true });
        res.status(200).json({ message: 'Noties updated successfully', noties });
    } catch (error) {
        res.status(500).json({ message: 'Error updating noties', error });
    }
};

// Get All Notieses
exports.getAllNotieses = async (req, res) => {
    try {
        const notieses = await Noties.find();
        res.status(200).json(notieses);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving notieses', error });
    }
};

// Delete Noties
exports.deleteNoties = async (req, res) => {
    const { notiesId } = req.body;

    try {
        await Noties.findByIdAndDelete(notiesId);
        res.status(200).json({ message: 'Noties deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting noties', error });
    }
};