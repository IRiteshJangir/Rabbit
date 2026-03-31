const jwt = require("jsonwebtoken")
const User = require("../models/USer")


// middleware to protext routes

const protect = async (req, res, next) =>
{
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer "))
    {
        try {
            token = req.headers.authorization.split(" ")[1]
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            
            req.user = await User.findById(decode.user.id).select("-password")
            next();

        } catch (error) {
            console.log("Token Verify Failed",error);
            res.status(401).json({ message: "Not Autorized Token, Token Failed!"})
        }
    }
    else
    {
        res.status(401).json({message:"Not authorized token, no token provided"})
    }
}

const admin = (req, res, next) =>
{
    if (req.user && req.user.role === "admin")
    {
        next();
    }
    else
    {
        res.status(403).json({message:"Not authorised as an admin"})
    }
}


module.exports = {protect, admin}