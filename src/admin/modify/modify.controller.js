import prisma from "../../middleware/prisma.js";
import { parseISO, isValid } from "date-fns";

class ModifyController {
  updatestudent = async (req, res) => {
    try {
      const isValidDate = async (stringDate) => {
        return !isNaN(Date.parse(stringDate));
      };

      const { rollno, name, dob, dept, year, semester, quota } = req.body;
      const valid = await isValidDate(dob);
      if (valid.toString() === "false") {
        return res.status(400).json({ message: "Invalid DOB Format" });
      }
      const studentExists = await prisma.student.findFirst({
        where: {
          rollno: rollno,
        },
      });
      if (studentExists) {
        const updatestudent = await prisma.student.update({
          where: {
            rollno: studentExists.rollno,
          },
          data: {
            rollno,
            name,
            dob: new Date(dob),
            // dob,
            dept,
            year,
            semester,
            quota,
          },
        });
        if (updatestudent) {
          return res.status(200).json({
            message: "Student details Updated Successfully",
            fee: updatestudent,
          });
        } else {
          return res
            .status(500)
            .json({ message: "Student details not updated" });
        }
      } else {
        return res.status(404).json({ message: "Student details not found" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  updateUserFee = async (req, res) => {
    try {
      const {
        feeId,
        tuition,
        exam,
        development,
        placement,
        revaluation,
        photocopy,
        alumni,
        others,
        total,
      } = req.body;
      const feeExists = await prisma.fee.findFirst({
        where: {
          id: feeId,
        },
      });
      const oldFeeExists = await prisma.oldfee.findFirst({
        where: {
          id: feeId,
        },
      });

      if (feeExists) {
        const updateFee = await prisma.fee.update({
          where: {
            id: feeExists.id,
          },
          data: {
            tuition,
            development,
            exam,
            placement,
            revaluation,
            photocopy,
            alumni,
            others,
            total,
          },
        });
        if (updateFee) {
          const updateIntent = await stripe.paymentIntents.update(
            updateFee.intentId,
            {
              amount: updateFee.total * 100,
            }
          );
          if (!updateIntent) {
            return res.status(500).json({ message: "Payment Not Updated" });
          }
          return res
            .status(200)
            .json({ message: "Fee Updated Successfully", fee: updateFee });
        } else
          return res.status(500).json({ message: "Fee details not found" });
      } else if (oldFeeExists) {
        const updateFee = await prisma.oldfee.update({
          where: {
            id: oldFeeExists.id,
          },
          data: {
            tuition,
            development,
            exam,
            placement,
            revaluation,
            photocopy,
            alumni,
            others,
            total,
          },
        });
        if (updateFee) {
          const updateIntent = await stripe.paymentIntents.update(
            updateFee.intentId,
            {
              amount: updateFee.total * 100,
            }
          );
          if (!updateIntent) {
            return res.status(500).json({ message: "Payment Not Updated" });
          }
          return res
            .status(200)
            .json({ message: "Fee Updated Successfully", fee: updateFee });
        } else
          return res.status(500).json({ message: "Fee details not found" });
      } else {
        return res.status(500).json({ message: "Fee details not found" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  updateTuitionFee = async (req, res) => {
    try {
      const {
        rollno,
        year,
        tuition,
        development,
        placement,
        others,
        paid,
        enabled,
      } = req.body;
      console.log(req.body);
      const tuitionId = await prisma.tuition.findFirst({
        where: {
          rollno,
          academic: parseInt(year),
        },
      });

      if (tuitionId) {
        await prisma.tuition.update({
          where: { id: tuitionId.id },
          data: {
            tuition: parseInt(tuition),
            development: parseInt(development),
            placement: parseInt(placement),
            others: parseInt(others),
            paid: parseInt(paid),
            enabled: parseInt(enabled),
          },
        });
        return res.status(200).json({
          message: `Tuition Fee updated for ${rollno} for the year ${year} successfully`,
        });
      }
      return res.status(400).json({
        message: `Tuition Fee not found for ${rollno} for the year ${year} `,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  updateExamFee = async (req, res) => {
    const { id, exam, arrear, others, paid } = req.body;

    try {
      const feeExists = await prisma.exam.findFirst({
        where: {
          id: id,
        },
      });
      if (feeExists) {
        const updateFee = await prisma.exam.update({
          where: {
            id: id,
          },
          data: {
            exam: parseInt(exam),
            arrear: parseInt(arrear),
            others: parseInt(others),
            paid,
          },
        });
        if (updateFee) {
          return res
            .status(200)
            .json({ message: "Fee Updated Successfully", fee: updateFee });
        } else
          return res.status(500).json({ message: "Fee details not found" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  updateAlumniFee = async (req, res) => {
    const { feeId, alumni, others, total } = req.body;

    try {
      const feeExists = await prisma.alumni.findFirst({
        where: {
          id: feeId,
        },
      });
      const oldFeeExists = await prisma.oldalumni.findFirst({
        where: {
          id: feeId,
        },
      });

      if (feeExists) {
        const updateFee = await prisma.alumni.update({
          where: {
            id: feeExists.id,
          },
          data: {
            alumni,
            others,
            total,
          },
        });
        if (updateFee) {
          const updateIntent = await stripe.paymentIntents.update(
            updateFee.intentId,
            {
              amount: updateFee.total * 100,
            }
          );
          if (!updateIntent) {
            return res.status(500).json({ message: "Payment Not Updated" });
          }
          return res
            .status(200)
            .json({ message: "Fee Updated Successfully", fee: updateFee });
        } else
          return res.status(500).json({ message: "Fee details not found" });
      } else if (oldFeeExists) {
        const updateFee = await prisma.oldalumni.update({
          where: {
            id: oldFeeExists.id,
          },
          data: {
            alumni,
            others,
            total,
          },
        });
        if (updateFee) {
          const updateIntent = await stripe.paymentIntents.update(
            updateFee.intentId,
            {
              amount: updateFee.total * 100,
            }
          );
          if (!updateIntent) {
            return res.status(500).json({ message: "Payment Not Updated" });
          }
          return res
            .status(200)
            .json({ message: "Fee Updated Successfully", fee: updateFee });
        } else {
          return res.status(500).json({ message: "Fee details not found" });
        }
      } else {
        return res.status(500).json({ message: "Fee details not found" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default ModifyController;
