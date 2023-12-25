const asyncHandler = require("express-async-handler");
const prisma = require("../config/prismaConfig");

exports.createProp = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    price,
    address,
    country,
    city,
    facilities,
    image,
    userEmail,
  } = req.body.data;
  console.log(req.body.data);
  try {
    const property = await prisma.property.create({
      data: {
        title,
        description,
        price,
        address,
        country,
        city,
        facilities,
        image,
        owner: { connect: { email: userEmail } },
      },
    });
    res.send({ message: "Property created", property });
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error("A residency with this address already exist");
    } else {
      throw new Error(error.message);
    }
  }
});

exports.getAllProp = asyncHandler(async (req, res, next) => {
  const properties = await prisma.property.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  res.send(properties);
});

exports.getProp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const prop = await prisma.property.findUnique({
      where: { id: id },
    });
    res.send(prop);
  } catch (error) {
    throw new Error(error.message);
  }
});
