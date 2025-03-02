import prisma from "../../middleware/prisma.js";
import excelToJson from "convert-excel-to-json";
import * as crypto from "crypto";
import PaymentController from "../../payment/payment.controller.js";
import { format } from "path";

const registerStudentBulk = async (req, res) => {
  try {
    const { path } = res.locals.file;
    console.log("path:", res.locals.file);
    const rawdetails = excelToJson({
      sourceFile: path,
      header: {
        rows: 4,
      },
      columnToKey: {
        C: "rollno",
        D: "regno",
        E: "name",
        F: "dob",
        G: "year",
        H: "dept",
        I: "quota",
        J: "sem",
      },
    });
    // const details = rawdetails["CSE A"].concat(
    //   rawdetails["CSE B"].concat(
    //     rawdetails["IT"].concat(
    //       rawdetails["ECE"].concat(
    //         rawdetails["EEE"].concat(
    //           rawdetails["MECH"]
    //           )
    //         )
    //       )
    //     )
    //   );
    const details = rawdetails["Sheet1"];
    let added = 0;
    let notAdded = 0;
    let counter = 0;

    const uploadAdd = async (detail) => {
      const studentreg = await prisma.student.findFirst({
        where: {
          regno: detail.regno.toString(),
        },
      });
      // if (studentreg) {
      //   return res
      //     .status(400)
      //     .json({ message: "Register Number Already Exists" });
      // }

      // console.log("typeof dob : ", typeof detail.dob);
      // console.log("dob : ", detail.dob);
      if (!(detail.dob instanceof Date)) {
        return res.status(400).json({ message: "Invalid DOB Format" });
      }
      if (isNaN(detail.dob.getTime())) {
        return res.status(400).json({ message: "Invalid DOB Format" });
      }
      // console.log("dob : ", detail.dob);
      // console.log("formatted dob : ", detail.dob.toLocaleDateString("en-CA"));
      // console.log("offset dob : ", detail.dob.getTimezoneOffset());
      // let formatDob = detail.dob + detail.dob.getTimezoneOffset();
      // console.log("formatted dob : ", formatDob);
      detail.dob = detail.dob.toLocaleDateString("en-CA");

      counter++;
      const student = await prisma.student.findFirst({
        where: {
          rollno: detail.rollno.toUpperCase(),
        },
      });
      if (student) {
        const auth = await prisma.auth.findFirst({
          where: {
            rollno: detail.rollno.toUpperCase(),
          },
        });
        if (!auth) {
          const hashPassword = crypto
            .createHash("sha512")
            .update(detail.dob)
            .digest("hex");
          const login = await prisma.auth.create({
            data: {
              rollno: detail.rollno.toUpperCase(),
              pass: hashPassword,
              type: 0,
            },
          });
          if (!login) {
            notAdded++;
            return;
          }
          added++;
        }
      } else {
        const login = await prisma.auth.findFirst({
          where: {
            rollno: detail.rollno.toUpperCase(),
          },
        });
        if (login) {
          const student = await prisma.student.create({
            data: {
              name: detail.name,
              year: Number.parseInt(detail.year),
              dept: detail.dept,
              rollno: detail.rollno.toUpperCase(),
              regno: detail.regno.toString(),
              quota: detail.quota,
              dob: new Date(detail.dob),
              semester: detail.sem,
            },
          });
          if (!student) {
            notAdded++;
            return;
          } else {
            added++;
          }
        } else {
          const hashPassword = crypto
            .createHash("sha512")
            .update(detail.dob)
            .digest("hex");
          const login = await prisma.auth.create({
            data: {
              rollno: detail.rollno.toUpperCase(),
              pass: hashPassword,
              type: 0,
            },
          });
          if (!login) {
            notAdded++;
            return;
          } else {
            const student = await prisma.student.create({
              data: {
                name: detail.name,
                regno: detail.regno.toString(),
                year: Number.parseInt(detail.year),
                dept: detail.dept,
                rollno: detail.rollno.toUpperCase(),
                quota: detail.quota,
                semester: detail.sem,
                dob: new Date(detail.dob),
              },
            });
            if (!student) {
              notAdded++;
              return;
            } else {
              added++;
            }
          }
        }
      }
    };
    const uploadArr = await Promise.all(details.map(uploadAdd));
    console.log("counter", counter);
    if (uploadArr && notAdded == 0) {
      return res.status(200).json({
        message: "Students Registered Successfully",
        // uploadArr,
        added,
        notAdded,
      });
    } else if (uploadArr && notAdded != 0 && added != 0) {
      return res.status(200).json({
        message: "Some Students are Registered",
        // uploadArr,
        added,
        notAdded,
      });
    } else {
      return res.status(209).json({
        message: "Students Not Registered",
        // uploadArr,
        added,
        notAdded,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default registerStudentBulk;
