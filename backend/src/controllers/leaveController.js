const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const applyLeave = async (req, res) => {
  try {
    console.log("LEAVE BODY:", req.body);
    const { type, fromDate, toDate, reason } = req.body;

    if (!fromDate || !toDate || !reason)
      return res.status(400).json({ message: "fromDate, toDate and reason are required" });

    if (new Date(fromDate) > new Date(toDate))
      return res.status(400).json({ message: "From date cannot be after To date" });

    const leave = await prisma.leaveRequest.create({
      data: {
        userId:    req.user.id,
        type:      type || "CASUAL",
        startDate: new Date(fromDate),
        endDate:   new Date(toDate),
        reason:    reason.trim(),
        status:    "PENDING",
      },
    });

    return res.status(201).json({ message: "Leave applied successfully", leave });
  } catch (err) {
    console.error("LEAVE APPLY ERROR:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

const getAll = async (req, res) => {
  try {
    const leaves = await prisma.leaveRequest.findMany({
      where:   { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    // map startDate/endDate → fromDate/toDate so frontend works unchanged
    const mapped = leaves.map((l) => ({
      ...l,
      fromDate: l.startDate,
      toDate:   l.endDate,
    }));

    return res.json(mapped);
  } catch (err) {
    console.error("LEAVE GETALL ERROR:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

const cancelLeave = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const leave = await prisma.leaveRequest.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!leave)
      return res.status(404).json({ message: "Leave not found" });

    if (leave.status !== "PENDING")
      return res.status(400).json({ message: "Only pending leaves can be cancelled" });

    await prisma.leaveRequest.delete({ where: { id } });
    return res.json({ message: "Leave cancelled successfully" });
  } catch (err) {
    console.error("LEAVE CANCEL ERROR:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

const getLeaveStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [total, pending, approved, rejected] = await Promise.all([
      prisma.leaveRequest.count({ where: { userId } }),
      prisma.leaveRequest.count({ where: { userId, status: "PENDING"  } }),
      prisma.leaveRequest.count({ where: { userId, status: "APPROVED" } }),
      prisma.leaveRequest.count({ where: { userId, status: "REJECTED" } }),
    ]);

    return res.json({ total, pending, approved, rejected });
  } catch (err) {
    console.error("LEAVE STATS ERROR:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

module.exports = { applyLeave, getAll, cancelLeave, getLeaveStats };