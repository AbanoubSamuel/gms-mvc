const { default: mongoose } = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    email: { type: String },
    items: { type: Array, required: true },
    status: { type: String, optional: true },
  },

  {
    versionKey: false,
    strict: false,
  }
);

module.exports = mongoose.model("Order", OrderSchema);

