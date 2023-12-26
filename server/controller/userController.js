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

exports.AllBookings = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  try {
    const bookings = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisit: true },
    });
    res.status(200).send(bookings);
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.cancelBooking = asyncHandler(async (req, res, next) => {
  const { email, date } = req.body;
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedVisit: true },
    });
    const index = user.bookedVisit.findIndex((visit) => visit.id === id);
    if (index === -1) {
      res.status(400).send("Booking not found");
    } else {
      user.bookedVisit.splice(index, 1);
      await prisma.user.update({
        where: { email },
        data: {
          bookedVisit: user.bookedVisit,
        },
      });
      res.send("Booking Canceled");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.favProperty = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const { favid } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user.favPropertiesID.includes(favid)) {
      const update = await prisma.user.update({
        where: { email },
        data: {
          favPropertiesID: {
            set: user.favPropertiesID.filter((id) => id !== favid),
          },
        },
      });
      res.send("removed from favroiutes");
    } else {
      const update = await prisma.user.update({
        where: { email },
        data: {
          favPropertiesID: {
            push: favid,
          },
        },
      });
      res.status(200).send({ message: "Added to favoiurite", user: update });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

exports.getAllFav = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  try {
    const fav = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        favPropertiesID: true,
      },
    });
    res.status(200).send(fav);
  } catch (error) {
    throw new Error(error.message);
  }
});
