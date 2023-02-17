const express = require("express");
const router = express.Router();
const { tokenValidator } = require("../utils/tokenValidator");
const paypal = require("paypal-rest-sdk");
const userController = require("../controllers/userController")

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "ASxEe92P4RUkBhG1GLVzBbNj8Ppl4U93513px8QsIxARQsTfIolxx_sGj0tddu8vjPgaT8Yv5wYeK7mi",
  client_secret:
    "EFIu8sp285hAM-FmJNDp0R7IhjFYM0FLrpQyKPKl_iK4-YmWl-WMKbfhkpLCV8WB7kpX8NsYoV_w1Wjr",
});
//-----------------------------------------paypal---------------------------------------------
router.get("/pp", userController.renderIndex);
var price;
router.post("/paypal", tokenValidator, userController.createPayment);

router.get("/success", tokenValidator, userController.success)

router.get("/cancel", tokenValidator, userController.getCancelView);

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
  if (file.mimetype === "image/*")
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
router.get("/view", userController.getView);

router.patch("/updateSettings", tokenValidator, upload.single("profileImage"), userController.updateSettings);
// -------------------------------- user register api ---------------------------------
router.post("/register", userController.userRegister);
// -------------------------------- user login api ------------------------------------
router.post("/login", userController.userLogin);
// -------------------------------- user profile update api ---------------------------
router.patch("/update", userController.userUpdate);

router.patch("/update_user", tokenValidator, userController.updateUser);

router.patch('/addHealthyFood', tokenValidator, userController.addDiet);

router.patch('/delHealthyFood', tokenValidator, userController.deleteDiet);

router.patch('/del_Exercise', tokenValidator, userController.deleteExercise);
// ------------- add exercise with date "handling in front" to specific user ----------
router.patch('/add_Exercise', tokenValidator, userController.addExercise);
// -------------------------------- user delete api -----------------------------------
router.delete("/delete", tokenValidator, userController.deleteUser);
// -------------------------------- user dlete api ------------------------------------
router.get("/", tokenValidator, userController.getAllClients);

router.post("/placeorder", tokenValidator, userController.placeOrder);

router.post("/attendce", tokenValidator, userController.loginToGym);

router.get("/attendce", tokenValidator, userController.getLoginCode);

router.get("/client", userController.getClient);

router.post("/gateway", tokenValidator, userController.getLoggedInUser);

router.get("/trainer", userController.getAllTrainers);

router.get("/getCode", tokenValidator, userController.getCode);

router.get("/attendcecharts", userController.getChartsData)

router.get("/tootalattendce", tokenValidator, userController.getTotalAttendees);

// -----------------Assign client to trainer----------------------
router.patch("/assignclienttotrainer", userController.addClientToTrainer);

router.get("/allattendance", tokenValidator, userController.getAllAttendees);

module.exports = router;
