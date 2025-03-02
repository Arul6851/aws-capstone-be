import { Router } from "express";
import FeeController from "./fee.controller.js";

const fee = Router();
const feeController = new FeeController();

// API login Page
fee.get("/", async (req, res) => {
  try {
    const params = res.locals.user;
    feeController.getFeeDetails(params, (results) => {
      if (!results) {
        console.log("error");
      } else {
        res.status(results.code).json(results);
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
fee.get("/tuition", async (req, res) => {
  try {
    const params = res.locals.user;
    feeController.getTutionFee(params, (results) => {
      if (!results) {
        console.log("error");
      } else {
        res.status(results.code).json(results);
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
fee.get("/exam", async (req, res) => {
  try {
    const params = res.locals.user;
    feeController.getExamFee(params, (results) => {
      if (!results) {
        console.log("error");
      } else {
        res.status(results.code).json(results);
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
fee.get("/:feeId", async (req, res) => {
  try {
    const { feeId } = req.params;
    feeController.getFeeById(req, res, feeId, (results) => {
      if (!results) {
        console.log("error");
      } else {
        res.status(results.code).json(results);
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default fee;
