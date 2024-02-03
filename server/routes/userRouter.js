const router = require("express").Router();
const userController = require("../controllers/userController");
const required = require("../middleware/require");

router.post("/follow", required, userController.followUser);
router.get("/followingPosts", required, userController.getPostOfFollowing);

router.post("/userPosts", required, userController.getUserPosts);
router.get("/delete", required, userController.deleteMyProfile);
router.get("/myInfo", required, userController.getMyInfo);
router.post("/updateProfile", required, userController.updateUserProfile);
router.post("/userProfile", required, userController.getUserProfile);
router.get("/allUser", required, userController.getAllUser);
router.post("/search", required, userController.searchUser);

module.exports = router;
