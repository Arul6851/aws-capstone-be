import prisma from "../middleware/prisma.js";
class FeeController {
  getFeeDetails = async (params, callback) => {
    const user = params;
    try {
      if (user) {
        const tuitionfee = await prisma.tuition.findMany({
          where: {
            rollno: user.rollno,
          },
        });

        const examfee = await prisma.exam.findMany({
          where: {
            rollno: user.rollno,
          },
        });

        const alumnifee = await prisma.alumni.findMany({
          where: {
            rollno: user.rollno,
          },
        });

        const oldtuitionfee = await prisma.oldtuition.findMany({
          where: {
            rollno: user.rollno,
          },
        });

        const oldexamfee = await prisma.oldexam.findMany({
          where: {
            rollno: user.rollno,
          },
        });

        const oldalumni = await prisma.oldalumni.findMany({
          where: {
            rollno: user.rollno,
          },
        });

        if (
          tuitionfee ||
          examfee ||
          alumnifee ||
          oldtuitionfee ||
          oldexamfee ||
          oldalumni
        )
          return callback({
            message: "Fee Details",
            code: 200,
            fee: tuitionfee.concat(examfee.concat(alumnifee)),
            oldfee: oldtuitionfee.concat(oldexamfee.concat(oldalumni)),
          });
        else return callback({ message: "No Fee to Pay", code: 402 });
      } else return callback({ message: "Invalid Credentials", code: 401 });
    } catch (err) {
      console.log(err);
      return callback({ message: "Internal Error", code: 500 });
    }
  };
  getTutionFee = async (params, callback) => {
    const user = params;
    try {
      if (user) {
        const tuitionfee = await prisma.tuition.findMany({
          where: {
            rollno: user.rollno,
          },
        });
        if (tuitionfee) {
          return callback({
            message: "Tuition Fee Details",
            code: 200,
            fee: tuitionfee,
          });
        } else {
          return callback({ message: "No Tuition Fee Found", code: 404 });
        }
      }
      return callback({ message: "No Tuition Fee Found", code: 404 });
    } catch (err) {
      console.log(err);
      return callback({ message: "Internal Error", code: 500 });
    }
  };
  getExamFee = async (params, callback) => {
    const user = params;
    try {
      if (user) {
        const examfee = await prisma.exam.findMany({
          where: {
            rollno: user.rollno,
          },
        });
        if (examfee) {
          return callback({
            message: "Exam Fee Details",
            code: 200,
            fee: examfee,
          });
        } else {
          return callback({ message: "No Exam Fee Found", code: 404 });
        }
      }
      return callback({ message: "No Exam Fee Found", code: 404 });
    } catch (err) {
      console.log(err);
      return callback({ message: "Internal Error", code: 500 });
    }
  };
  getFeeById = async (req, res, feeId, callback) => {
    try {
      if (!feeId) {
        return callback({ message: "ID is required", code: 400 });
      }
      const id = feeId;
      const tuitionRecord = await prisma.tuition.findUnique({
        where: {
          id,
        },
      });

      const examRecord = await prisma.exam.findUnique({
        where: {
          id,
        },
      });

      if (tuitionRecord) {
        return res.status(200).json({
          message: "Tuition record found",
          record: { fee: tuitionRecord, type: "Annual Fee" },
        });
      } else if (examRecord) {
        return res.status(200).json({
          message: "Exam record found",
          record: { fee: examRecord, type: "Exam Fee" },
        });
      } else {
        return res
          .status(404)
          .json({ message: "No record found with the given ID" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default FeeController;
