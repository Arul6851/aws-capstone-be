import prisma from "../../middleware/prisma.js";
import excelToJson from "convert-excel-to-json";
import * as crypto from "crypto";
import PaymentController from "../../payment/payment.controller.js";

const paymentController = new PaymentController();

const bulkUploadAlumni = async (req, res) => {
  try {
    const { path } = res.locals.file;
    const rawdetails = excelToJson({
      sourceFile: path,
      header: {
        rows: 4,
      },
      columnToKey: {
        C: "rollno",
        D: "name",
        E: "academic",
        F: "year",
        G: "dept",
        H: "quota",
        I: "dob",
        J: "feename",
        // K: "tuition",
        // L: "development",
        // M: "placement",
        // N: "exam",
        // O: "revaluation",
        // P: "photocopy",
        Q: "alumni",
        R: "others",
        S: "total",
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
        const auth = await prisma.auth.findFirst({
          where: {
            rollno: detail.rollno.toUpperCase(),
          },
        });
        if (!auth) {
          const hashPassword = crypto
            .createHash("sha512")
            .update(new String(detail.dob.toISOString()).split("T")[0])
            .digest("hex");
          const login = await prisma.auth.create({
            data: {
              rollno: detail.rollno.toUpperCase(),
              pass: hashPassword,
              type: 0,
            },
          });
          if (!login) {
            notAdded++;
            return;
          }
        }
        const fee = await prisma.alumni.create({
          data: {
            rollno: detail.rollno.toUpperCase(),
            name: detail.feename,
            academic: Number.parseInt(detail.academic),
            // tuition: Number.parseInt(detail.tuition),
            // development: Number.parseInt(detail.development),
            // placement: Number.parseInt(detail.placement),
            // exam: Number.parseInt(detail.exam),
            // revaluation: Number.parseInt(detail.revaluation),
            // photocopy: Number.parseInt(detail.photocopy),
            alumni: Number.parseInt(detail.alumni),
            others: Number.parseInt(detail.others),
            total: Number.parseInt(detail.total),
          },
        });
        if (fee && fee.total != 0) {
          const paymentIntent = await stripe.paymentIntents.create({
            amount: fee.total * 100,
            currency: "inr",
            metadata: {
              integration_check: "accept_a_payment",
              feeId: fee.id,
              rollno: student.rollno.toUpperCase(),
            },
          });
          if (!paymentIntent) {
            notAdded++;
            return;
          }
          const updateFee = await prisma.alumni.update({
            where: {
              id: fee.id,
            },
            data: {
              intentId: paymentIntent.id,
            },
          });
          if (!updateFee) {
            notAdded++;
            return;
          }
          added++;
          return updateFee;
        } else {
          if (fee.total == 0) {
            const updateFee = await prisma.alumni.update({
              where: {
                id: fee.id,
              },
              data: {
                paid: 1,
              },
            });
            if (!updateFee) {
              notAdded++;
              return;
            }
            paymentController.generatePaySlip(student, updateFee, "-");
            added++;
            return updateFee;
          }
          notAdded++;
          return;
        }
      } else {
        const login = await prisma.auth.findFirst({
          where: {
            rollno: detail.rollno.toUpperCase(),
          },
        });
        if (login) {
          const student = await prisma.student.create({
            data: {
              name: detail.name,
              year: Number.parseInt(detail.year),
              dept: detail.dept,
              rollno: detail.rollno.toUpperCase(),
              quota: detail.quota,
              dob: new Date(new String(detail.dob.toISOString()).split("T")[0]),
            },
          });
          if (student) {
            const fee = await prisma.alumni.create({
              data: {
                rollno: detail.rollno.toUpperCase(),
                name: detail.feename,
                academic: Number.parseInt(detail.academic),
                // tuition: Number.parseInt(detail.tuition),
                // development: Number.parseInt(detail.development),
                // placement: Number.parseInt(detail.placement),
                // exam: Number.parseInt(detail.exam),
                // revaluation: Number.parseInt(detail.revaluation),
                // photocopy: Number.parseInt(detail.photocopy),
                alumni: Number.parseInt(detail.alumni),
                others: Number.parseInt(detail.others),
                total: Number.parseInt(detail.total),
              },
            });
            if (fee && fee.total != 0) {
              const paymentIntent = await stripe.paymentIntents.create({
                amount: fee.total * 100,
                currency: "inr",
                metadata: {
                  integration_check: "accept_a_payment",
                  feeId: fee.id,
                  rollno: student.rollno.toUpperCase(),
                },
              });
              if (!paymentIntent) {
                notAdded++;
                return;
              }
              const updateFee = await prisma.alumni.update({
                where: {
                  id: fee.id,
                },
                data: {
                  intentId: paymentIntent.id,
                },
              });
              if (!updateFee) {
                notAdded++;
                return;
              }
              added++;
              return updateFee;
            } else {
              if (fee.total == 0) {
                const updateFee = await prisma.alumni.update({
                  where: {
                    id: fee.id,
                  },
                  data: {
                    paid: 1,
                  },
                });
                if (!updateFee) {
                  notAdded++;
                  return;
                }
                paymentController.generatePaySlip(student, updateFee, "-");
                added++;
                return updateFee;
              }
              notAdded++;
              return;
            }
          } else {
            notAdded++;
            return;
          }
        } else {
          const hashPassword = crypto
            .createHash("sha512")
            .update(new String(detail.dob.toISOString()).split("T")[0])
            .digest("hex");
          const login = await prisma.auth.create({
            data: {
              rollno: detail.rollno.toUpperCase(),
              pass: hashPassword,
              type: 0,
            },
          });
          if (!login) {
            notAdded++;
            return;
          } else {
            const student = await prisma.student.create({
              data: {
                name: detail.name,
                year: Number.parseInt(detail.year),
                dept: detail.dept,
                rollno: detail.rollno.toUpperCase(),
                quota: detail.quota,
                dob: new Date(
                  new String(detail.dob.toISOString()).split("T")[0]
                ),
              },
            });
            if (student) {
              const fee = await prisma.alumni.create({
                data: {
                  rollno: detail.rollno.toUpperCase(),
                  name: detail.feename,
                  academic: Number.parseInt(detail.academic),
                  // tuition: Number.parseInt(detail.tuition),
                  // development: Number.parseInt(detail.development),
                  // placement: Number.parseInt(detail.placement),
                  // exam: Number.parseInt(detail.exam),
                  // revaluation: Number.parseInt(detail.revaluation),
                  // photocopy: Number.parseInt(detail.photocopy),
                  alumni: Number.parseInt(detail.alumni),
                  others: Number.parseInt(detail.others),
                  total: Number.parseInt(detail.total),
                },
              });
              if (fee && fee.total != 0) {
                const paymentIntent = await stripe.paymentIntents.create({
                  amount: fee.total * 100,
                  currency: "inr",
                  metadata: {
                    integration_check: "accept_a_payment",
                    feeId: fee.id,
                    rollno: student.rollno.toUpperCase(),
                  },
                });
                if (!paymentIntent) {
                  notAdded++;
                  return;
                }
                const updateFee = await prisma.alumni.update({
                  where: {
                    id: fee.id,
                  },
                  data: {
                    intentId: paymentIntent.id,
                  },
                });
                if (!updateFee) {
                  notAdded++;
                  return;
                }
                added++;
                return updateFee;
              } else {
                if (fee.total == 0) {
                  const updateFee = await prisma.alumni.update({
                    where: {
                      id: fee.id,
                    },
                    data: {
                      paid: 1,
                    },
                  });
                  if (!updateFee) {
                    notAdded++;
                    return;
                  }
                  paymentController.generatePaySlip(student, updateFee, "-");
                  added++;
                  return updateFee;
                }
                notAdded++;
                return;
              }
            }
          }
        }
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

export default bulkUploadAlumni;
