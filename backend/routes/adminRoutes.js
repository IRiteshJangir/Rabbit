const express = require("express")
const User = require("../models/USer")

const {protect, admin} = require("../middleware/authMiddleware")

const router = express.Router();

//  GET /api/admin/users
// get all users(Admin)

router.get("/", protect, admin, async (req, res) =>
{

    try {
        
        const users = await User.find({})
        res.json(users)

    } catch (error) {
        console.log(error);
        res.status(500).json({message: " Server Error"})
                
    }

})


// POST / api / admin / users
//   Add a new user (Admin omnly)


router.post("/", protect, admin, async(req, res) =>
{
    const { name, email, password, role } = req.body
    
    try {

        let user = await User.findOne({ email })
        if (user)
        {
            return res.status(400).json({message: "User already exist!"})
        }

        user = new User({
            name,
            email,
            password,
            role: role || "customer"
        });

        await user.save()
        res.status(201).json({message: "User created successfully!",user})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server Error"})
        
    }
})

// PUT /api/admin/users/:id
// update users details (Admin only)

router.put("/:id", protect, admin, async (req, res) =>
{

    try {
        const user = await User.findById(req.params.id)
        if (user)
        {
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            user.role = req.body.role || user.role
        }

        const updateUser = await user.save()
        res.status(200).json({message: "User updated Successfully!", updateUser})

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server Error"})
        
        
    }

})

// DELETE /api/admin/users/:id
// delete a user

router.delete("/:id", protect, admin, async (req, res) => { 
    try {
        
        const user = await User.findById(req.params.id)
        if(user)
        {
            await user.deleteOne()
            res.status(200).json({message: " User delted successfully"})
        }
        else
        {
            res.status(404).json({message: "User not found!"})
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server Error"} )
        
        
    }
}
)
module.exports = router