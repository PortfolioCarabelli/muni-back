const express = require('express');
const router = express.Router();
const protectedRoute = require('./protectedRoute');

router.use('/protected', protectedRoute);

module.exports = router;
