import prisma from "../middleware/prisma.js";

class UserController {
  getUserDetails = async (req, res) => {
    try {
      const user = res.locals.user;
      if (user) {
        const student = await prisma.student.findUnique({
          where: { rollno: user.rollno },
        });
        if (student) {
          res
            .status(200)
            .json({ message: "Student Details", code: 200, student });
        } else {
          res
            .status(200)
            .json({ message: "No Student Details", code: 402, student });
        }
      } else {
        res
          .status(401)
          .json({ message: "Invalid Credentials", code: 401, user });
      }
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", code: 500 });
    }
  };
}

export default UserController;
