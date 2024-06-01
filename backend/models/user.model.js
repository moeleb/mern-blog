const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type:String,
        required:true,
        unique:true,
    }, 
    email : {
        type:String,
        required:true
    },
    password : {
        type:String,
        required:true
    },
    profilePicture : {
        type:String,
        default: "https://d.newsweek.com/en/full/1592734/facebook-avatar.jpg?w=1600&h=1600&q=88&f=f188f5e40bbb7411e5435a4659bcba86",
    },
    isAdmin: {
        type:Boolean,
        default :false,
    },
}, {timestamps:true}
);

const User = mongoose.model('User', userSchema)
module.exports = User ;
