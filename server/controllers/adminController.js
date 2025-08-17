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

        await logActivity(req.user._id, 'READ', 'SUBADMIN', null, 
            `Retrieved subadmins list (page ${page})`, req.ip, req.get('User-Agent'));

        res.json({
            subadmins,
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

        res.json({ subadmin });
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
        const { id } = req.params;
        const subadmin = await User.findOne({ _id: id, role: 'subadmin' });

        if (!subadmin) {
            return res.status(404).json({ message: 'Subadmin not found' });
        }

        await User.findByIdAndDelete(id);

        await logActivity(req.user._id, 'DELETE', 'SUBADMIN', id, 
            `Deleted subadmin: ${subadmin.username}`, req.ip, req.get('User-Agent'));

        res.json({ message: 'Subadmin deleted successfully' });
    } catch (error) {
        console.error('Delete subadmin error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createSubadmin,
    getAllSubadmins,
    getSubadminById,
    updateSubadmin,
    deleteSubadmin
};
