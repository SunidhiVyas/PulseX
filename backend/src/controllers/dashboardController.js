const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [attendanceCount, leavesCount, tasksCompleted, workLogs] =
      await Promise.all([
        prisma.attendance.count({ where: { userId, status: "PRESENT" } }),
        prisma.leaveRequest.count({ where: { userId } }),
        prisma.workLog.count({ where: { userId, status: "COMPLETED" } }),
        prisma.workLog.findMany({ where: { userId } }),
      ]);

    const hoursLogged = workLogs.reduce((sum, log) => sum + log.hoursSpent, 0);

    return res.json({
      attendanceCount,
      leavesCount,
      tasksCompleted,
      hoursLogged: parseFloat(hoursLogged.toFixed(1)),
    });
  } catch (err) {
    console.error("DASHBOARD STATS ERROR:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

module.exports = { getStats };