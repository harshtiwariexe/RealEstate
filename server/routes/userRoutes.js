const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();

router.post("/signup", userController.createUser);
router.post("/bookVisit/:id", userController.bookVisit);
router.post("/allBookings", userController.AllBookings);
router.post("/cancelBooking/:id", userController.cancelBooking);
router.post("/wishlist/:favid", userController.favProperty);
router.post("/getAllWishlisted", userController.getAllFav);

module.exports = router;
