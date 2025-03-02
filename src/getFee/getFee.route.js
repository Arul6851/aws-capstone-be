import { Router } from "express";
import getFeeDetails from "./getFee.controller.js";

const getFee = Router();
getFee.get("/", getFeeDetails);
// getFee.get("/:id", getFeeById);
export default getFee;
