const router = require('express').Router()
const { getNotifications, notificationToRead } = require('../controllers/notificationController');
const { isSignIn } = require('../middlewares/auth');


router.get('/', isSignIn, getNotifications);
router.put('/', isSignIn, notificationToRead);

module.exports = router;