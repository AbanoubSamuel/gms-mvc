const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  email:
    { type: String, required: true, unique: true, indexed: true },
  password:
    { type: String, required: true },
  profileImage:
    { type: String },
  age:
    { type: Number, min: 13 },
  firstName:
    { type: String, minlength: 3, maxlength: 15 },
  lastName:
    { type: String, minlength: 3, maxlength: 15 },
  role: {
    type: String,
    default: 'client',
    enum: {
      values: ['admin', 'trainer', 'client', 'customer'],
      message: '{VALUE} is not supported',
    }
  },
  gender:
  {
    type: String,
    default: 'male',
    enum: {
      values: ['male', 'female'],
      message: '{VALUE} is not supported',
    }
  },
  address:
    { type: String },
  phoneNumber:
    { type: String, min: 11 },
  weight:
    { type: Number },
  height:
    { type: Number },
  orders:
    { type: Array },
  clientIds:
    [{ type: mongoose.Types.ObjectId, ref: "User" }],
  trainerId:
    { type: mongoose.Types.ObjectId, ref: "User"  },
  createdAt:
    { type: String },
  startDate:
    { type: String },
  endDate:
    { type: String },
  subscription:
  {
    type: String,
    default: 'basic',
    enum: {
      values: ['premium', 'standard', 'basic', 'none'],
      message: '{VALUE} is not supported',
    }
  },
  bio:
    { type: String },
  exersiceHistory: {
    type: Array
  },
  healthyFoodHistory: {
    type: Array
  },
  cart:
    { type: Array },
  status:
    { type: Boolean, default: false },
  versionKey: false,
  strict: false

})





module.exports = mongoose.model('User', userSchema);