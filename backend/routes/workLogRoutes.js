const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createWorkLog,
  getMyWorkLogs,
} = require("../controllers/workLogController");

router.post(
  "/create",
  authMiddleware,
  createWorkLog
);

router.get(
  "/all",
  authMiddleware,
  getMyWorkLogs
);

module.exports = router;