import prisma from "../../middleware/prisma.js";
import * as crypto from "crypto";

const registerStudentSingle = async (req, res) => {
  try {
    const detail = req.body;
    if (
      !detail.name ||
      !detail.regno ||
      !detail.year ||
      !detail.dept ||
      !detail.rollno
    ) {
      return res.status(400).json({
        message:
          "Name, Year, Department, Reg No and Roll Number are required fields",
      });
    }
    const studentreg = await prisma.student.findFirst({
      where: {
        regno: detail.regno,
      },
    });
    if (studentreg) {
      return res
        .status(400)
        .json({ message: "Register Number Already Exists" });
    }
    const studentroll = await prisma.student.findFirst({
      where: {
        rollno: detail.rollno,
      },
    });
    if (studentroll) {
      const auth = await prisma.auth.findFirst({
        where: {
          rollno: detail.rollno,
        },
      });
      if (!auth) {
        const hashPassword = crypto
          .createHash("sha512")
          .update(detail.dob)
          .digest("hex");
        const login = await prisma.auth.create({
          data: {
            rollno: detail.rollno,
            pass: hashPassword,
            type: 0,
          },
        });
        if (!login) {
          return res.status(500).json({ message: "Login Not Created" });
        }
      } else {
        return res.status(400).json({ message: "Student Already Exists" });
      }
    } else {
      const login = await prisma.auth.findFirst({
        where: {
          rollno: detail.rollno,
        },
      });
      if (login) {
        const student = await prisma.student.create({
          data: {
            name: detail.name,
            year: Number.parseInt(detail.year),
            dept: detail.dept,
            rollno: detail.rollno,
            regno: detail.regno,
            quota: detail.quota,
            dob: new Date(detail.dob),
            semester: detail.sem,
          },
        });
        return res.status(200).json({
          message: `Student Created successfully`,
          name: student.name,
          rollno: student.rollno,
        });
      } else {
        const hashPassword = crypto
          .createHash("sha512")
          .update(detail.dob)
          .digest("hex");
        const login = await prisma.auth.create({
          data: {
            rollno: detail.rollno,
            pass: hashPassword,
            type: 0,
          },
        });
        if (!login) {
          return res.status(500).json({ message: "Login Not Created" });
        } else {
          const student = await prisma.student.create({
            data: {
              name: detail.name,
              year: Number.parseInt(detail.year),
              dept: detail.dept,
              rollno: detail.rollno,
              regno: detail.regno,
              quota: detail.quota,
              dob: new Date(detail.dob),
              semester: detail.sem,
            },
          });
          return res.status(200).json({
            message: `Student Created successfully`,
            name: detail.name,
            rollno: detail.rollno,
          });
        }
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default registerStudentSingle;
