import prisma from "../../middleware/prisma.js";
class processingcontroller {
  initiateTuitionPayment = async (req, res, next) => {
    try {
      const { id, amount, rollno, academicYear } = req.body;

      if (!id || !amount) {
        return res.status(400).json({
          message: "Amount and ID are required fields",
        });
      }

      const paymentData = {
        feeId: id,
        timeStamp: new Date(),
        amount: parseInt(amount),
      };

      try {
        const transaction = await prisma.tuitionTransaction.create({
          data: {
            rollno: rollno,
            academicYear: academicYear,
            feeid: id,
            txn_status: "incomplete",
          },
        });
        if (!transaction) {
          return res
            .status(500)
            .json({ message: "Transaction creation failed" });
        }

        // Return the clnt_txn_ref
        return res.status(201).json({
          message: "Transaction initiated successfully",
          transaction: {
            clnt_txn_ref: transaction.clnt_txn_ref,
          },
        });
      } catch (error) {
        console.error("Error creating base transaction:", error);
        return res
          .status(500)
          .json({ message: "Failed to create base transaction" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  updateTuitionPayment = async (req, res, next) => {
    try {
      const { clnt_txn_ref, txn_status, ...updatedFields } = req.body;

      if (!clnt_txn_ref) {
        return res.status(400).json({
          message: "ID is a required field",
        });
      }

      const existingTransaction = await prisma.tuitionTransaction.findUnique({
        where: { clnt_txn_ref: parseInt(clnt_txn_ref) },
      });

      if (!existingTransaction) {
        return res.status(404).json({
          message: "Transaction not found",
        });
      }

      const updatedTransaction = await prisma.tuitionTransaction.update({
        where: { clnt_txn_ref: parseInt(clnt_txn_ref) },
        data: {
          ...updatedFields,
          txn_status: txn_status || existingTransaction.txn_status,
        },
      });
      if (txn_status === "0300" || toString(txn_status) === "0300") {
        const user = await prisma.student.findFirst({
          where: {
            rollno: existingTransaction.rollno,
          },
        });

        const paidFee = await prisma.tuition.update({
          where: { id: existingTransaction.feeid },
          data: {
            paid: 1,
            paiddate: new Date(),
          },
        });
        // this.generatePaySlip(user, paidFee, mode);
      }
      console.log("Transaction : ", updatedTransaction);
      res.status(200).json({
        status: "success",
        message: "Transaction Logged successfully",
        transaction: updatedTransaction,
      });
    } catch (err) {
      console.error("Error Logging transaction:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getTransactionDetails = async (req, res) => {
    try {
      const { clnt_txn_ref } = req.query;

      if (!clnt_txn_ref) {
        return res.status(400).json({
          message:
            "Client Transaction Reference (clnt_txn_ref) is a required query parameter",
        });
      }

      const transaction = await prisma.tuitionTransaction.findUnique({
        where: { clnt_txn_ref: parseInt(clnt_txn_ref) },
      });

      if (!transaction) {
        return res.status(404).json({
          message: "Transaction not found",
        });
      }

      res.status(200).json({
        message: "Transaction details retrieved successfully",
        transaction,
      });
    } catch (err) {
      console.error("Error fetching transaction details:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  getSuccessTransaction = async (req, res) => {
    try {
      const { feeid } = req.query;

      if (!feeid) {
        return res.status(400).json({
          message:
            "Client Transaction Reference (feeid) is a required query parameter",
        });
      }

      const transaction = await prisma.tuitionTransaction.findFirst({
        where: { AND: [{ feeid: feeid }, { txn_status: "0300" }] },
      });

      if (!transaction) {
        return res.status(404).json({
          message: "Transaction not found",
        });
      }
      // console.log("Success Transaction Found : ", transaction);
      res.status(200).json({
        message: "Transaction details retrieved successfully",
        transaction,
      });
    } catch (err) {
      console.error("Error fetching transaction details:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
export default processingcontroller;
