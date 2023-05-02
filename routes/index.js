const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/tasks', require('./tasks'));

module.exports = router;