const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const checkIn = async (req, res) => {
  try {
    console.log("CHECKIN USER:", req.user);
    const userId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existing = await prisma.attendance.findFirst({
      where: {
        userId,
        date: { gte: today, lt: tomorrow },
      },
    });

    if (existing)
      return res.status(400).json({ message: "Already checked in today" });

    const record = await prisma.attendance.create({
      data: {
        userId,
        date:    new Date(),
        checkIn: new Date(),
        status:  "PRESENT",
      },
    });

    return res.status(201).json({ message: "Checked in successfully", record });
  } catch (err) {
    console.error("CHECKIN ERROR:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const record = await prisma.attendance.findFirst({
      where: {
        userId,
        date:     { gte: today, lt: tomorrow },
        checkOut: null,
      },
    });

    if (!record)
      return res.status(400).json({ message: "No active check-in found for today" });

    const checkOutTime = new Date();
    const hoursWorked  = parseFloat(
      ((checkOutTime - new Date(record.checkIn)) / 3600000).toFixed(2)
    );

    const updated = await prisma.attendance.update({
      where: { id: record.id },
      data:  { checkOut: checkOutTime, hoursWorked },
    });

    return res.json({ message: "Checked out successfully", record: updated });
  } catch (err) {
    console.error("CHECKOUT ERROR:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

const getAll = async (req, res) => {
  try {
    const records = await prisma.attendance.findMany({
      where:   { userId: req.user.id },
      orderBy: { date: "desc" },
    });
    return res.json(records);
  } catch (err) {
    console.error("ATTENDANCE GETALL ERROR:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

const getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const [present, absent, late, total] = await Promise.all([
      prisma.attendance.count({ where: { userId, status: "PRESENT" } }),
      prisma.attendance.count({ where: { userId, status: "ABSENT"  } }),
      prisma.attendance.count({ where: { userId, status: "LATE"    } }),
      prisma.attendance.count({ where: { userId } }),
    ]);

    const allRecords = await prisma.attendance.findMany({
      where: { userId, hoursWorked: { not: null } },
    });
    const totalHours = allRecords.reduce((s, r) => s + (r.hoursWorked || 0), 0);

    return res.json({ present, absent, late, total, totalHours: parseFloat(totalHours.toFixed(1)) });
  } catch (err) {
    console.error("ATTENDANCE STATS ERROR:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

module.exports = { checkIn, checkOut, getAll, getStats };