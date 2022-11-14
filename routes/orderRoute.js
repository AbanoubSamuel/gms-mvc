const mongoose = require("mongoose");
const express = require("express");
const order = require("../models/Order");
const products = require("../models/products");
const router = express.Router();

router.get("/", function (req, res) {
  order.find().then((data) => {
    if (data) {
      // console.log(data);
      res.status(200).send(data);
    } else {
      console.log("error");
    }
  });
});

router.patch("/update", function (req, res) {
  order
    .updateOne(
      { email: req.body.email },
      {
        status: req.body.status,
      }
    )
    .exec()
    .then((data) => {
      console.log(data);
      if (!data) {
        res.status(404).end();
      } else {
        res.status(200).send("Item was updated successfully");
      }
    });
});




module.exports = router;
