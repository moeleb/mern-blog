const Post = require("../models/post.model");
const { errorHandler } = require("../utils/error");

const create = async (req, res, next) => {
    console.log("here");
    // Check if the user is an admin
    console.log(req.user.isAdmin);
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to create the post'));
    }

    // Validate required fields
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, 'Please provide all necessary fields'));
    }

    // Generate slug from title
    const slug = req.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-');

    try {
        // Create new post
        const newPost = await Post.create({
            ...req.body,
            slug,
            userId: req.user.id
        });

        // Respond with the created post
        res.status(201).json(newPost);
    } catch (e) {
        // Pass error to next middleware
        next(e);
    }
};
const getPosts = async(req,res,next)=>{
    try{
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order ==='asc' ?1 : -1 ;
        const posts = await Post.find({
            ...(req.query.userId && {userId : req.query.userId}),
            ...(req.query.category && {category : req.query.category}),
            ...(req.query.slug && {slug : req.query.slug}),
            ...(req.query.postId && {_id : req.query.postId}),
            ...(req.query.searchTerm && {
                $or : [
                    {title: {$regex : req.query.searchTerm, $options : 'i' }},
                    {content: {$regex : req.query.searchTerm, $options : 'i' }},
                ]
            })
        }).sort({updatedAt: sortDirection}).skip(startIndex).limit(limit)
        
        const totalPosts = await Post.countDocuments();
        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() -1,
            now.getDate()
        );
        const lastMonthPosts = await Post.countDocuments({
            createdAt : {$gte: oneMonthAgo} 
        })
        res.json({
            posts,
            totalPosts,
            lastMonthPosts
        })
    }catch(e){
        next(e)
    }
}

const deletePost = async (req,res,next) =>{
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to delete the post'));
    }
    try{
        await Post.findByIdAndDelete(req.params.postId)
        res.status(200).json("POST HAS BEEN DELETED")
    } 
    catch(e){
        next(e)
    }

}
const updatePost = async(req,res)=>{
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update the post'));
    }
    try{
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId,{
            $set:{
                title : req.body.title,
                content : req.body.content,
                category : req.body.category,
                image: req.body.image
            }
        }, {new:true})
        res.status(200).json(updatedPost);
    }catch(e){
            next(e)
    }

}
module.exports = {
    create, getPosts, deletePost,updatePost
};