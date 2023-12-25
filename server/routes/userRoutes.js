const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();

router.post("/signup", userController.createUser);
router.post("/bookVisit/:id", userController.bookVisit);

module.exports = router;
