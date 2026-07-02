const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/authMiddleware");
const upload  = require("../middleware/upload");
const {
  getProfile,
  updateProfile,
  uploadPhoto,
} = require("../controllers/userController");

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.post("/upload-photo", auth, upload.single("photo"), uploadPhoto);

module.exports = router;