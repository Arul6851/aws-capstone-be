import prisma from "../../middleware/prisma.js";
import excelToJson from "convert-excel-to-json";
import * as crypto from "crypto";
import PaymentController from "../../payment/payment.controller.js";

const paymentController = new PaymentController();

const bulkUploadExam = async (req, res) => {
  try {
    const { path } = res.locals.file;
    const rawdetails = excelToJson({
      sourceFile: path,
      header: {
        rows: 4,
      },
      columnToKey: {
        C: "rollno",
        F: "semester",
        G: "exam",
        H: "arrear",
        I: "others",
        J: "total",
      },
    });
    // const details = rawdetails["CSE A"].concat(
    //   rawdetails["CSE B"].concat(
    //     rawdetails["IT"].concat(
    //       rawdetails["ECE"].concat(
    //         rawdetails["EEE"].concat(
    //           rawdetails["MECH"]
    //           )
    //         )
    //       )
    //     )
    //   );
    const details = rawdetails["CSE A"];
    let added = 0;
    let notAdded = 0;
    const uploadAdd = async (detail) => {
      const studentroll = await prisma.student.findFirst({
        where: {
          rollno: detail.rollno.toUpperCase(),
        },
      });
      const studentreg = await prisma.student.findFirst({
        where: {
          regno: detail.rollno.toUpperCase(),
        },
      });

      if (studentroll && studentreg) {
        const fee = await prisma.exam.create({
          data: {
            rollno: detail.rollno.toUpperCase(),
            academic: Number.parseInt(detail.academic),
            exam: Number.parseInt(detail.exam),
            revaluation: Number.parseInt(detail.revaluation),
            photocopy: Number.parseInt(detail.photocopy),
            others: Number.parseInt(detail.others),
            total: Number.parseInt(detail.total),
          },
        });
        if (fee) {
          added++;
        } else {
          notAdded++;
        }
        if (detail.total == 0) {
          const updateFee = await prisma.exam.update({
            where: {
              id: fee.id,
            },
            data: {
              paid: 1,
            },
          });
          if (!updateFee) {
            return;
          }
          return updateFee;
        }
        return;
      } else {
        notAdded++;
        // return res.status(400).json({ message: "Student Not Found" });
      }
    };
    const uploadArr = await Promise.all(details.map(uploadAdd));
    if (uploadArr && notAdded == 0) {
      return res.status(200).json({
        message: "Exam Fee Added Successfully",
        uploadArr,
        added,
        notAdded,
      });
    } else if (uploadArr && notAdded != 0 && added != 0) {
      return res.status(200).json({
        message: "Some Exam Fee are Added",
        uploadArr,
        added,
        notAdded,
      });
    } else {
      return res
        .status(209)
        .json({ message: "Exam Fee Not Added", uploadArr, added, notAdded });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default bulkUploadExam;
