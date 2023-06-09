const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/tasks', require('./tasks'));
router.use('/tests', require('./tests'));
router.use('/screens', require('./screens'));

module.exports = router;