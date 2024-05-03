// controllers/roleController.js
const Role = require('../models/Role');

// Función para registrar un nuevo rol
exports.createRole = async (req, res) => {
    try {
        const { name, code, permissions } = req.body;
        // Verificar si ya existe un rol con el mismo código
        const existingRole = await Role.findOne({ code });
        if (existingRole) {
            return res.status(400).json({ msg: 'El rol con este código ya existe' });
        }
        const role = new Role({ name, code, permissions });
        await role.save();
        res.status(201).json({ msg: 'Rol registrado exitosamente', role });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

// Función para obtener todos los roles
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};
