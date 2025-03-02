import { Router } from "express";
import FetchTransactions from "./fetch/fetchTransactions.controller.js";
const transaction = Router();
const fetch = new FetchTransactions();
transaction.get("/fetch/all", fetch.getAllTransactions);
transaction.post("/fetch/roll", fetch.getTransactionsByRoll);
export default transaction;
