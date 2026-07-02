const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  addLog,
  getAll,
  updateLog,
  deleteLog,
  getStats,
} = require("../controllers/worklogController");

router.post("/add", auth, addLog);
router.get("/all", auth, getAll);
router.get("/stats", auth, getStats);
router.put("/update/:id", auth, updateLog);
router.delete("/delete/:id", auth, deleteLog);

module.exports = router;