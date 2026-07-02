const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const authRoutes       = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const worklogRoutes    = require("./routes/worklogRoutes");
const leaveRoutes      = require("./routes/leaveRoutes");
const userRoutes       = require("./routes/userRoutes");
const dashboardRoutes  = require("./routes/dashboardRoutes");
const aiRoutes         = require("./routes/aiRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",       authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/worklog",    worklogRoutes);
app.use("/api/leave",      leaveRoutes);
app.use("/api/user",       userRoutes);
app.use("/api/dashboard",  dashboardRoutes);
app.use("/api/ai",         aiRoutes);
app.use("/uploads",express.static("uploads"));

app.get("/", (req, res) => res.json({ message: "PulseX API running ✅" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
