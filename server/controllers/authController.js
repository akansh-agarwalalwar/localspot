const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logActivity } = require('../utils/activityLogger');

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user || !user.isActive) {
            await logActivity(null, 'LOGIN', 'USER', null, `Failed login attempt for ${email}`, 
                req.ip, req.get('User-Agent'), 'FAILED');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            await logActivity(user._id, 'LOGIN', 'USER', user._id.toString(), 'Invalid password', 
                req.ip, req.get('User-Agent'), 'FAILED');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        user.lastLogin = new Date();
        await user.save();

        const token = generateToken(user._id);

        await logActivity(user._id, 'LOGIN', 'USER', user._id.toString(), 'Successful login', 
            req.ip, req.get('User-Agent'));

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                permissions: user.permissions,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const logout = async (req, res) => {
    try {
        await logActivity(req.user._id, 'LOGOUT', 'USER', req.user._id.toString(), 'User logged out', 
            req.ip, req.get('User-Agent'));
        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getProfile = async (req, res) => {
    try {
        res.json({
            user: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                role: req.user.role,
                permissions: req.user.permissions,
                lastLogin: req.user.lastLogin
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    login,
    logout,
    getProfile
};
