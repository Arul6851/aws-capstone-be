import prisma from "../middleware/prisma.js";
import * as crypto from "crypto";
import CryptoJS from "crypto-js";

class AuthController {
  Login = async (req, res) => {
    try {
      const { rollno, encPass } = req.body;
      const hashPassword = crypto
        .createHash("sha512")
        .update(encPass)
        .digest("hex");
      const userAvailable = await prisma.auth.findUnique({
        where: {
          rollno,
        },
      });
      if (userAvailable) {
        console.log("useravailable", userAvailable);
        if (userAvailable.pass === hashPassword) {
          const auth_token = crypto
            .createHash("sha512")
            .update(crypto.randomBytes(32).toString("hex"))
            .digest("hex");
          const updateAuthToken = await prisma.auth.update({
            where: {
              rollno,
            },
            data: {
              token: auth_token,
            },
          });
          if (updateAuthToken) {
            const { pass, ...user } = updateAuthToken;
            return res.status(200).json({ message: "Login Successful", user });
          } else {
            return res.status(500).json({ message: "Internal Server Error" });
          }
        } else {
          return res.status(401).json({ message: "Invalid Credentials" });
        }
      } else {
        return res.status(401).json({ message: "User does not exists" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  adminRegister = async (req, res) => {
    try {
      const { rollno, encPass, name, designation } = req.body;
      const hashPassword = crypto
        .createHash("sha512")
        .update(encPass)
        .digest("hex");
      var admin = null;
      var adminDet = null;
      const adminAvailable = await prisma.auth.findUnique({
        where: {
          rollno,
        },
      });
      const adminDetAvailable = await prisma.admin.findUnique({
        where: {
          rollno,
        },
      });
      if (adminAvailable && adminDetAvailable) {
        return res.status(400).json({ message: "Admin Already Exists" });
      } else if (!adminAvailable) {
        admin = await prisma.auth.create({
          data: {
            rollno,
            pass: hashPassword,
            type: 1,
          },
        });
        if (!admin) {
          return res.status(500).json({ message: "Internal Server Error" });
        }
      } else {
        adminDet = await prisma.admin.create({
          data: {
            rollno,
            name,
            designation,
          },
        });
        if (!adminDet) {
          return res.status(500).json({ message: "Internal Server Error" });
        }
      }
      return res.status(200).json({ message: "Admin Created Successfully" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default AuthController;
