const prisma = require("../config/prisma");

exports.getDashboardStats = async (req, res) => {
  try {

    const userId = req.user.userId;

    const attendanceCount =
      await prisma.attendance.count({
        where: { userId },
      });

    const leavesCount =
      await prisma.leaveRequest.count({
        where: { userId },
      });

    const workLogs =
      await prisma.workLog.findMany({
        where: { userId },
      });

    const tasksCompleted =
      workLogs.length;

    const hoursLogged =
      workLogs.reduce(
        (sum, log) => sum + log.hoursSpent,
        0
      );

    res.json({
      attendanceCount,
      leavesCount,
      tasksCompleted,
      hoursLogged,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};