// DB connection configuration
const mongoose=require("mongoose");
mongoose.connect('mongodb://localhost:27017/GMS').then((x)=>
{
    console.log("DB connection is open");
})


