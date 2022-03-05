const router = require('express').Router();
const { getProfile, getOwnPosts, getFollowers, getFollowing, followSomeOne, unFollowSomeOne } = require('../controllers/profileController');
const { isSignIn } = require('../middlewares/auth');

router.get('/:username', isSignIn, getProfile);
router.get('/posts/:username', isSignIn, getOwnPosts);
router.get('/followers/:userId', isSignIn, getFollowers);
router.get('/following/:userId', isSignIn, getFollowing);
router.post('/follow/:userToFollowId', isSignIn, followSomeOne);
router.put('/unfollow/:userToUnFollowId', isSignIn, unFollowSomeOne);

module.exports = router;