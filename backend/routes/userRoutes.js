const express = require("express")  
const jwt = require("jsonwebtoken")
const USer = require("../models/USer")
const { protect } = require("../middleware/authMiddleware")


const router = express.Router()




router.post("/register", async (req, res) =>
{
    const { name, email, password } = req.body;

    try {
        //Registration logic
        let user = await USer.findOne({ email });

        if (user)
        {
            return res.status(400).json({message:"Email is Already exist!"})
          
        }


         user = new USer({ name, email, password })
            await user.save()

        //    Create JwT Payload 
        const payload = { user: { id: user._id, role: user.role } }
        
        // sign in and return the token along with the user data
        
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" }, (err, token) =>
        {
            if (err) throw err;

            // Send the user and token in response

            res.status(201).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token,
            })
        }
        )

    } catch (error) {

        console.log(error);
        res.status(500).send("Server Error")
        
        
    }


    
})


router.post("/login", async (req, res) =>
{
    const { email, password } = req.body;

    try {
        // find the user by email

        let user = await USer.findOne({ email })
        if (!user) return res.status(400).json({ message: "Invalid Credentials" })
        
        const isMatch = await user.matchPassword(password)
        
        if(!isMatch) return res.status(400).json({message:"Invalid Credentials"})
        
          //    Create JwT Payload 
        const payload = { user: { id: user._id, role: user.role } }
        
        // sign in and return the token along with the user data
        
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" }, (err, token) =>
        {
            if (err) throw err;

            // Send the user and token in response

            res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token,
            })
        }
        )


    } catch (error) {
        console.log(error);

        res.status(500).send("Server Error")
        
    }

})


router.get("/profile", protect, async (req, res) => {
    res.json(req.user)
})

module.exports = router;