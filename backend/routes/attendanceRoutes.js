const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/authMiddleware");
const { checkIn, checkOut, getAll, getStats } = require("../controllers/attendanceController");

router.post("/checkin",  auth, checkIn);
router.post("/checkout", auth, checkOut);
router.get("/all",       auth, getAll);
router.get("/stats",     auth, getStats);

module.exports = router;