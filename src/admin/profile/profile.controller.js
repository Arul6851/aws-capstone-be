import prisma from "../../middleware/prisma.js";

class PrrofileController {
  getUserDetails = async (req, res) => {
    try {
      const user = res.locals.user;
      if (user) {
        const admin = await prisma.admin.findUnique({
          where: { rollno: user.rollno },
        });
        if (admin) {
          res.status(200).json({ message: "Admin Details", code: 200, admin });
        } else {
          res
            .status(200)
            .json({ message: "No Admin Details", code: 402, admin });
        }
      } else {
        res.status(401).json({ message: "Invalid Credentials", code: 401 });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", code: 500 });
    }
  };
}

export default UserController;
