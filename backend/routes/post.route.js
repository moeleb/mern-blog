const { create, getPosts, deletePost, updatePost } = require("../controllers/post.controller")
const { verifyToken } = require("../utils/verifyUser")

const router = require("express").Router()


router.post("/create", verifyToken, create)
router.get("/getPosts", getPosts)
router.delete("/delete/:postId/:userId", verifyToken, deletePost)
router.put("/updatepost/:postId/:userId", verifyToken, updatePost)

module.exports = router ;