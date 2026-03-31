const express = require("express")
const Checkout = require("../models/CheckOut")
const Cart = require("../models/Cart")
const Product = require("../models/Product")
const { protect } = require("../middleware/authMiddleware")
const Order = require("../models/Order")


const router = express.Router()

// /api/checkout
// create a checkout  session
// access private

router.post("/", protect, async (req, res) =>

{
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body
    

    if (!checkoutItems || checkoutItems.length === 0) 
    {
        
        return res.status(400).json({message:"No items in checkout"})

    }

    try {
        
        // create a new checkout session
        const newCheckOut = await Checkout.create({
            user: req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress, 
            paymentMethod,
            totalPrice,
            paymentStatus: "Pending",
            isPaid : false,
        })

        console.log(`checkout created for user : ${req.user._id}`);

        res.status(201).json(newCheckOut)
        

    } catch (error) {
        console.log("Error creating in checkout session :", error);
        res.status(500).send("Server Error")
        
    }



    }
)


// PUT /api/checkout/:id/pay
// update checkout yp mark as paid after successful payment

router.put("/:id/pay", protect, async (req, res) => {

    const {paymentStatus, paymentDetails} = req.body

    try {
        
        const checkout = await Checkout.findById(req.params.id)

        if (!checkout)
        {
            return res.status(404).json({message:"checkout session not found"})
        }

        if (paymentStatus === "paid")
        {
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now()

            await checkout.save()

            res.status(200).json(checkout)
        }
        else
        {
            res.status(400).json({message:"Invalid payment Status"})
        }


    } catch (error) {
        console.log(error);
        res.status(500).send("server error")
        
    }

})


// POST /api/checkout/:id/finalize
//finalize the checkout and convert ro an order after confirmation


router.post("/:id/finalize", protect, async (req, res) =>
{
    try {
        const checkout = await Checkout.findById(req.params.id)
        if (!checkout)
        {
            return res.status(404).json({message : "Checkout session not found! "})
        }
        if (checkout.isPaid && !checkout.isFinalized)
        {
            //create final order based on checkout details

            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: "paid",
                paymentDetails: checkout.paymentDetails
            })

            
            // mark checkout as finalized
            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();

            await checkout.save()

            // delete  the cart associated with the user
            await Cart.findOneAndDelete({ user: checkout.user })
            res.status(200).json(finalOrder)

        } else if (checkout.isFinalized)
        {
            res.status(400).json({message: "checkout is already finalized"})
        }
        else
        {
            res.status(400).json({message: "checkout is not paid yet"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Server error"})
        
    }
})

module.exports = router;