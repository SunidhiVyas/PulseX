const prisma = require("../config/prisma");

exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.userId;

    const attendance = await prisma.attendance.create({
      data: {
        userId,
        date: new Date(),
        checkIn: new Date(),
      },
    });

    res.json({
      message: "Checked In Successfully",
      attendance,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
exports.checkOut = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      const attendance = await prisma.attendance.findFirst({
        where: {
          userId,
        },
        orderBy: {
          id: "desc",
        },
      });
  
      if (!attendance) {
        return res.status(404).json({
          message: "No check-in found",
        });
      }
  
      const updatedAttendance =
        await prisma.attendance.update({
          where: {
            id: attendance.id,
          },
          data: {
            checkOut: new Date(),
          },
        });
  
      res.json({
        message: "Checked Out Successfully",
        attendance: updatedAttendance,
      });
  
    } catch (error) {
      console.log(error);
  
      res.status(500).json({
        message: "Server Error",
      });
    }
  };