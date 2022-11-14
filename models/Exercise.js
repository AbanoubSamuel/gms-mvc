// exercise schema

const { default: mongoose } = require("mongoose");


const exerciseSchema = new mongoose.Schema({
    // day:
    //     [{
    exerciseName:
        { type: String, required: true },
    exBodyPart:
        { type: String, required: true },
    exTools:
        { type: String, optional: true },
    exStaticImage:
        { type: String, },
    // exGifImage:
    //     { type: String,},
    exAdditionNotes:
        { type: String, },

    // exStep:
    //     [{ type: String, required: true }],
    // exRep:
    //     [{ type: String, required: true }]
    // }]

},

    {
        versionKey: false,
        strict: false

    })


module.exports = mongoose.model('Exercise', exerciseSchema);