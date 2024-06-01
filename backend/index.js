const express = require("express")
const mongoose = require("mongoose");
require("dotenv").config();
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const postRoutes = require("./routes/post.route");
const commentRoutes = require("./routes/comment.route");
const cookieParser = require("cookie-parser");
const app = express() 


app.use(express.json());
app.use(cookieParser())
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("yes")
}).catch((e)=>{
    console.log(e);
})

app.use("/api/users", userRoutes )
app.use("/api/auth", authRoutes) ;
app.use("/api/post", postRoutes) ;
app.use("/api/comment", commentRoutes) ;

app.use((err,req,res,next)=> {
    const statusCode = err.statusCode || 500 ;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
});

app.listen(3000,()=>{
    console.log(`server is runnong on 3000`);
})