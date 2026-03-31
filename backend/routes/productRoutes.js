const express = require("express")

const Product = require("../models/Product")

const { protect, admin } = require("../middleware/authMiddleware")

const router = express.Router()


router.post("/", protect, admin, async (req, res) =>
{
    try {
        const { name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections, material, gender, images, isFeatured, isPublished, tags, dimentions, weight, sku } = req.body
        
        const product = new Product(
            {
                name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections, material, gender, images, isFeatured, isPublished, tags, dimentions, weight, sku
                ,user:req.user._id
            }
        )
        const createdProduct = await product.save()

        res.status(201).json(createdProduct)

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error")
        
    }
})


router.put("/:id", protect, admin, async (req, res) =>
{
    try {
        
        const { name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections, material, gender, images, isFeatured, isPublished, tags, dimentions, weight, sku } = req.body

        // find the product by id

        const product = await Product.findById(req.params.id)

        if (product)
        {
            // update product field

            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured = isFeatured !== undefined ?  isFeatured : product.isFeatured;
            product.isPublished = isPublished !== undefined ?  isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.dimentions = dimentions || product.dimentions;
            product.weight = weight || product.weight;
            product.sku = sku || product.sku;

            // save the update product
            const updateProduct = await product.save()

            res.json(updateProduct)
        }
        else
        {
            res.status(404).json({message: "product not found"})
        }


    } catch (error) {
        console.log(error);
        res.status(500).send("server error")
        
    }
})


router.delete("/:id", protect, admin, async (req, res) =>
{
    try {
        // find the product by id

        const product = await Product.findById(req.params.id);

        if (product)
        {
            // remove from the database 
            await product.deleteOne();
            res.json({message:"Removed product"})
        }
        else
        {
            res.status(404).json({message:"Product not found"})
        }


    } catch (error) {
        console.log(error);
        res.status(500).send("Server error")
        
    }
})

router.get("/", async (req, res) =>
{
    try {
        const { collection, size, color, gender, minPrice, maxPrice, sortBy,
            search, category , material, brand , limit
        } = req.query

        let query = {}
        // filter logic


        if (collection && collection.toLocaleLowerCase() !== "all")
        {
            query.collections = collection
        }

        
        if (category && category.toLocaleLowerCase() !== "all")
        {
            query.category = category
        }

        if (material)
        {
            query.material = {$in: material.split(",") }
        }
  if (brand)
        {
            query.brand = {$in: brand.split(",") }
        }
  if (size)
        {
            query.size = {$in: size.split(",") }
        }

        if (color)
        {
            query.colors = {$in : [color]}
        }

        if (gender)
        {
            query.gender = gender 
        }

        if (minPrice || maxPrice)
        {
            query.price = {}
            if(minPrice) query.price.$gte = Number(minPrice)
            if(maxPrice) query.price.$lte = Number(maxPrice)
        }

        if(search)
            {
            query.$or = [
                {name :{$regex: search, $options: "i" }},
                {description :{$regex: search, $options: "i" }}
            ]
        }
        
        //sort logic

        let sort = {};
        if (sortBy)
        {
            switch (sortBy)
            {
                case "priceAsc":
                    sort = { price: 1 }
                    break;
                case "priceDesc":
                    sort = { price: -1 }
                    break;
                case "popularity":
                    sort = { rating: -1 }
                    break;
                default:
                    break;
            }
        }

        // fetch product from the database 
        let queryBuilder = Product.find(query)

        if (Object.keys(sort).length > 0) {
            queryBuilder = queryBuilder.sort(sort)
        }

        let products = await queryBuilder.limit(Number(limit) || 0)

        res.json(products)

    } catch (error) {
        console.log(error);
        res.status(500).send("server error")
        
    }
})




// best seller api , retreove the product with highest rating

router.get("/best-seller", async (req, res) =>
{
      try {
          const bestSeller = await Product.findOne().sort({ rating: -1 })
          if (bestSeller)
          {
               res.json(bestSeller)
          }
          else
          {
              res.status(404).json({message: "No Product Found"})
              }
    } catch (error) {
          console.log(error);
        res.status(500).send("Server Error");
        
    }
})


//    / api/products/ new-Arrivals
// Retreive latest 8 product - Creation Date
 
router.get("/new-arrivals", async (req, res) =>
{
      try {

          // fetch latest 8 product from the datbase
          const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8)
          res.json(newArrivals)
        
    } catch (error) {
        
          console.log(error);
          res.status(500).send("Server Error")
          
    }
})

// get a single product by Id
router.get("/:id", async (req, res) =>
{
    try {
        const product = await Product.findById(req.params.id)
        if (product)
        {
            res.json(product)
        }
        else
        {
            res.status(404).json({message:"Product not found"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("server error")
        
    }
})


// retreive similiar products based on the current products gender and category

router.get("/similiar/:id", async (req, res) =>
{
    const {id} = req.params
    try {
        const product = await Product.findById(id)
        if (!product)
        { 
            res.status(404).json({message:"product not found"})

        }

        const similiarProduct = await Product.find({
            _id: { $ne: id },
            gender: product.gender,
            category: product.category
        }).limit(4)

        res.json(similiarProduct)
    } catch (error) {
        console.log(error);
        res.status(500).send("server error")
        
    }
  
})



module.exports = router;