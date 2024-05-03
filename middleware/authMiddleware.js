// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

const authMiddleware = (role) => async (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No hay token, acceso denegado' });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        const user = await User.findById(decoded.user.id).select('-password');
        
        // Verificar si el usuario tiene el rol necesario para acceder a la ruta
        if (!user.roles.includes(role)) {
            return res.status(403).json({ msg: 'No tienes permiso para acceder a esta ruta' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token no válido' });
    }
};

module.exports = authMiddleware;
