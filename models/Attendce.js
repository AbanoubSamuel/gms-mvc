const { default: mongoose } = require("mongoose");
const { type } = require("os");



const AttendceSchema = new mongoose.Schema(
    {
        attendce:
            [{ type: String }],
        code: { type: String, required: true },
        date: { type:String,default: new Date().toDateString() }


    },

    {
        versionKey: false,
        strict: false
    }
)



module.exports = mongoose.model('Attendce', AttendceSchema);