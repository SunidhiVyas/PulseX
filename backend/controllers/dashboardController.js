const prisma = require("../src/config/prisma");

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

    const workLogs = await prisma.workLog.findMany({
      where: { userId },
    });

    const totalTasks = workLogs.length;

    const tasksCompleted = workLogs.filter(
  (log) => log.status === "COMPLETED"
).length;

const hoursLogged = workLogs.reduce(
  (sum, log) => sum + log.hoursSpent,
  0
);

// Productivity %
const productivityScore =
  totalTasks === 0
    ? 0
    : Math.round((tasksCompleted / totalTasks) * 100);

// Attendance %
const attendanceScore = Math.min(attendanceCount * 5, 100);

// Current streak (temporary)
const streak = attendanceCount;

// Live Dashboard Metrics
const productivityScore =
  workLogs.length === 0
    ? 0
    : Math.round((tasksCompleted / workLogs.length) * 100);

const attendanceScore = Math.min(attendanceCount * 5, 100);

const streak = attendanceCount;

res.json({
  attendanceCount,
  leavesCount,
  tasksCompleted,
  hoursLogged,
  productivityScore,
  attendanceScore,
  streak,
});

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};