const router = require('express').Router();
const { signup, signin, get__one } = require('../controllers/authController');
const { validateSignUpInputs, validateSignInInputs } = require('../middlewares/validateInput');
const { isSignIn } = require('../middlewares/auth');

router.get('/', isSignIn, get__one);
router.post('/signup', validateSignUpInputs, signup);
router.post('/signin', validateSignInInputs, signin);

module.exports = router;