import { Router } from "express";
import payFees from "./pay/payment.controller.js";
import insertTransaction from "./pay/transaction.controller.js";
import FetchTransactions from "./fetch/fetchTransactions.controller.js";
const transaction = Router();
const fetch = new FetchTransactions();
// transaction.post("/pay/fees", payFees, insertTransaction);
// // transaction.get("/fetch/all", fetch.getAllTransactions);
// transaction.post("/fetch/roll", fetch.getTransactionsByRoll);
// transaction.post("/fetchexam/rollno", fetch.getExamTransactionsByRollNo);
// transaction.get("/fetchtuition", async (req, res) => {
//   try {
//     const params = res.locals.user;
//     fetch.getTuitionTransactions(params, (results) => {
//       if (!results) {
//         console.log("error");
//       } else {
//         res.status(results.code).json(results);
//       }
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });
export default transaction;
