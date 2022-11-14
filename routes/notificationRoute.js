const mongoose = require("mongoose");
const express = require("express");
const notification = require("../models/Notification");
const router = express.Router();

router.post("/create", function (req, res)
{
  console.log(req.body)
  notification.create(req.body, function (err, data)
  {
    console.log(data)
    if (data)
    {
      res.status(200).send(data);
    } else
    {

      res.status(400).send("not valid");
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