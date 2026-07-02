const prisma = require("../config/prisma");

exports.createWorkLog = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      title,
      description,
      project,
      hoursSpent,
      status,
    } = req.body;

    const workLog = await prisma.workLog.create({
      data: {
        userId,
        title,
        description,
        project,
        hoursSpent,
        status,
      },
    });

    res.status(201).json(workLog);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.getMyWorkLogs = async (req, res) => {
  try {
    const userId = req.user.userId;

    const workLogs =
      await prisma.workLog.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    res.json(workLogs);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};