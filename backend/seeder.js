const dns = require("node:dns");
dns.setDefaultResultOrder("ipv4first"); // Forces Node to use IPv4
const { setServers } = require("node:dns/promises");
setServers(["1.1.1.1", "8.8.8.8"]);     // Bypasses ISP blocking

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose")

const Product = require("./models/Product")
const  User = require("./models/USer")
const  Cart = require("./models/Cart")
const products = require("./data/products")

dotenv.config();


// connect to db

mongoose.connect(process.env.MONGO_URI)

// function to seed the data

const seedData = async () =>
{
    try {
        //  clear the previous data

        await Product.deleteMany();
        await User.deleteMany()
        await Cart.deleteMany()

        // create  a default admin user

        const createdUSer = await User.create({
            name: "admin user",
            email: "admin@example.com",
            password: "123456",
            role: "admin"
        });

        // ASSIGN    the default user id

        const userId = createdUSer._id;

        const sampleProduct = products.map((product) => {
            return { ...product, user:userId }
        });


        // Insert the product into the datbase

        await Product.insertMany(sampleProduct)

        console.log("Product data seeded successfully ");
        process.exit()
        

    } catch (error) {
        

        console.log("Error seeding the data ", error);
        process.exit(1)
        
    }
}

seedData();