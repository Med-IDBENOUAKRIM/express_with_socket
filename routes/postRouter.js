const router = require("express").Router();
const {
  createPost,
  getAllPosts,
  getOnePost,
  deleteOnePost,
  likePost,
  unlikePost,
  getAllLikes,
  createComment,
  deleteComment,
} = require("../controllers/postController");
const { isSignIn } = require("../middlewares/auth");

router.post("/new", isSignIn, createPost);
router.get("/", isSignIn, getAllPosts);
router.get("/:postId", isSignIn, getOnePost);

router.put("/like/:postId", isSignIn, likePost);
router.put("/unlike/:postId", isSignIn, unlikePost);
router.delete("/:postId", isSignIn, deleteOnePost);
router.get("/likes/:postId", getAllLikes);

router.post("/new/comment/:postId", isSignIn, createComment);
router.delete("/:postId/:commentId", isSignIn, deleteComment);

module.exports = router;
