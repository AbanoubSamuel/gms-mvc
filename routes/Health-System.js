const mongoose = require("mongoose");
const express = require('express');
const healthyFood = require('../models/HealthyFood');
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb)
    {
        cb(null, './public/HealthyFood');
    },
    filename: function (req, file, cb)
    {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) =>
{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg')
    {
        cb(null, true);
    } else
    {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


router.get("/", (req, res, next) =>
{
    healthyFood.find()
        .select("foodName foodTime foodType ingredients _id imgFood")
        .exec()
        .then(docs =>
        {
            const response = {
                count: docs.length,
                healthyFood: docs.map(doc =>
                {
                    return {
                        foodName: doc.foodName,
                        foodTime: doc.foodTime,
                        foodType: doc.foodType,
                        ingredients: doc.ingredients,
                        imgFood: doc.imgFood,
                        _id: doc._id,
                        request: {
                            type: "GET",
                            url: "http://localhost:8000/heathyfoods/" + doc._id
                        }
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err =>
        {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


router.post("/add", upload.single('imgFood'), (req, res, next) =>
{
    console.log(req.file)
    console.log(req.body)
    const food = new healthyFood({
        _id: new mongoose.Types.ObjectId(),
        foodName: req.body.foodName,
        foodTime: req.body.foodTime,
        foodType: req.body.foodType,
        ingredients: req.body.ingredients,
        imgFood: req.file.path
    });
    food
        .save()
        .then(result =>
        {
            console.log(result);
            res.status(201).json({
                message: "Created food successfully",
                createdFood:
                {
                    foodName: result.foodName,
                    foodTime: result.foodTime,
                    foodType: result.foodType,
                    ingredients: result.ingredients,
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

router.patch("/update", upload.single('imgFood'), function (req, res, next)
{
    console.log(req.body)
    var id = req.body._id;
    console.log(id)
    var foodName = req.body.foodName;
    var foodTime = req.body.foodTime;
    var foodType = req.body.foodType;
    var foodIng = req.body.ingredients;
    var foodPic = req.file?.path;
    console.log(foodPic)
    healthyFood.findById(id, function (err, data)
    {
        console.log(data)
        data.foodName = foodName ? foodName : data.foodName;
        data.foodTime = foodTime ? foodTime : data.foodTime;
        data.foodType = foodType ? foodType : data.foodType;
        data.ingredients = foodIng ? foodIng : data.ingredients;
        data.imgFood = foodPic ? foodPic : data.imgFood;
        console.log(foodPic)

        data.save()
            .then(doc =>
            {
                res.status(201).json({
                    message: "Food Image Updated Successfully",
                    results: doc
                });
            })
            .catch(err =>
            {
                res.json(err);
            })

    });

});


router.delete("/delete/:id", function (req, res)
{
    console.log(req.body)
    healthyFood.deleteOne({ foodName: req.params.id }, function (err, data)
    {
        if (err)
        {
            // console.log(err)
            res.send(err);
            console.log("Not Found")
        } else
        {
            console.log(data)
            res.send("Successful deletion");
        }
    });
});

module.exports = router;