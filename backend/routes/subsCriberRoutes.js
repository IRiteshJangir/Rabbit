const express = require("express")
const router = express.Router()
const Subscriber = require("../models/Subscriber")

// POST /api/subscribe
// news letter subscription handle

router.post("/subscribe", async (req, res) =>
{
    const { email } = req.body;

    if (!email)
    {
        return res.status(400).json({message: "email is required!"})
    }

    try {


        // check if the email already exist in the database

        let subscriber = await Subscriber.findOne({email});

        if (subscriber)
        {
            return res.status(400).json({message: "This email is already subscribed!"})
        }

        // create a new subscriber 
        subscriber = new Subscriber({ email })
        await subscriber.save()

        res.status(201).json({message: "Subscribed successfully!"})
        
    } catch (error) {
        
        console.log(error);
        res.status(500).json({message: "Server Error"})
        

    }

})


module.exports = router;