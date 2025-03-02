import { Router } from "express";
import processingcontroller from "./processing.controller.js";
import FetchTransactions from "../fetch/fetchTransactions.controller.js";
const fetch = new FetchTransactions();
const process2 = Router();
const processingController2 = new processingcontroller();
process2.get("/fetchall", async (req, res) => {
  try {
    const params = res.locals.user;
    fetch.getAllTransactions(params, (results) => {
      if (!results) {
        console.log("error");
      } else {
        res.status(results.code).json(results);
      }
    });
  } catch (err) {
    console.log("errorherreee", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
process2.get("/fetchallexam", async (req, res) => {
  try {
    const params = res.locals.user;
    fetch.getExamTransactions(params, (results) => {
      if (!results) {
        console.log("error");
      } else {
        res.status(results.code).json(results);
      }
    });
  } catch (err) {
    console.log("errorherreee", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
export default process2;
