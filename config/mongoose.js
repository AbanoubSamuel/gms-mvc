// DB connection configuration
const mongoose=require("mongoose");
mongoose.connect('mongodb://10.171.224.73:27017/GMS').then((x)=>
{
    console.log("DB connection is open");
})


