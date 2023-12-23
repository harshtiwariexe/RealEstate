const asyncHandler = require("express-async-handler");
const prisma = require("../config/prismaConfig");

exports.createUser = asyncHandler(async (req, res, next) => {
  console.log("Creating user");
  res.send("Hii");
});
