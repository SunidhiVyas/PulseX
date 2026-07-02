const prisma = require("../config/prisma");

exports.applyLeave = async (req, res) => {
  try {

    const userId = req.user.userId;

    const {
      startDate,
      endDate,
      reason,
    } = req.body;

    const leave =
      await prisma.leaveRequest.create({
        data: {
          userId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          reason,
        },
      });

    res.status(201).json(leave);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.getMyLeaves = async (req, res) => {
  try {

    const userId = req.user.userId;

    const leaves =
      await prisma.leaveRequest.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    res.json(leaves);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};