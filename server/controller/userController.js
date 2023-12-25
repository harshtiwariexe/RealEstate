const asyncHandler = require("express-async-handler");
const prisma = require("../config/prismaConfig");

exports.createUser = asyncHandler(async (req, res, next) => {
  //   console.log("creating user");
  let { email } = req.body;
  const userExist = await prisma.user.findUnique({ where: { email: email } });
  if (!userExist) {
    const user = await prisma.user.create({ data: req.body });
    res.send({
      message: "user created succesfully",
      user: user,
    });
  } else {
    res.status(201).send({
      message: "User already exist",
    });
  }
});
exports.bookVisit = asyncHandler(async (req, res, next) => {
  const { email, date } = req.body;
  const { id } = req.params;
  try {
    const alreadyBooked = await prisma.user.findUnique({
      where: { email },
      select: {
        bookedVisit: true,
      },
    });
    if (alreadyBooked.bookedVisit.some((visit) => visit.id === id)) {
      res.status(400).json({
        status: "failed",
        message: "This property is already booked by you",
      });
    } else {
      await prisma.user.update({
        where: { email: email },
        data: {
          bookedVisit: { push: { id, date } },
        },
      });
      res.send("Your visit to the property is booked successfuly");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});
