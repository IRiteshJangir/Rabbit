const express = require("express")
const Product = require("../models/Product")
const { protect, admin } = require("../middleware/authMiddleware")

const router = express.Router()


// GET /api/admin/products
// get all products (Admin)

router.get("/", protect, admin, async (req, res) =>
{
    try {
        const products = await Product.find({});
        res.json(products)
    } catch (error) {
        console.log(error);
        res.json({message: "Server Error"})
        
        
    }
})

module.exports = router;
