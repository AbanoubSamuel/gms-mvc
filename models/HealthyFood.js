const mongoose = require("mongoose");
const healthyFoodSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    foodName:
    {
        type: String,
        require: true,
        unique: true,
        indexed: true,
    },
    // Breakfast, Lunch, Dinar
    foodTime:
    {
        type: String,
        require: true,
    },
    // Sweet Food, Hot Food, Drinks, Snacks
    foodType:
    {
        type: String,
        require: true,
    },
    ingredients:
    {
        type: String,
    },
    quantity: {
        type: String,
    },
    imgFood:
    {
        type: String,
    }

},
    {
        versionKey: false,
        strict: false
    }
)
healthyFood = mongoose.model("Healthy-System", healthyFoodSchema);
module.exports = healthyFood;