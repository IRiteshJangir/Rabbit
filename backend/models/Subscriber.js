const mongoose = require("mongoose")

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: 2,
        lowecase: 2
    },
    subscribeAt: {
        type: Date,
        default : Date.now,
    }
})

module.exports = mongoose.model("Subscriber", subscriberSchema)