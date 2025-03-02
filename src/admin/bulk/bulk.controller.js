import prisma from "../../middleware/prisma.js";
import excelToJson from "convert-excel-to-json";
import * as crypto from "crypto";
import PaymentController from "../../payment/payment.controller.js";

const paymentController = new PaymentController();

class BulkController {
  bulkUploadTuition = async (req, res) => {
    try {
      const { path } = res.locals.file;
      const rawdetails = excelToJson({
        sourceFile: path,
        header: {
          rows: 4,
        },
        columnToKey: {
          C: "rollno",
          D: "academic",
          E: "tuition",
          F: "development",
          G: "placement",
          H: "others",
          I: "total",
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
        const student = await prisma.student.findFirst({
          where: {
            rollno: detail.rollno.toUpperCase(),
          },
        });
        if (student) {
          const fee = await prisma.tuition.create({
            data: {
              rollno: detail.rollno.toUpperCase(),
              academic: Number.parseInt(detail.academic),
              tuition: Number.parseInt(detail.tuition),
              development: Number.parseInt(detail.development),
              placement: Number.parseInt(detail.placement),
              others: Number.parseInt(detail.others),
            },
          });
          if (fee) {
            added++;
          } else {
            notAdded++;
          }
          if (detail.total == 0) {
            const updateFee = await prisma.tuition.update({
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
            // paymentController.generatePaySlip(student, updateFee, "-");
            return updateFee;
          }
          return;
        } else {
          notAdded++;
        }
      };
      const uploadArr = await Promise.all(details.map(uploadAdd));
      if (uploadArr && notAdded == 0) {
        return res.status(200).json({
          message: "Fee Added Successfully",
          uploadArr,
          added,
          notAdded,
        });
      } else if (uploadArr && notAdded != 0 && added != 0) {
        return res
          .status(200)
          .json({ message: "Some Fee are Added", uploadArr, added, notAdded });
      } else {
        return res
          .status(209)
          .json({ message: "Fee Not Added", uploadArr, added, notAdded });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default BulkController;
