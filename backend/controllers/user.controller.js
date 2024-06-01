const { parse } = require("dotenv");
const User = require("../models/user.model");
const { errorHandler } = require("../utils/error");
const bcrypt = require("bcryptjs")
const test = (req,res) =>{
    res.json("ok")
}

const updateUser = async (req, res, next) => {
    const { userId } = req.params;
    
    if (req.user.id !== userId) {
        return next(errorHandler(403, 'You are not allowed to update this user'));
    }
    
    // Validation for password
    if (req.body.password && req.body.password.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    
    // Validation for username
    if (req.body.username) {
        if (req.body.username.length < 6 || req.body.username.length > 20) {
            return next(errorHandler(400, 'Username must be between 6 and 20 characters'));
        }
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Username cannot contain spaces'));
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(400, 'Username must be lower case'));
        }
    }

    // Hash password if it exists
    if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 12);
    }
    
    try {
        const updatedFields = {
            ...(req.body.username && { username: req.body.username }),
            ...(req.body.email && { email: req.body.email }),
            ...(req.body.profilePicture && { profilePicture: req.body.profilePicture }),
            ...(req.body.password && { password: req.body.password }),
        };

        const updatedUser = await User.findByIdAndUpdate(userId, { $set: updatedFields }, { new: true });

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (e) {
        next(e);
    }
};

const deleteUser = async(req,res,next)=>{
    const { userId } = req.params;
    
    if (!req.user.isAdmin && (req.user.id !== userId)) {
        return next(errorHandler(403, 'You are not allowed to delete this user'));
    }
    try{
        await User.findByIdAndDelete(userId)
        res.status(200).json("User has been deleted");
    }
    catch(e){
        next(e)
    }
    
}
const signout =  (req,res,next) =>{
    try{
        res.clearCookie('access_token').status(200).json("User has been signed out")
    } catch(e){
        next(e);
    }
}

const getUsers = async(req,res,next)=>{
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'you are not allowed to see all users'));
    }
    try{
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9 ;
        const sortDirection = req.query.sort ==='asc' ?1 :-1
        const users = await User.find()
        .sort({createdAt: sortDirection})
        .skip(startIndex)
        .limit(limit);
        // remove password
        const userWithoutPassword = users.map((user)=>{
            const {password, ...rest} = user._doc
            return rest ;
        })
        const totalUsers = await User.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() -1,
            now.getDate(),
        );
        const lasMonthUsers = await User.countDocuments({
            createdAt : {$gte : oneMonthAgo}
        })
        res.status(200).json({
            users:userWithoutPassword,
            totalUsers,
            lasMonthUsers
        })
    } catch(e){
        next(e)
    }
}

const getUser = async(req,res,next)=>{
    try{
        const user = await User.findById(req.params.userId)
        if(!user){
            return ;
        }
        const {password, ...rest}= user._doc
        res.status(200).json(rest);
    } catch(e){
        next(e)
    }
}

module.exports ={
    test,
    updateUser,
    deleteUser,
    signout,
    getUsers,
    getUser
}; 