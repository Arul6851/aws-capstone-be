import prisma from "../../../middleware/prisma.js";

class FetchTransactions {
  getAllTransactions = async (req, res) => {
    try {
      const tuition = await prisma.tuitionTransaction.findMany();
      const exam = await prisma.examTransaction.findMany();

      const mapTransaction = (transaction) => {
        return {
          id: transaction.id || null,
          intentId: transaction.intentId || null,
          transactionId: transaction.transactionId || null,
          rollno: transaction.rollno || null,
          timeStamp: transaction.timeStamp || null,
          amount: transaction.amount || null,
          status: transaction.status || null,
          academic: transaction.academicYear || transaction.semester || null,
          semester: transaction.semester || null,
          arrearCost: transaction.arrearCost || null,
          feeId:transaction.feeid||null
        };
      };

      // Mapping over each transaction type
      const mappedTuition = tuition.map(mapTransaction);
      const mappedExam = exam.map(mapTransaction);

      // Grouping the transactions by type into a nested array
      const groupedTransactions = [mappedTuition, mappedExam];

      // Check if there are any transactions in any of the groups
      const hasTransactions = groupedTransactions.some(
        (group) => group.length > 0
      );

      if (hasTransactions) {
        return res.status(200).json({
          message: "Transactions Fetched Successfully.",
          transactions: groupedTransactions, // Return the grouped transactions
        });
      } else {
        return res.status(200).json({
          message: "No Transactions Available",
        });
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getTransactionsByRoll = async (req, res) => {
    const { rollno } = req.body;
    // console.log(req.body);
    if (!rollno)
      return res.status(400).json({ message: "Roll number is required." });
    try {
      const tuition = await prisma.tuitionTransaction.findMany({
        where: {
          rollno,
        },
      });
      const exam = await prisma.examTransaction.findMany({
        where: {
          rollno,
        },
      });

      const mapTransaction = (transaction) => {
        return {
          id: transaction.id || null,
          intentId: transaction.intentId || null,
          transactionId: transaction.transactionId || null,
          rollno: transaction.rollno || null,
          timeStamp: transaction.timeStamp || null,
          amount: transaction.amount || null,
          status: transaction.status || null,
          academic: transaction.academicYear || transaction.semester || null,
          semester: transaction.semester || null,
          arrearCost: transaction.arrearCost || null,
          feeId:transaction.feeid||null

        };
      };

      const allTransactions = [
        ...tuition.map(mapTransaction),
        ...exam.map(mapTransaction),
      ];

      if (allTransactions.length > 0) {
        return res.status(200).json({
          message:
            "Transactions Fetched Successfully for roll number: " + rollno,
          transactions: allTransactions,
        });
      } else {
        return res.status(200).json({
          message: "No Transactions Available for roll number: " + rollno,
        });
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default FetchTransactions;
