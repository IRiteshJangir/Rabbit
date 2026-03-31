// ADD THESE THREE LINES AT THE VERY TOP
// const dns = require("node:dns");
// dns.setDefaultResultOrder("ipv4first"); // Forces Node to use IPv4
// const { setServers } = require("node:dns/promises");
// setServers(["1.1.1.1", "8.8.8.8"]);     // Bypasses ISP blocking

const dotenv = require("dotenv");
dotenv.config();

const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes")
const productRoutes = require("./routes/productRoutes")
const cartRoutes = require("./routes/cartRoutes")
const checkoutRoutes = require("./routes/checkoutRoutes")
const orderRoutes = require("./routes/orderRoutes")
const uploadRoutes = require("./routes/uploadRoutes")
const subscribeRoutes = require("./routes/subscriberRoutes")
const adminRoutes = require("./routes/adminRoutes")
const productAdminRoutes = require("./routes/productAdminRoutes")
const adminOrderRoutes = require("./routes/adminOrderRoutes")


const app = express();
app.use(express.json({ limit: '10mb' }))  // Increase limit if needed
app.use(cors({
    origin: true,  // Allow all origins for development
    credentials: true
}))

const PORT = process.env.PORT || 3000

//  connect to database
connectDB()

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) =>
{
    res.send("Welcome to Rabbit API!")
})

// API Routes
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/checkout", checkoutRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api", subscribeRoutes)

// Admin Routes
app.use("/api/admin/users", adminRoutes)
app.use("/api/admin/products", productAdminRoutes)
app.use("/api/admin/orders", adminOrderRoutes)

// Test route to check body parsing
app.post("/test-body", (req, res) => {
    console.log("Test body:", req.body)
    res.json({ received: req.body })
})

app.listen(PORT, () =>
{
    console.log(`server is running on PORT ${PORT}`);
})


module.exports = app;