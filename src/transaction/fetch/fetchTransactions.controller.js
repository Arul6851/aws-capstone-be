import prisma from "../../middleware/prisma.js";

class FetchTransactions {
  getTuitionTransactions = async (params, callback) => {
    const user = params;
    try {
      if (user) {
        const transactions = await prisma.tuitionTransaction.findMany({
          where: {
            rollno: user.rollno,
          },
        });
        const examtransactions = await prisma.examTransaction.findMany({
          where: {
            rollno: user.rollno,
          },
        });

        if (transactions.length === 0 && examtransactions.length === 0) {
          return callback({
            message: "No transactions found for the provided roll number",
            code: 404,
          });
        }
        return callback({
          message: "Transactions fetched successfully",
          transactions,
          examtransactions,
          code: 200,
        });
      } else {
        return callback({
          message: "No User Found",
          code: 404,
        });
      }
    } catch (err) {
      console.error(err);
      return callback({ message: "Internal Server Error", code: 500 });
    }
  };

  getAllTransactions = async (params, callback) => {
    try {
      const tuitiontransactions = await prisma.tuitionTransaction.findMany();
      if (tuitiontransactions.length === 0 && examtransactions.length === 0) {
        return callback({
          message: "No transactions found",
          code: 404,
        });
      }
      return callback({
        message: "Transactions fetched successfully",
        tuitiontransactions: tuitiontransactions,
        code: 200,
      });
    } catch (err) {
      console.error(err);
      return callback({ message: "Internal Server Error", code: 500 });
    }
  };
  getExamTransactions = async (params, callback) => {
    try {
      const examtransactions = await prisma.examTransaction.findMany();
      if (tuitiontransactions.length === 0 && examtransactions.length === 0) {
        return callback({
          message: "No transactions found",
          code: 404,
        });
      }
      return callback({
        message: "Transactions fetched successfully",
        examtransactions: examtransactions,
        code: 200,
      });
    } catch (err) {
      console.error(err);
      return callback({ message: "Internal Server Error", code: 500 });
    }
  };
}

export default FetchTransactions;
