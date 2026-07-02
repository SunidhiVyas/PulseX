const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: req.user.id },
      select: {
        id:           true,
        name:         true,
        email:        true,
        role:         true,
        department:   true,
        createdAt:    true,
        leaveBalance: true,
        profileImage: true,
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    console.error("PROFILE GET ERROR:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, department, password } = req.body;
    const data = {};

    if (name?.trim())       data.name       = name.trim();
    if (department?.trim()) data.department = department.trim();
    if (password?.trim())   data.password   = await bcrypt.hash(password.trim(), 10);

    if (Object.keys(data).length === 0)
      return res.status(400).json({ message: "Nothing to update" });

    const updated = await prisma.user.update({
      where:  { id: req.user.id },
      data,
      select: {
        id:           true,
        name:         true,
        email:        true,
        role:         true,
        department:   true,
        profileImage: true,
      },
    });

    return res.json({ message: "Profile updated successfully", user: updated });
  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }

    const image = `http://localhost:5000/uploads/${req.file.filename}`;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data:  { profileImage: image },
      select: {
        id:           true,
        name:         true,
        profileImage: true,
      },
    });

    return res.json(user);
  } catch (err) {
    console.error("PHOTO UPLOAD ERROR:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadPhoto,
};