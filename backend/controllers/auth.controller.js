const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { errorHandler } = require("../utils/error");
const jwt = require('jsonwebtoken')

const signup = async (req, res, next) => {
   const { username, email, password } = req.body;

   // Basic validation
   if (!username || !email || !password) {
       return next(errorHandler(400, 'All fields are required'));
   }

   try {
       const existingUser = await User.findOne({ email });
       if (existingUser) {
           return next(errorHandler(400, 'User already exists'));
       }

       const hashedPassword = await bcrypt.hash(password, 10);

       const newUser = await User.create({
           username,
           email,
           password: hashedPassword
       });

       res.status(201).json(newUser);
   } catch (e) {
       next(e);
   }
}

const signin = async(req,res,next) => {
   const {email,password} = req.body
   if(!email || !password || email==="" || password ===""){
      next(errorHandler(400,"All Fields are required"));
   }
   try{
      const validUser = await User.findOne({email})
      if(!validUser){
         return next(errorHandler(404, "USer not found"));
      }
      const validPassword = bcrypt.compareSync(password,validUser.password);
      if(!validPassword){
        return  next(errorHandler(400,"InvalidPassword"));
      }
      const {password : pass , ...rest} = validUser._doc ;
      const token = jwt.sign({id: validUser._id, isAdmin: validUser.isAdmin},process.env.JWT_SECRET, {expiresIn :"1d"})
      res.status(200).cookie('access_token',token , {
         httpOnly:true
      }).json(rest);

   }catch(e){
      next(e)
   }

} 
const google = async(req,res,next) =>{
   const {email,name,googlePhotoUrl} = req.body ;
   try{  
      const user = await User.findOne({email});
      if(user){
         const token =jwt.sign({id: user._id, isAdmin : user.isAdmin },process.env.JWT_SECRET)
         const {password, ...rest} = user._doc ;
         res.status(200).cookie('access_token',token,{
            httpOnly:true
         }).json(rest);
      }else{
         const generatedPassword = Math.random().toString(36).slice(-8);
         const hashedPassword = bcrypt.hashSync(generatedPassword,10);
         const newUser =await User.create({
            username:name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
            email,
            password : hashedPassword,
           profilePicture: googlePhotoUrl
         })
         const token =jwt.sign({id: newUser._id, isAdmin: newUser.isAdmin},process.env.JWT_SECRET)
         const {password, ...rest} = newUser._doc ;
         res.status(200).cookie('access_token',token,{
            httpOnly:true
         }).json(rest);
      }
   }catch(e){
      next(error)
   }
}


module.exports= {
    signup,
    signin,
    google
}
