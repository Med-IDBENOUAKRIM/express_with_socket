const router = require('express').Router()
const { searchUser } = require('../controllers/searchController');
const { isSignIn } = require('../middlewares/auth');

router.get('/:text',searchUser);

module.exports = router