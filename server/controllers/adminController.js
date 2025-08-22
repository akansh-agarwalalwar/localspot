const User = require('../models/User');
const { logActivity } = require('../utils/activityLogger');

const createSubadmin = async (req, res) => {
    try {
        const { username, email, password, permissions } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        const subadmin = new User({
            username,
            email,
            password,
            role: 'subadmin',
            createdBy: req.user._id,
            permissions: permissions || {
                canCreate: false,
                canRead: true,
                canUpdate: false,
                canDelete: false
            }
        });

        await subadmin.save();

        await logActivity(req.user._id, 'CREATE', 'SUBADMIN', subadmin._id.toString(), 
            `Created subadmin: ${username}`, req.ip, req.get('User-Agent'));

        res.status(201).json({
            message: 'Subadmin created successfully',
            subadmin: {
                id: subadmin._id,
                username: subadmin.username,
                email: subadmin.email,
                role: subadmin.role,
                permissions: subadmin.permissions,
                isActive: subadmin.isActive,
                createdAt: subadmin.createdAt
            }
        });
    } catch (error) {
        console.error('Create subadmin error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllSubadmins = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const subadmins = await User.find({ role: 'subadmin' })
            .select('-password')
            .populate('createdBy', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments({ role: 'subadmin' });

        // Transform _id to id for frontend compatibility
        const transformedSubadmins = subadmins.map(subadmin => ({
            ...subadmin.toObject(),
            id: subadmin._id.toString(),
        }));

        await logActivity(req.user._id, 'READ', 'SUBADMIN', null, 
            `Retrieved subadmins list (page ${page})`, req.ip, req.get('User-Agent'));

        res.json({
            subadmins: transformedSubadmins,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get subadmins error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getSubadminById = async (req, res) => {
    try {
        const { id } = req.params;
        const subadmin = await User.findOne({ _id: id, role: 'subadmin' })
            .select('-password')
            .populate('createdBy', 'username email');

        if (!subadmin) {
            return res.status(404).json({ message: 'Subadmin not found' });
        }

        await logActivity(req.user._id, 'READ', 'SUBADMIN', id, 
            `Retrieved subadmin: ${subadmin.username}`, req.ip, req.get('User-Agent'));

        // Transform _id to id for frontend compatibility
        const transformedSubadmin = {
            ...subadmin.toObject(),
            id: subadmin._id.toString(),
        };

        res.json({ subadmin: transformedSubadmin });
    } catch (error) {
        console.error('Get subadmin error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateSubadmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, permissions, isActive } = req.body;

        const subadmin = await User.findOne({ _id: id, role: 'subadmin' });
        if (!subadmin) {
            return res.status(404).json({ message: 'Subadmin not found' });
        }

        if (username) subadmin.username = username;
        if (email) subadmin.email = email;
        if (permissions) subadmin.permissions = { ...subadmin.permissions, ...permissions };
        if (typeof isActive === 'boolean') subadmin.isActive = isActive;

        await subadmin.save();

        await logActivity(req.user._id, 'UPDATE', 'SUBADMIN', id, 
            `Updated subadmin: ${subadmin.username}`, req.ip, req.get('User-Agent'));

        res.json({
            message: 'Subadmin updated successfully',
            subadmin: {
                id: subadmin._id,
                username: subadmin.username,
                email: subadmin.email,
                role: subadmin.role,
                permissions: subadmin.permissions,
                isActive: subadmin.isActive
            }
        });
    } catch (error) {
        console.error('Update subadmin error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteSubadmin = async (req, res) => {
    try {
        console.log('Delete subadmin request received:', req.params.id);
        console.log('Request user:', req.user ? req.user.username : 'NO USER', 'Role:', req.user ? req.user.role : 'NO ROLE');
        console.log('User permissions:', req.user ? req.user.permissions : 'NO PERMISSIONS');
        
        const { id } = req.params;
        
        // Validate MongoDB ObjectId
        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log('Invalid ObjectId:', id);
            return res.status(400).json({ message: 'Invalid subadmin ID format' });
        }
        
        console.log('Looking for subadmin with ID:', id);
        const subadmin = await User.findOne({ _id: id, role: 'subadmin' });

        if (!subadmin) {
            console.log('Subadmin not found with id:', id);
            return res.status(404).json({ message: 'Subadmin not found' });
        }

        console.log('Found subadmin to delete:', subadmin.username, 'with _id:', subadmin._id);
        
        const deletedSubadmin = await User.findByIdAndDelete(id);
        console.log('Subadmin deleted:', deletedSubadmin ? 'Success' : 'Failed');

        await logActivity(req.user._id, 'DELETE', 'SUBADMIN', id, 
            `Deleted subadmin: ${subadmin.username}`, req.ip, req.get('User-Agent'));

        res.json({ message: 'Subadmin deleted successfully' });
    } catch (error) {
        console.error('Delete subadmin error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = {
    createSubadmin,
    getAllSubadmins,
    getSubadminById,
    updateSubadmin,
    deleteSubadmin
};
