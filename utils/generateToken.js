import jwt from "jsonwebtoken";

const generateTokenAndSetCookie=(userID,res) =>{
    const token=jwt.sign({userID},process.env.JWT_SECRET,{
        expiresIn:"15d",
    });

    res.cookie("jwt",token,{
        maxAge:15*24*60*60*1000, //put in milliseconds maximum age of cookie
        httpOnly:true, // prevent XSS attacks cross-site scripting attacks 
        sameSite:"strict", // TO PROTECT FROM CSRF cross - site request forgery 
        secure:process.env.NODE_ENV !== "development"  // development phase
    });
};

export default generateTokenAndSetCookie;