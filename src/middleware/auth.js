const jwt = require("jsonwebtoken");
const Register = require("../model/registration")

//in middleware we have next keyward
//phayla wala check hogaya phir next check
const auth=async(req,res,next)=>{
try {
    //getting content of cookie
    const cookieContent = req.cookies.jwt;
    //now we will check kia yay token database walay token say match krta hai
    //secret key say match karaingain
    const verifyUser = jwt.verify(cookieContent,process.env.SECRET);
    console.log(verifyUser);
    //jan database main token araha to uski id bhi arahe hai to hum us id say data access karaingain

    const user =await Register.findOne({_id:verifyUser._id})
    console.log(user);
     //for logout
    req.cookieContent=cookieContent;
    req.user=user;
    next();
} catch (error) {
    res.status(400).send(error);
}
}

module.exports= auth;