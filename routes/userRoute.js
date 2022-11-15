const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const { middle } = require("../Middleware/Middleware");
const Attendce = require("../models/Attendce");
const Order = require("../models/Order");
const products = require("../models/products");
const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "ASxEe92P4RUkBhG1GLVzBbNj8Ppl4U93513px8QsIxARQsTfIolxx_sGj0tddu8vjPgaT8Yv5wYeK7mi",
  client_secret:
    "EFIu8sp285hAM-FmJNDp0R7IhjFYM0FLrpQyKPKl_iK4-YmWl-WMKbfhkpLCV8WB7kpX8NsYoV_w1Wjr",
});
//-----------------------------------------paypal---------------------------------------------
router.get("/pp", (req, res) =>
{
  res.render("index");
});
var price;
router.post("/paypal", (req, res) =>
{
  console.log(req.body.item);
  price = req.body.price;
  var item = req.body.item;
  var create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://10.171.224.47:8000/api/v1/users/success",
      cancel_url: "http://10.171.224.47:8000/api/v1/users/cancel",
    },
    transactions: [
      {
        amount: {
          currency: "USD",
          total: price,
        },
        description: item,
      },
    ],
  };
  paypal.payment.create(create_payment_json, function (error, payment)
  {
    if (error)
    {
      throw error;
    } else
    {
      console.log("Create Payment Response");
      console.log(payment);

      res.redirect(payment.links[1].href);
    }
  });
});

router.get("/success", (req, res) =>
{
  var payerID = req.query.PayerID;
  var paymentId = req.query.paymentId;
  var execute_payment_json = {
    payer_id: payerID,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: price,
        },
      },
    ],
  };
  console.log(execute_payment_json);
  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment)
    {
      if (error)
      {
        console.log(error.response);
        throw error;
      } else
      {
        res.render("success");

        console.log("Get Payment Response");
        console.log(JSON.stringify(payment));
        res.render("success");
      }
    }
  );
});
router.get("/cancel", (req, res) =>
{
  res.render("cancel");
});





//---------------------------------------------------- multer ------------------------------------------//
// const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb)
  {
    cb(null, "./public/profile");
  },
  filename: function (req, file, cb)
  {
    cb(null, file.originalname);
  },
});
const fileFilter = (req, file, cb) =>
{
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/gif"
  )
  {
    cb(null, true);
  } else
  {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  // limits: {
  //     fileSize: 1024 * 1024 * 5
  // },
  fileFilter: fileFilter,
});

//------------------------------------------- view all exercises with details ----------------------------------------------------
router.get("/view", function (req, res)
{
  Exercise.find().then((data) =>
  {
    console.log(data);
    res.status(200).send(data);
  });
});

router.patch("/updateSettings", middle, upload.single("profileImage"), function (req, res, next)
{
  console.log(req.body);
  let email = { email: decryptedToken };
  console.log("email", email);
  var profileImage = req.file?.path;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var phoneNumber = req.body.phoneNumber;
  var address = req.body.address;
  var bio = req.body.bio;
  var gender = req.body.gender;
  var age = req.body.age;
  var height = req.body.height;
  var weight = req.body.weight;

  console.log(profileImage);
  // data = req.body;
  User.findOne(email, async function (err, data)
  {
    console.log("data", data);

    data.profileImage = profileImage ? profileImage : data.profileImage;
    // data.profileImage = req.file?.path;
    data.firstName = firstName ? firstName : data.firstName;
    data.lastName = lastName ? lastName : data.lastName;
    data.phoneNumber = phoneNumber ? phoneNumber : data.phoneNumber;
    data.address = address ? address : data.address;
    data.bio = bio ? bio : data.bio;
    data.gender = gender ? gender : data.gender;
    data.age = age ? age : data.age;
    data.height = height ? height : data.height;
    data.weight = weight ? weight : data.weight;
    console.log(profileImage);
    console.log(data);
    await data
      .save()
      .then((doc) =>
      {
        res.status(201).json({
          message: "Profile Image Updated Successfully",
          results: doc,
        });
      })
      .catch((err) =>
      {
        res.json(err);
      });
  });
}
);

// -------------------------------- user register api ---------------------------------
router.post("/register", async function (req, res)
{
  // console.log(req.body);
  const body = req.body;
  if (!(body.email && body.password))
  {
    return res
      .status(400)
      .send({ message: "Please make sure to submit all the required data" });
  }
  // this line sets the number of hashing times.
  const salt = await bcrypt.genSalt(10);
  // now we set user password to hashed password
  const hashedPassword = await bcrypt.hash(body.password, salt);
  User.create({ ...body, password: hashedPassword }, function (err, data)
  {
    if (err)
    {
      // console.log(err);
      res.status(405).send({
        message: "User is already registered, Please login instead !",
      });
    } else
    {
      res.status(200).send({ message: "Regestration Success" });
    }
  });
});

// -------------------------------- user login api ---------------------------------
router.post("/login", async (req, res) =>
{
  const body = await req.body;
  if (!body.email || !body.password)
  {
    return res
      .status(403)
      .send({ message: "Please make sure to submit all the required data" });
  } else
  {
    const user = await User.findOne({ email: body.email })
      .populate({ path: "clientIds" })
      .populate({ path: "trainerId" });
    if (user)
    {
      const validPassword = await bcrypt.compare(body.password, user.password);
      if (validPassword)
      {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = jwt.sign(user.email, jwtSecretKey);
        // console.log(token)
        res.setHeader("authorization", token);
        res.status(200).send({ ...user.toObject(), authorization: token });
      } else
      {
        res.status(403).send({ message: "Invalid Password" });
      }
    } else
    {
      res.status(401).send({ message: "User does not exist" });
    }
  }
});

// -------------------------------- user profile update api ---------------------------------
router.patch("/update", function (req, res)
{
  User.findOneAndUpdate(
    { email: req.body.email },
    { ...req.body },
    function (err, data)
    {
      if (err)
      {
        res.status(401).send({ message: "Invalid Access Token" });
      } else
      {
        console.log(data);
        res.send(data);
      }
    }
  );
});

router.patch("/update_user", middle, function (req, res)
{
  User.findOneAndUpdate(
    { email: req.body.email },
    { ...req.body },
    function (err, data)
    {
      try
      {
        if (err)
        {
          res.status(401).send({ message: "Invalid Access Token" });
          //res.send(err);
        } else
        {
          res.send(data);
        }
      } catch (e)
      {
        console.log("error");
      }
    }
  );
});

router.patch('/addHealthyFood', function (req, res)
{
  User.findOneAndUpdate({ email: req.body.email }, {
    $push: {
      healthyFoodHistory:
      {
        foodName: req.body.foodName, foodTime: req.body.foodTime,
        foodType: req.body.foodType, ingredients: req.body.ingredients,
        imgFood: req.body.imgFood, quantity: req.body.quantity,
        finsh: false,
        date: new Date().toDateString()
      }
    }

  }, function (err, data)
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

router.patch('/delHealthyFood', function (req, res)
{
  User.findOneAndUpdate({ email: req.body.email }, {
    $pull: {
      healthyFoodHistory:
      {
        foodName: req.body.foodName, foodTime: req.body.foodTime,
        foodType: req.body.foodType, ingredients: req.body.ingredients,
        imgFood: req.body.imgFood, quantity: req.body.quantity,
        finsh: req.body.finsh,
        date: req.body.date
      }
    }

  }, function (err, data)
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

router.patch('/del_Exersice', function (req, res)
{

  User.findOneAndUpdate({ email: req.body.email }, {
    $pull: {
      exersiceHistory:
      {
        exerciseName: req.body.exerciseName, exBodyPart: req.body.exBodyPart,
        exTools: req.body.exTools, exStaticImage: req.body.exStaticImage,
        exGifImage: req.body.exGifImage, exAdditionNotes: req.body.exAdditionNotes,
        customeNotes: req.body.customeNotes, finsh: req.body.finsh,
        date: req.body.date
      }
    }

  }, function (err, data)
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
// ------------- add exercise with date "handling in front" to specific user ---------------
router.patch('/add_Exersice', function (req, res)
{

  User.findOneAndUpdate({ email: req.body.email }, {
    $push: {
      exersiceHistory:
      {
        exerciseName: req.body.exerciseName, exBodyPart: req.body.exBodyPart,
        exTools: req.body.exTools, exStaticImage: req.body.exStaticImage,
        exGifImage: req.body.exGifImage, exAdditionNotes: req.body.exAdditionNotes,
        customeNotes: req.body.customeNotes,
        finsh: false,
        date: new Date().toDateString(),
      }
    }

  }, function (err, data)
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
// -------------------------------- user delete api ---------------------------------
router.delete("/delete", middle, function (req, res)
{
  console.log(req.body);
  User.deleteOne({ email: req.body.email }, function (data, err)
  {
    res.send({ message: "deleted successfully" });
  });
});

router.get("/", middle, function (req, res)
{
  User.find({ role: "client" }, function (err, data)
  {
    if (err)
    {
      res.send({ message: "Error ! Please check your query and try again." });
    } else
    {
      res.send(data);
    }
  });
});

router.post("/placeorder", function (req, res)
{
  User.findOne({ email: req.body.email }).then((dataa, err) =>
  {
    if (err)
    {
      res.send({ message: "No Data" });
    } else
    {
      Order.create(
        {
          userId: dataa._id,
          items: dataa.cart,
          status: "placed",
          email: dataa.email,
        },
        function (err, data)
        {
          if (err)
          {
            res.send({ message: "Error occureed please try again later" });
          } else
          {
            User.updateOne(
              { _id: dataa._id },
              { cart: [] },
              function (err, data)
              {
                if (err)
                {
                  res.send({
                    message: "Error occureed please try again later",
                  });
                } else
                {
                  console.log("hi");
                  console.log(dataa.cart);
                  //---------------To be checked tomorrow 14 Nov 2022 -----------------------
                  for (let i of dataa.cart)
                  {
                    products.findOne({ title: i.title }, function (err, data)
                    {
                      products.updateOne(
                        { title: data.title },
                        { quantity: data.quantity - i.count },
                        function (err, data)
                        {
                          if (err)
                          {
                            res.send({
                              message: "Error occureed please try again later",
                            });
                          } else
                          {
                          }
                        }
                      );
                    });
                  }
                  res.send({
                    message: "Order has been placed successfully !",
                  });
                }
              }
            );
          }
        }
      );
    }
  });
});

router.post("/attendce", middle, (req, res) =>
{
  let code = req.body.code;

  let date = new Date().toDateString();

  Attendce.findOne({ code: code, date: date }).then((data, err) =>
  {
    if (data != null)
    {
      let index = data.attendce.findIndex((email) => email == req.body.email);
      // console.log(index);
      if (index < 0)
      {
        data.attendce.push(req.body.email);
        // console.log(data)
        res.send({ message: "Welcome to GMS" });
        data.save();
      } else
      {
        res.send({ message: "You already attended today !" });
      }
    } else
    {
      res.send("code is not vliad");
    }
  });
});

router.get("/attendce", middle, async (req, res) =>
{
  let code = Math.round(Math.random() * 10000000);
  let foundCode = await Attendce.find({});
  console.log(foundCode);
  if (
    foundCode.length != 0 &&
    foundCode[foundCode.length - 1].date == new Date().toDateString()
  )
  {
    res.send(foundCode[foundCode.length - 1]);
  } else
  {
    Attendce.create({ code: code });

    res.send({ code: code });
  }
});

router.get("/tootalattendce", middle, async (req, res) =>
{
  let date = await new Date().toDateString();
  Attendce.findOne({ date: date }).then((data, err) =>
  {
    console.log(data);
    res.send({ counter: data.attendce.length });
  });
});

router.get("/client", function (req, res)
{
  // console.log(req.body)
  // console.log(req)
  User.find({ role: "client" }, function (err, data)
  {
    // console.log(data)
    if (err)
    {
      res.send({ message: "Error ! Please check your query and try again." });
    } else
    {
      res.send(data);
    }
  }).populate({ path: "trainerId" });
});

router.post("/gateway", middle, function (req, res)
{
  User.findOne({ email: decryptedToken }, function (err, data)
  {
    console.log(decryptedToken);

    if (err)
    {
      console.log(err);

      res.status(401).send({ message: "Invalid Access Token" });
    } else
    {
      console.log(data);

      res.send(data);
    }
  })
    .populate({ path: "clientIds" })
    .populate({ path: "trainerId" });
});

router.get("/trainer", async function (req, res)
{
  try
  {
    const users = await User.find({ role: "trainer" }).populate("clientIds");
    res.send(users);
  } catch (error)
  {
    res.send(error.message);
  }
});

router.get("/getCode", middle, (req, res) =>
{
  let date = new Date().toDateString();
  Attendce.findOne({ date: date }).then((data, err) =>
  {
    if (err)
    {
      res.status(400).send("Generated your code");
    } else
    {
      res.send(data);
    }
  });
});


router.get("/attendcecharts", async (req, res) =>
{
  let data = await Attendce.find({});
  if (data)
  {
    res.send(data)
  }
  else
  {
    res.status(402).send("no attendees");
  }

})

router.get("/tootalattendce", middle, async (req, res) =>
{
  let date = await new Date().toDateString();
  Attendce.findOne({ date: date }).then((data, err) =>
  {
    console.log(data);

    let size = data?.attendce.length || 0;
    res.send({ counter: size });
  });
});

// -----------------Assign client to trainer----------------------
router.patch("/assignclienttotrainer", (req, res) =>
{
  User.findOneAndUpdate(
    { email: req.body.email },
    {
      $push: {
        clientIds: req.body.id,
      }
    },
    function (err, data)
    {
      if (err)
      {
        console.log(err);
        res.send(err);
      } else
      {
        console.log("data");
        console.log(data);
        res.send(data);
      }
    }
  );
});

router.get("/allattendance", middle, async (req, res) =>
{
  await Attendce.find({}).then((data, err) =>
  {
    data = data.map((i) =>
    {
      return { date: i.data, length: i.attendce.length };
    });
    res.send(data);
  });
});

module.exports = router;
