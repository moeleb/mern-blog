const Comment = require("../models/comment.model");
const { errorHandler } = require("../utils/error");

const create = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body;
        console.log(content)
        console.log(postId)
        console.log(userId)
        if (userId !== req.user.id) {
            return next(errorHandler(403, 'Not allowed'));
        }
        const newComment = await Comment.create({
            content,
            postId,
            userId
        });
        res.status(200).json(newComment);
    } catch (e) {
        next(errorHandler(500, 'Internal Server Error'));
    }
};
const getPostComment = async(req,res,next)=>{
    try{
        const comments = await Comment.find({postId : req.params.postId}).sort({createdAt : -1})
        res.json(comments);
    }catch(e){
        next(e)
    }
}
const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Comment not found'));
        }
        const userIndex = comment.likes.indexOf(req.user.id);
        if (userIndex === -1) {
            comment.likes.push(req.user.id);
            comment.numberOfLikes += 1;
        } else {
            comment.likes.splice(userIndex, 1);
            comment.numberOfLikes -= 1;
        }
        await comment.save();
        res.status(200).json(comment);
    } catch (e) {
        next(e);
    }
};

const editComment = async (req,res,next) =>{
    try{
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errorHandler (403,'COmmentnot found'))
        }
        if(comment.userId !==req.user.id && req.user.isAdmin ===false){
            return next(errorHandler(401, 'not allowed'))
        }
        const editComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            {
                content : req.body.content,
            }, 
            {new:true}
        )
        res.status(200).json(editComment);
    }catch(e){
        next(e)
    }
} 

const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Comment not found'));
        }
        if (comment.userId !== req.user.id && req.user.isAdmin === false) {
            return next(errorHandler(401, 'Not allowed'));
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (e) {
        next(e);
    }
};


const  getComments = async (req,res,next)=>{
    if(!req.user.isAdmin) return next(errorHandler(403,"not allowed"));
    try{
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'desc' ? -1 : 1 ;
        const comments = await Comment.find()
        .sort({createdAt: sortDirection})
        .skip(startIndex)
        .limit(limit)
        
        const totalComments = await Comment.countDocuments()
        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() -1,
            now.getDate()
        );
        const lastMonthComments = await Comment.countDocuments({
            createdAt : {$gte: oneMonthAgo} 
        })
        res.status(200).json({
            comments,
            totalComments,
            lastMonthComments
        })
    }catch(e){
        next(e)
    }
}
module.exports = {
    create, getPostComment, likeComment, editComment, deleteComment,getComments
};
