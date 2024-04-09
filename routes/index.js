const ecpress = require('express');
const router = ecpress.Router();
const home_controller = require('../controllers/home_controller');

router.get('/', home_controller.home);
router.use('/user', require('./user'));

module.exports = router;