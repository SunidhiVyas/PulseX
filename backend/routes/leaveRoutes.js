const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  applyLeave,
  getMyLeaves,
} = require("../controllers/leaveController");

router.post(
  "/apply",
  authMiddleware,
  applyLeave
);

router.get(
  "/my-leaves",
  authMiddleware,
  getMyLeaves
);

module.exports = router;