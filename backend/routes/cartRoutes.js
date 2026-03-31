const express = require("express")
const Cart = require("../models/Cart")
const Product = require("../models/Product")

const { protect} = require ("../middleware/authMiddleware")


const router = express.Router()


// helper function to get cart by userID or guest Id

const getCart = async(userId, guestId)=>
{
    if (userId)
    {
        return await Cart.findOne({ user: userId })
        
    }
    else if (guestId)
    {
        return await Cart.findOne({ guestId})
    }

    return null;
}


// api/cart
// add a product to the cart for a guest user or logged in user

router.post("/", async (req, res) =>
{
    const { productId, quantity, size, color, guestId, userId } = req.body
    
    try {
        // find the product id

        const product = await Product.findById(productId)

        if (!product) return res.status(404).json({ message: "Product Not Found!" })
        
        
        // determine if the user loggen in or guest iser

        let cart = await getCart(userId, guestId)

        // if the cart exist , update it

        if (cart)
        {
            const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId && p.size === size && p.color === color) 
       
       
            if (productIndex > -1)
            
            {
                // if the product already exist  update the quantity

                cart.products[productIndex].quantity += quantity
            }
            else
            {
                // add new product
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity

                });
                
            }

            // recalculate the total price of the cart

            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);

            await cart.save()
            return res.status(200).json(cart)

        }

        else {
            
            const newCart = new Cart({
                user: userId ? userId  : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products: [
                    {
                        productId,
                        name: product.name,
                        image: product.images[0].url,
                        price: product.price,
                        size,
                        color,
                        quantity
                    },
                ],
                totalPrice : product.price * quantity
            })

            await newCart.save()
            return res.status(201).json(newCart)

        }




    }
    catch (error)
    { 
        console.log(error);
        res.status(500).send("Server Error") 
        
    }

})



// PUT /api/cart/:id
//   update product  quantity in the cart for a guest user or logged in uaser


router.put("/", async (req, res) =>
{
    const { productId, quantity, size, color, guestId, userId } = req.body
    
    try {
        
        let cart = await getCart(userId, guestId)
        if(!cart) return res.status(404).json({message:"Cart not Found!"})

        const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId && p.size === size && p.color === color)

        if (productIndex > -1)
        {
            // update quantity

            if (quantity > 0)
            {
                cart.products[productIndex].quantity = quantity
            }
            else
            {
                cart.products.splice(productIndex, 1)  //  remove product if quantity is zero 
            }

            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save()

            return res.status(200).json(cart)

        }
        else
        {
            return res.status(404).json({message: "Product not found in the cart"})
        }

    } catch (error) {
        console.log(error);

        res.status(500).send("Server Error")
        
    }

})

//  DELETE /api/cart/:id
// remove product from the cart

router.delete("/", async(req, res) =>
{   
    const { productId, size, color, guestId, userId } = req.body
    
    console.log("DELETE params:", { productId, size, color, guestId, userId })
    
    try {
        

        let cart = await getCart(userId, guestId)

        if (!cart) {
            console.log("Cart not found for userId:", userId, "guestId:", guestId)
            return res.status(404).json({ message: "cart not found" })
        }
            
        const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId && p.size === size && p.color === color)


        if (productIndex > -1)
        {
            cart.products.splice(productIndex, 1)  // remove the product from the cart

            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save()
            return res.status(200).json(cart)
        }
        else
        {
            return res.status(404).json({message: "Product not found in the cart"})
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error")
        
        
    }


})


// Get api/cart
//  get loggen in user or guest user cart
 
router.get("/", async (req, res) =>
{
    const { userId, guestId } = req.query
    
    try {
        
        const cart = await getCart(userId, guestId)
        if (cart)
        {
            res.json(cart)
        }
        else
        {
            return res.status(404).json({message: "Cart not found"})
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error")
        
    }
})

// POST api/cart/merge
// merge guest cart with user cart after logn

router.post("/merge", protect, async (req, res) =>
{
    console.log("Merge request body:", req.body)
    console.log("Merge request headers:", req.headers)
    console.log("Merge request method:", req.method)
    const { guestId } = req.body
    
    try {
        
        const guestCart = await Cart.findOne({ guestId })
        const userCart = await Cart.findOne({ user: req.user._id })
        if (guestCart)
        {
            if (guestCart.products.length === 0) {
                return res.status(200).json({ message: "Guest cart is empty, nothing to merge" })
            }

            
        if (userCart)
        {
           
            // merge guest cart into user cart
            guestCart.products.forEach((guestItem) =>
            {
                const productIndex = userCart.products.findIndex((item) => item.productId.toString() === guestItem.productId.toString() && item.size === guestItem.size && item.color === guestItem.color)

                if (productIndex > -1)
                {
                    // if the prodcuct already exist in the user cart, update the quantity
                    userCart.products[productIndex].quantity += guestItem.quantity
                }
                else
                {
                    // otherwise add guest item to the cart 
                    userCart.products.push(guestItem)
                }
            })
            userCart.totalPrice = userCart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)
            await userCart.save()
            
            //  remove the guest cart after merging

            try {
                await Cart.findOneAndDelete({ guestId });
            } catch (error) {
                console.log(error);

                
            }
            res.status(200).json(userCart)
            
        
            }
            else
        {
            // if user  has no existing cart , assigning the guest cart to the user

            guestCart.user = req.user._id
            guestCart.guestId = undefined
            await guestCart.save()
            res.status(200).json(guestCart  )
            
            }

        }
        else
        {
            if (userCart)
            {
                // guestcart has already bee merged , return the userCart

                return res.status(200).json(userCart)
            }

            res.status(404).json({message:"Guest Cart Not found"})
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error")
    }
})

module.exports = router;