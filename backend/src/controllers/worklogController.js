const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const addLog = async (req, res) => {
  try {
    const { project, title, description, hoursSpent, status } = req.body;

    if (!project || !title || !hoursSpent)
      return res.status(400).json({ message: "Project, title and hours are required" });

    const log = await prisma.workLog.create({
      data: {
        userId:      req.user.id,
        project:     project.trim(),
        title:       title.trim(),
        description: description?.trim() || "",
        hoursSpent:  parseFloat(hoursSpent),
        status:      status || "IN_PROGRESS",
        date:        new Date(),
      },
    });

    return res.status(201).json({ message: "Work log added", log });
  } catch (err) {
    console.error("WORKLOG ADD ERROR:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

const getAll = async (req, res) => {
  try {
    const logs = await prisma.workLog.findMany({
      where:   { userId: req.user.id },
      orderBy: { date: "desc" },
    });
    return res.json(logs);
  } catch (err) {
    console.error("WORKLOG GETALL ERROR:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

const updateLog = async (req, res) => {
  try {
    const id       = parseInt(req.params.id);
    const existing = await prisma.workLog.findFirst({
      where: { id, userId: req.user.id },
    });
    if (!existing)
      return res.status(404).json({ message: "Log not found" });

    const updated = await prisma.workLog.update({
      where: { id },
      data: {
        ...(req.body.project     && { project:     req.body.project.trim()     }),
        ...(req.body.title       && { title:       req.body.title.trim()       }),
        ...(req.body.description !== undefined && { description: req.body.description.trim() }),
        ...(req.body.hoursSpent  && { hoursSpent:  parseFloat(req.body.hoursSpent) }),
        ...(req.body.status      && { status:      req.body.status }),
      },
    });

    return res.json({ message: "Updated successfully", log: updated });
  } catch (err) {
    console.error("WORKLOG UPDATE ERROR:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

const deleteLog = async (req, res) => {
  try {
    const id       = parseInt(req.params.id);
    const existing = await prisma.workLog.findFirst({
      where: { id, userId: req.user.id },
    });
    if (!existing)
      return res.status(404).json({ message: "Log not found" });

    await prisma.workLog.delete({ where: { id } });
    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("WORKLOG DELETE ERROR:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [total, completed, inProgress, pending, logs] = await Promise.all([
      prisma.workLog.count({ where: { userId } }),
      prisma.workLog.count({ where: { userId, status: "COMPLETED"   } }),
      prisma.workLog.count({ where: { userId, status: "IN_PROGRESS" } }),
      prisma.workLog.count({ where: { userId, status: "PENDING"     } }),
      prisma.workLog.findMany({ where: { userId } }),
    ]);

    const totalHours = logs.reduce((s, l) => s + l.hoursSpent, 0);

    return res.json({
      total,
      completed,
      inProgress,
      pending,
      totalHours: parseFloat(totalHours.toFixed(1)),
    });
  } catch (err) {
    console.error("WORKLOG STATS ERROR:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

module.exports = { addLog, getAll, updateLog, deleteLog, getStats };