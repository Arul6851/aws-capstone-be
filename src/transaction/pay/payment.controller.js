import prisma from "../../middleware/prisma.js";

const payFees = async (req, res, next) => {
  try {
    const { id, amount, simulate } = req.body;

    if (!id || !amount) {
      return res.status(400).json({
        message: "Amount and ID are required fields",
      });
    }

    const payment = simulate;
    if (payment) {
      const paymentData = {
        intentId: "1234",
        feeId: id,
        timeStamp: new Date(),
        amount: parseInt(amount),
        status: "Success",
      };

      req.paymentData = paymentData;
      req.paymentData.id = id;
      next();
    } else {
      const paymentData = {
        intentId: "5678",
        feeId: id,
        timeStamp: new Date(),
        amount: parseInt(amount),
        status: "Failure",
      };
      req.paymentData = paymentData;
      req.paymentData.id = id;
      next();
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export default payFees;
