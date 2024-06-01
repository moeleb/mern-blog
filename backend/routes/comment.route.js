const { create ,getPostComment, likeComment, editComment, deleteComment, getComments} = require("../controllers/comment.controller");
const { verifyToken } = require("../utils/verifyUser");

const router = require("express").Router();


router.post("/create", verifyToken, create);
router.get("/getPostComments/:postId",  getPostComment);
router.put("/likeComment/:commentId",verifyToken , likeComment);
router.put("/editComment/:commentId",verifyToken , editComment);
router.delete("/deleteComment/:commentId",verifyToken , deleteComment);
router.get("/getcomments",verifyToken , getComments);

module.exports = router