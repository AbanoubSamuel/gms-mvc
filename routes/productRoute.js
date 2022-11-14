const express = require("express");
const router = express.Router();
const products = require("../models/products");
const path = require("path");
let arr = [];
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) =>
    {
        cb(null, "public");
    },

    filename: (req, file, cb) =>
    {
        let name = Date.now() + path.extname(file.originalname);
        cb(null, name);
    },
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




router.get("/", function (req, res)
{
    products.find({}, function (err, data)
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



router.post("/add", upload.array("image", 5), function (req, res)
{
    console.log(req.files);
    let pro = [];
    for (i of req.files)
    {
        pro.push(i.path);
    }
    products.create({ ...req.body, image: pro }, function (err, data)
    {
        if (err)
        {
            console.log(err);
            res.send("error");
        } else
        {
            console.log(data);
            res.send(data);
        }
    });
});

router.patch("/update", function (req, res)
{
    products.updateOne(
        { title: req.body.title },
        { Category: req.body.Category },
        function (err, data)
        {
            if (err)
            {
                res.send("error");
            } else
            {
                res.send(data);
            }
        }
    );
});

router.delete("/delete", function (req, res)
{
    products.deleteOne({ title: req.body.title }, function (err, data)
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

module.exports = router;