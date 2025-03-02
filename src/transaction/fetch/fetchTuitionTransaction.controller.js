import prisma from "../../middleware/prisma.js";

class TuitionTransactionFetchController {
  getTransactionsByTransactionId = async (req, res) => {
    try {
      const { transactionId } = req.body;

      const transaction = await prisma.tuitionTransaction.findFirst({
        where: {
          transactionId,
        },
      });

      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      return res.status(200).json({
        message: "Transaction fetched successfully",
        transaction,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getTransactionsByRollNo = async (req, res) => {
    try {
      const { rollNo } = req.body;

      const transactions = await prisma.tuitionTransaction.findMany({
        where: {
          rollNo,
        },
      });

      if (transactions.length === 0) {
        return res.status(404).json({
          message: "No transactions found for the provided roll number",
        });
      }

      return res.status(200).json({
        message: "Transactions fetched successfully",
        transactions,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default TuitionTransactionFetchController;
