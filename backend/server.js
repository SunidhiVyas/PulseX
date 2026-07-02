
const workLogRoutes = require("./routes/workLogRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: true, credentials: true, allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "PulseX Backend Running 🚀",
  });
});

const PORT = process.env.PORT || 5000;
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/worklog", workLogRoutes);
app.use("/api/ai", aiRoutes);
app.use("/uploads", express.static("uploads"));
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
