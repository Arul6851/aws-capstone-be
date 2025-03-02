import prisma from "../../middleware/prisma.js";
import PaymentController from "../../payment/payment.controller.js";

const paymentController = new PaymentController();

const insertTransaction = async (req, res) => {
  try {
    const { feeId } = req.paymentData;

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
      const { intentId, timeStamp, amount, status } = req.paymentData;

      const student = await prisma.student.findFirst({
        where: {
          rollno: tuitionRecord.rollno,
        },
      });

      if (!intentId || !feeId || !timeStamp || !amount || !status) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const tuitionTransaction = await prisma.tuitionTransaction.create({
        data: {
          intentId,
          rollno: tuitionRecord.rollno,
          timeStamp,
          amount,
          status,
          feeid: feeId,
          academicYear: tuitionRecord.academic,
        },
      });
      const transactionId = "tut_" + tuitionTransaction.id;
      await prisma.tuitionTransaction.update({
        where: { id: tuitionTransaction.id },
        data: { transactionId },
      });
      tuitionTransaction.transactionId = transactionId;

      if (status == "Success") {
        const tuitionId = await prisma.tuition.findFirst({
          where: {
            rollno: tuitionRecord.rollno,
            academic: tuitionRecord.academic,
          },
        });
        const tutrec = await prisma.tuition.update({
          where: {
            id: tuitionId.id,
          },
          data: {
            paid: 1,
            paiddate: timeStamp,
            intentId,
          },
        });
        paymentController.generatePaySlip(student, tutrec, "MasterCard");
        return res.status(200).json({
          message: "Transaction Successful.",
          tuitionTransaction,
        });
      } else {
        return res.status(200).json({
          message: "Transaction Failed.",
          tuitionTransaction,
        });
      }
    } else if (examRecord) {
      const {
        intentId,
        timeStamp,
        amount,
        // arrearCount,
        // arrearSub,
        // arrearCost,
        status,
        // semester,
      } = req.paymentData;

      if (
        !intentId ||
        !feeId ||
        !timeStamp ||
        !amount ||
        !status
        // !semester ||
        // !arrearCost ||
        // !arrearCount ||
        // !arrearSub
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const student = await prisma.student.findFirst({
        where: {
          rollno: examRecord.rollno,
        },
      });

      const examTransaction = await prisma.examTransaction.create({
        data: {
          intentId,
          rollno: examRecord.rollno,
          timeStamp,
          amount,
          feeid: feeId,
          arrearCost: examRecord.arrear,
          status,
          semester: examRecord.semester,
        },
      });

      const transactionId = "exm_" + examTransaction.id;
      await prisma.examTransaction.update({
        where: { id: examTransaction.id },
        data: { transactionId },
      });
      examTransaction.transactionId = transactionId;

      if (status == "Success") {
        const examId = await prisma.exam.findFirst({
          where: {
            rollno: examRecord.rollno,
            semester: examRecord.semester,
          },
        });
        const examrec=await prisma.exam.update({
          where: {
            id: examId.id,
          },
          data: {
            paid: 1,
            paiddate: timeStamp,
            intentId,
          },
        });
        paymentController.generatePaySlip(student, examrec, "MasterCard");
        return res.status(200).json({
          message: "Transaction Successful.",
          examTransaction,
        });
      } else {
        return res.status(200).json({
          message: "Transaction Failed.",
          examTransaction,
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export default insertTransaction;
