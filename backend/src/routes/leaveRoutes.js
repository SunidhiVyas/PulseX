const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/authMiddleware");
const {
  applyLeave,
  getAll,
  cancelLeave,
  getLeaveStats,
} = require("../controllers/leaveController");

router.post("/apply",        auth, applyLeave);
router.get("/all",           auth, getAll);
router.get("/stats",         auth, getLeaveStats);
router.delete("/cancel/:id", auth, cancelLeave);

module.exports = router;