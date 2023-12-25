const express = require("express");
const router = express.Router();
const propController = require("./../controller/propController");

router.post("/create", propController.createProp);
router.get("/allprop", propController.getAllProp);
router.get("/:id", propController.getProp);

module.exports = router;
