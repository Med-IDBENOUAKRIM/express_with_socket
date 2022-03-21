const router = require('express').Router();
const { getChats } = require('../controllers/chatController');
const { isSignIn } = require('../middlewares/auth');

router.get('/', isSignIn, getChats);

module.exports = router;