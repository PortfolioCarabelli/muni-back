const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const sendRecoverEmail = require('../services/email.service');
const crypto = require('crypto');

const generateRecoverToken = () => {
    const token = crypto.randomBytes(20).toString('hex');
    return token;
};

exports.register = async (req, res) => {
    try {
        const { email, password, first_name, last_name, roleCode } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }
        user = new User({
            email,
            password,
            first_name,
            last_name,
            roleCode // Asegúrate de que estás proporcionando el campo roleCode en la solicitud
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.json({ msg: 'Usuario registrado exitosamente' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }
        const fullName = user.first_name + ' ' + user.last_name;
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(payload, config.jwtSecret, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token, fullName, roleCode: user.roleCode }); 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: 'El usuario no existe' });
        }

        const recoverToken = generateRecoverToken();

        user.recoverToken = recoverToken;
        await user.save();

        sendRecoverEmail(user.email, recoverToken);

        res.json({ msg: 'Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({ recoverToken: token });

        if (!user) {
            return res.status(404).json({ msg: 'Token inválido o expirado' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.recoverToken = null;
        await user.save();

        res.json({ msg: 'Contraseña restablecida exitosamente' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

exports.createUser = async (req, res) => {
    try {
        first_name = req.body.email.first_name;
        last_name = req.body.email.last_name;
        email = req.body.email.email;
        password = req.body.email.password;
        roleCode = req.body.email.roleCode

        let user = await User.findOne({ email });
   
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            email,
            password: hashedPassword,
            first_name,
            last_name,
            roleCode
        });

        await user.save();
        res.json({ msg: 'Usuario creado exitosamente', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        first_name = req.body.email.first_name;
        last_name = req.body.email.last_name;
        email = req.body.email.email;
        password = req.body.email.password;
        roleCode = req.body.email.roleCode
      
        let user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        user.first_name = first_name;
        user.last_name = last_name;
        user.email = email;
        user.password = hashedPassword;
        user.roleCode = roleCode;

        await user.save();
        res.json({ msg: 'Usuario actualizado exitosamente', user });
    } catch (err) {
        console.error('este es el error: ' + err.message);
        res.status(500).send('Error del servidor');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        await User.findByIdAndDelete(user._id); 
        res.json({ msg: 'Usuario eliminado exitosamente' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};
