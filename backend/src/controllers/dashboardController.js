const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [attendanceCount, leavesCount, tasksCompleted, workLogs] =
      await Promise.all([
        prisma.attendance.count({
          where: {
            userId,
            status: "PRESENT",
          },
        }),

        prisma.leaveRequest.count({
          where: {
            userId,
          },
        }),

        prisma.workLog.count({
          where: {
            userId,
            status: "COMPLETED",
          },
        }),

        prisma.workLog.findMany({
          where: {
            userId,
          },
        }),
      ]);

    // Total hours logged
    const hoursLogged = workLogs.reduce(
      (sum, log) => sum + log.hoursSpent,
      0
    );

    // Total work logs
    const totalTasks = workLogs.length;

    // Productivity Score
    const productivityScore =
      totalTasks === 0
        ? 0
        : Math.round((tasksCompleted / totalTasks) * 100);

    // Attendance Score
    const attendanceScore =
      attendanceCount === 0
        ? 0
        : Math.min(attendanceCount * 5, 100);

    // Current Streak (temporary logic)
    const streak = attendanceCount;

    return res.json({
      attendanceCount,
      leavesCount,
      tasksCompleted,
      hoursLogged: parseFloat(hoursLogged.toFixed(1)),
      productivityScore,
      attendanceScore,
      streak,
    });

  } catch (err) {
    console.error("DASHBOARD STATS ERROR:", err);

    return res.status(500).json({
      message: err.message || "Server error",
    });
  }
};

module.exports = {
  getStats,
};