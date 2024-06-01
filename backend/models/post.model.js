const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    userId : {
        type:String,
        required:true
    },
    content : {
        type:String,
    },
    title:{
        type:String,
        required:true,
        unique:true
    },
    image: {
        type:String,
        default: ""
    },
    category:{
        type:String,
        default :'uncategorized'
    },
    slug : {
        type:String,
        required:true,
        unqiue :true
    },
}, {timestamps:true})

const Post = mongoose.model("Post",postSchema);
module.exports = Post;