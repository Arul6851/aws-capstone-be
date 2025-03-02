import express from "express";
import cors from "cors";
import bodyparser from "body-parser";
import home from "./home.js";
import auth from "./auth/auth.route.js";
import payment from "./payment/payment.route.js";
import fee from "./fee/fee.route.js";
import admin from "./admin/admin.route.js";
import { validateUser, validateAdmin } from "./middleware/validate.js";
import user from "./user/user.route.js";
import transaction from "./transaction/transaction.route.js";
import getFee from "./getFee/getFee.route.js";
import verify from "./verify/verify.route.js";
import process from "./transaction/processing/processing.route.js";
import process2 from "./transaction/processing/processing.adminroute.js";

class App {
  express;

  constructor() {
    this.express = express();
    this.setMiddlewares();
    this.setRoutes();
  }

  setMiddlewares() {
    this.express.use(
      cors({
        origin: "*",
        credentials: true,
      })
    );
    this.express.options("*", cors());
    this.express.use(express.json());
    this.express.use(bodyparser.urlencoded({ extended: false }));
    this.express.use(express.urlencoded({ extended: false }));
  }

  setRoutes() {
    this.express.all("/*", function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
    });

    this.express.use((req, res, next) => {
      req.time = new Date(Date.now()).toString();
      console.log(req.method, req.hostname, req.ip, req.path, req.time);
      next();
    });

    this.express.use("/api", home);
    this.express.use("/api/auth", auth);
    this.express.use("/api/admin", validateAdmin, admin);
    this.express.use("/api/fee", validateUser, fee);
    this.express.use("/api/payment", validateUser, payment);
    this.express.use("/api/user", validateUser, user);
    this.express.use("/api/transaction", validateUser, process);
    this.express.use("/api/transactionadmin", validateAdmin, process2);
    this.express.use("/api/getFee", validateUser, getFee);
    this.express.use("/api/verify", verify);
    this.express.use("/api/static", express.static("public/receipts"));
  }
}

export default new App().express;
