const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logActivity } = require('../utils/activityLogger');

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
};

const register = async (req, res) => {
    try {
        const { username, name, email, password, branch, year, state } = req.body;

        if (!username || !name || !email || !password || !branch || !year || !state) {
            return res.status(400).json({ 
                message: 'Username, name, email, password, branch, year, and state are required' 
            });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ message: 'User with this email already exists' });
            }
            if (existingUser.username === username) {
                return res.status(400).json({ message: 'Username is already taken' });
            }
        }

        const user = new User({
            username,
            name,
            email,
            password,
            branch,
            year,
            state,
            role: 'user' // Regular user role for signups
        });

        await user.save();

        await logActivity(user._id, 'SIGNUP', 'USER', user._id.toString(), 
            `New user registered: ${name} (${email})`, req.ip, req.get('User-Agent'));

        const token = generateToken(user._id);

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role,
                branch: user.branch,
                year: user.year,
                state: user.state,
                permissions: user.permissions
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
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
                name: user.name,
                email: user.email,
                role: user.role,
                branch: user.branch,
                year: user.year,
                state: user.state,
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
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                branch: req.user.branch,
                year: req.user.year,
                state: req.user.state,
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
    register,
    login,
    logout,
    getProfile
};
