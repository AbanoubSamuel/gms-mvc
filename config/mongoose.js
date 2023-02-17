// DB connection configuration
const mongoose=require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/GMS').then((x)=>
{
    console.log("DB connection is open");
})

// const mongoose=require("mongoose");
// mongoose.connect('mongodb+srv://abanoubsamuel:hFyTxYkY7bJuifu@cluster0.igbviqo.mongodb.net/?retryWrites=true&w=majority').then((x)=>
// {
//     console.log("DB connection is open");
// })


//mongodb://127.0.0.1:27017/GMS