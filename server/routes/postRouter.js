const router = require("express").Router();
const postController = require("../controllers/postController");
const required = require("../middleware/require");

router.post("/newPost", required, postController.createPost);
router.post("/like", required, postController.likeAndUnlikePost);

router.post("/delete", required, postController.deletePost);
router.post("/comment", required, postController.commentOnPost);
router.post("/deleteComment", required, postController.deleteComment);

module.exports = router;
