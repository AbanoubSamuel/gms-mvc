const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
    },
    discription: {
        type: String,
    },
    Category: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    brand: {
        type: String,
    },
    image: {
        type: Array,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});

const products = mongoose.model("products", productsSchema);

module.exports = products;