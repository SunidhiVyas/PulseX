exports.getMe = async (req, res) => {
    res.json({
      message: "Authorized User",
      user: req.user,
    });
  };