const mongoose = require("mongoose");
const express = require("express");
const notification = require("../models/Notification");
const router = express.Router();

router.post("/create", function (req, res)
{
    notification.create(req.body, function (data, err)
    {
        if (err)
        {
            res.status(402).send("not valid");
        } else
        {
            res.status(200).send(data);
        }
    });
});

router.get("/", function (req, res)
{
    notification.find().then((data) =>
    {
        if (data)
        {
            // console.log(data);
            res.status(200).send(data);
        } else
        {
            console.log("error");
        }
    });
});

module.exports = router;