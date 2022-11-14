const express = require("express");
const { JsonWebTokenError } = require("jsonwebtoken");
const { title } = require("process");
const { db } = require("../models/Exercise");
const router = express.Router()
const Exercise = require('../models/Exercise');
const mongoose = require("mongoose");
//---------------------------------------------------- multer ------------------------------------------//
// const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb)
    {
        cb(null, './public/exercises');
    },
    filename: function (req, file, cb)
    {
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) =>
{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/gif')
    {
        cb(null, true);
    } else
    {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    // limits: {
    //     fileSize: 1024 * 1024 * 5
    // },
    fileFilter: fileFilter
});


// --------------------------------------------------------- add new exercise --------------------------------------------------------
router.post("/create", upload.single('exStaticImage'), function (req, res)
{
    console.log("Error in upload single image api")
    console.log(req.file)
    console.log(req.body)
    const exercise = new Exercise({
        _id: new mongoose.Types.ObjectId(),
        exerciseName: req.body.exerciseName,
        exBodyPart: req.body.exBodyPart,
        exTools: req.body.exTools,
        exStaticImage: req.file.path,
        exAdditionNotes: req.body.exAdditionNotes
    });
    exercise
        .save()
        .then(result =>
        {
            console.log(result);
            res.status(201).json({
                message: "Created exercise successfully",
                createdFood: {
                    exerciseName: result.exerciseName,
                    exBodyPart: result.exBodyPart,
                    exTools: result.exTools,
                    // exStaticImage: req.file.path,
                    // exGifImage: req.file.path,
                    exAdditionNotes: result.exAdditionNotes,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/exercises/" + result._id
                    }
                }
            });
        })
        .catch(err =>
        {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// ----------------------------------- will be handled with fetch in js ----------------------------------------------------------
//------------------------------------------- view all exercises with details ----------------------------------------------------

router.get("/view", function (req, res)
{
    Exercise.find().then((data) =>
    {
        console.log(data);
        res.status(200).send(data);
    })
});

router.patch("/editEx",upload.single('exStaticImage'),function(req,res,next){
    console.log(req.body)
    var id=req.body._id;
    console.log(id)
    console.log("ttttttttttt");

       var exStaticImage= req.file?.path;
       var exerciseName = req.body.exerciseName;
       var exBodyPart = req.body.exBodyPart;
       var exTools = req.body.exTools;
       var exAdditionNotes = req.body.exAdditionNotes;
       console.log(exStaticImage)
       Exercise.findById(id,function(err,data){
        console.log(data)

        data.exStaticImage = exStaticImage ? exStaticImage : data.exStaticImage;
        data.exerciseName = exerciseName ? exerciseName : data.exerciseName;
        data.exBodyPart = exBodyPart ? exBodyPart : data.exBodyPart;
        data.exTools = exTools ? exTools : data.exTools;
        data.exAdditionNotes = exAdditionNotes ? exAdditionNotes : data.exAdditionNotes;
        console.log(exStaticImage)
       
          data.save()
            .then(doc=>{
               res.status(201).json({
                   message:"Exercise Image Updated Successfully",
                   results:doc
               });
            })
            .catch(err=>{
                res.json(err);
            })
           
        });
    
    });
// --------------------------------------------------- edit exercise ------------------------------------------------------------
// router.patch('/editEx', function (req, res)
// {
//     // using findOneAndUpdate instead of update to solve updating unset variables
//     Exercise.findOneAndUpdate({ exerciseName: req.body.exerciseName }, { exBodyPart: req.body.exBodyPart, exAdditionNotes: req.body.exAdditionNotes }, function (err, data)
//     {
//         if (err)
//         {
//             console.log(err);
//             res.send(err);
//         } else
//         {
//             res.send(data);
//         }
//     });
// });

// -------------------------------------------------------------- delete exercise ------------------------------------------------
router.delete("/delete/:id", function (req, res)
{


    console.log(req)
    Exercise.deleteOne({ exerciseName: req.params.id }, function (data, err)
    {
        if (err)
        {
            console.log(err);
            res.send(err);
        } else
        {
            console.log(data);
            res.send(data);
        }
    });
});

// ----------------------------------------------------------- search & sort exercise ----------------------------------------------
// search with name without filter (sort)
router.get('/search', function (req, res)
{
    Exercise.find({ exerciseName: req.body.exerciseName }, function (err, data)
    {
        if (err)
        {
            res.send(err);
        } else
        {
            res.send(data);
        }
    });
})

// sort by exBodyPart
router.get('/sortByBodyPart', function (req, res)
{
    Exercise.find({ exBodyPart: req.body.exBodyPart }, function (err, data)
    {
        if (err)
        {
            res.send(err);
        } else
        {
            res.send(data);
        }
    });
})
module.exports = router;