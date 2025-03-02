import { Router } from "express";
import bulk from "./bulk/bulk.route.js";
import single from "./single/single.route.js";
import fetch from "./fetch/fetch.route.js";
import user from "./user/user.route.js";
import modify from "./modify/modify.route.js";
import download from "./download/download.route.js";
import register from "./register/register.route.js";
import semester from "./semester/semester.route.js";
import setFee from "./setFee/setFee.route.js";
import transaction from "./transaction/transaction.route.js";

const admin = Router();

admin.use("/fetch", fetch);
admin.use("/bulk", bulk);
admin.use("/single", single);
admin.use("/user", user);
admin.use("/modify", modify);
admin.use("/download", download);
admin.use("/register", register);
admin.use("/semester", semester);
admin.use("/setFee", setFee);
admin.use("/transaction", transaction);

export default admin;
