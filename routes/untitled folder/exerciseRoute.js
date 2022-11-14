const express = require("express");
const { JsonWebTokenError } = require("jsonwebtoken");
const { title } = require("process");
const { db } = require("../models/Exercise");
const router = express.Router()
const Exercise = require('../models/Exercise');

// --------------------------------------------------------- add exercise --------------------------------------------------------
router.post('/create', function (req, res)
{
    console.log(req.body);
    Exercise.create(req.body, function (err)
    {
        if (err)
        {
            res.status(402).send("not valid");
            console.log(err);
        }
        else
        {
            res.send("Exercise Added Successfully");
        }
    });
})

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

// --------------------------------------------------- edit exercise ------------------------------------------------------------
router.patch('/editEx', function (req, res)
{
    // using findOneAndUpdate instead of update to solve updating unset variables
    Exercise.findOneAndUpdate({ exerciseName: req.body.exerciseName }, { exBodyPart: req.body.exBodyPart, exAdditionNotes: req.body.exAdditionNotes }, function (err, data)
    {
        if (err)
        {
            res.send(err);
        } else
        {
            res.send(data);
        }
    });
});

// -------------------------------------------------------------- delete exercise ------------------------------------------------
router.delete("/delete", function (req, res)
{
    Exercise.deleteOne({ exerciseName: req.body.exerciseName }, function (err, data)
    {
        if (err)
        {
            res.send(err);
        } else
        {
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