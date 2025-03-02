import prisma from "../middleware/prisma.js";
import PDFDocument from "pdfkit";
import crypto from "crypto";
class PaymentController {
  generatePaySlip = (req, res) => {
    try {
      const { user, fee, mode } = req.body;
      let doc = new PDFDocument({ size: "A4", margin: 50 });
      let totalfee = 0;

      const invoice = [
        { name: "Tuition Fee", amount: fee.tuition },
        { name: "Development Fee", amount: fee.development },
        { name: "Placement Fee", amount: fee.placement },
        { name: "Exam Fee", amount: fee.exam },
        { name: "Arrear Fee", amount: fee.arrear },
        { name: "Others", amount: fee.others },
      ];

      const invoiceLen = invoice.length;

      const generateHeader = (doc) => {
        doc
          .image("public/LICET.jpg", 50, 45, { width: 50 })
          .fillColor("#444444")
          .fontSize(20)
          .text("LICET", 110, 57)
          .fontSize(10)
          .text("Loyola ICAM College of Engineering and Technology", 200, 50, {
            align: "right",
          })
          .text("Loyola College Campus", 200, 65, { align: "right" })
          .text("Nungambakkam", 200, 80, { align: "right" })
          .text("Chennai - 600034", 200, 95, { align: "right" })
          .moveDown();
      };

      const generateCustomerInformation = (doc) => {
        doc
          .fillColor("#444444")
          .fontSize(20)
          .text(
            "Fee Receipt - " +
              `${fee.academic ? fee.academic : "Semester " + user.semester}`,
            50,
            160
          );

        generateHr(doc, 200);

        const customerInformationTop = 220;

        doc
          .fontSize(10)
          .text("Name :", 50, customerInformationTop)
          .font("Helvetica-Bold")
          .text(user.name, 150, customerInformationTop)
          .font("Helvetica")
          .text("Date of Payment:", 50, customerInformationTop + 15)
          .text(
            fee.paiddate ? fee?.paiddate.toISOString().split("T")[0] : "-",
            150,
            customerInformationTop + 15
          )
          .text("Mode of Payment:", 50, customerInformationTop + 30)
          .text(mode, 150, customerInformationTop + 30)
          .font("Helvetica-Bold")
          .text("Department : " + user.dept, 300, customerInformationTop)
          .font("Helvetica")
          .text("Year : " + user.year, 300, customerInformationTop + 15)
          .text("", 300, customerInformationTop + 30)
          .moveDown();

        generateHr(doc, 280);
      };

      const generateInvoiceTable = (doc, invoice) => {
        let i;
        const invoiceTableTop = 330;

        doc.font("Helvetica-Bold");
        generateTableRow(doc, invoiceTableTop, "Fee Particulars", "", "Amount");
        generateHr(doc, invoiceTableTop + 20);
        doc.font("Helvetica");
        let notAdded = 0;

        for (i = 0; i < invoiceLen; i++) {
          const item = invoice[i];
          if (item.amount == null || item.amount == undefined) {
            notAdded++;
            continue;
          }
          totalfee += item.amount;
          const position = invoiceTableTop + (i - notAdded + 1) * 30;
          generateTableRow(
            doc,
            position,
            item.name,
            "",
            formatCurrency(item.amount)
          );

          generateHr(doc, position + 20);
        }

        const duePosition = invoiceTableTop + (i + 1) * 30 + 20;
        doc.font("Helvetica-Bold");
        generateTableRow(
          doc,
          duePosition,
          "Total",
          "",
          formatCurrency(totalfee)
        );
        doc.font("Helvetica");
      };

      const generateFooter = (doc) => {
        doc
          .fontSize(10)
          .text(
            "Please note that this an automatically generated receipt and does not require a signature",
            50,
            780,
            { align: "center", width: 500 }
          );
      };

      const generateTableRow = (doc, y, item, unitCost, lineTotal) => {
        doc
          .fontSize(10)
          .text(item, 50, y)
          .text(unitCost, 280, y, { width: 90, align: "right" })
          .text(lineTotal, 0, y, { align: "right" });
      };

      const generateHr = (doc, y) => {
        doc
          .strokeColor("#aaaaaa")
          .lineWidth(1)
          .moveTo(50, y)
          .lineTo(550, y)
          .stroke();
      };

      const formatCurrency = (rupees) => {
        return "Rs. " + rupees.toFixed(2);
      };

      res.setHeader(
        "Content-disposition",
        'attachment; filename="receipt.pdf"'
      );
      res.setHeader("Content-type", "application/pdf");

      generateHeader(doc);
      generateCustomerInformation(doc);
      generateInvoiceTable(doc, invoice);
      generateFooter(doc);

      doc.pipe(res);
      doc.end();
    } catch (err) {
      console.log(err);
      res.status(500).send("Error generating pay slip");
    }
  };
  generateTuitionPaySlip = async (req, res) => {
    try {
      const { clnt_txn_ref } = req.body;
      const transaction = await prisma.tuitionTransaction.findFirst({
        where: {
          clnt_txn_ref,
        },
      });
      if (transaction == null || transaction == undefined)
        return res.status(400).json({ error: "Transaction not found" });
      const fee = await prisma.tuition.findFirst({
        where: {
          id: transaction.feeid,
        },
      });
      if (fee == null || fee == undefined)
        return res.status(400).json({ error: "Fee not found" });
      const user = await prisma.student.findFirst({
        where: {
          rollno: transaction.rollno,
        },
      });
      if (user == null || user == undefined)
        return res.status(400).json({ error: "User not found" });
      let doc = new PDFDocument({ size: "A4", margin: 50 });
      let totalfee = 0;

      const invoice = [
        { name: "Tuition Fee", amount: fee.tuition },
        { name: "Development Fee", amount: fee.development },
        { name: "Placement Fee", amount: fee.placement },
        { name: "Others", amount: fee.others },
      ];

      const invoiceLen = invoice.length;

      const generateHeader = (doc) => {
        doc
          .image("public/LICET.jpg", 50, 45, { width: 50 })
          .fillColor("#444444")
          .fontSize(20)
          .text("LICET", 110, 57)
          .fontSize(10)
          .text("Loyola ICAM College of Engineering and Technology", 200, 50, {
            align: "right",
          })
          .text("Loyola College Campus", 200, 65, { align: "right" })
          .text("Nungambakkam", 200, 80, { align: "right" })
          .text("Chennai - 600034", 200, 95, { align: "right" })
          .moveDown();
      };

      const generateCustomerInformation = (doc) => {
        doc
          .fillColor("#444444")
          .fontSize(20)
          .text(
            "Tuition Fee Transaction Receipt - " +
              `${fee.academic && "Academic Year " + fee.academic}`,
            50,
            160
          )
          .fontSize(8)
          .text("FeeID: " + `${transaction.feeid}`, 50, 190);

        generateHr(doc, 200);

        const customerInformationTop = 220;

        doc
          .fontSize(10)
          .text("Name :", 50, customerInformationTop)
          .font("Helvetica-Bold")
          .text(user.name, 150, customerInformationTop)
          .font("Helvetica")
          .text("Date of Payment:", 50, customerInformationTop + 15)
          .text(
            transaction.updatedAt
              ? transaction.updatedAt.toISOString().split("T")[0]
              : "-",
            150,
            customerInformationTop + 15
          )
          .text("Reference ID:", 50, customerInformationTop + 30)
          .text(
            `TUT${transaction.clnt_txn_ref}`,
            150,
            customerInformationTop + 30
          )
          .font("Helvetica")
          .text("Department : " + user.dept, 300, customerInformationTop)
          .font("Helvetica")
          .text("Roll No : " + user.rollno, 300, customerInformationTop + 15)
          .text(
            "Transaction Status : " + transaction.txn_msg,
            300,
            customerInformationTop + 30
          )
          .moveDown();

        generateHr(doc, 280);
      };

      const generateInvoiceTable = (doc, invoice) => {
        let i;
        const invoiceTableTop = 330;

        doc.font("Helvetica-Bold");
        generateTableRow(doc, invoiceTableTop, "Fee Particulars", "", "Amount");
        generateHr(doc, invoiceTableTop + 20);
        doc.font("Helvetica");
        let notAdded = 0;

        for (i = 0; i < invoiceLen; i++) {
          const item = invoice[i];
          if (item.amount == null || item.amount == undefined) {
            notAdded++;
            continue;
          }
          totalfee += item.amount;
          const position = invoiceTableTop + (i - notAdded + 1) * 30;
          generateTableRow(
            doc,
            position,
            item.name,
            "",
            formatCurrency(item.amount)
          );

          generateHr(doc, position + 20);
        }

        const duePosition = invoiceTableTop + (i + 1) * 30 + 20;
        doc.font("Helvetica-Bold");
        generateTableRow(
          doc,
          duePosition,
          "Total",
          "",
          formatCurrency(totalfee)
        );
        doc.font("Helvetica");
      };

      const generateFooter = (doc) => {
        doc
          .fontSize(10)
          .text(
            "Please note that this an automatically generated receipt and does not require a signature",
            50,
            780,
            { align: "center", width: 500 }
          );
      };

      const generateTableRow = (doc, y, item, unitCost, lineTotal) => {
        doc
          .fontSize(10)
          .text(item, 50, y)
          .text(unitCost, 280, y, { width: 90, align: "right" })
          .text(lineTotal, 0, y, { align: "right" });
      };

      const generateHr = (doc, y) => {
        doc
          .strokeColor("#aaaaaa")
          .lineWidth(1)
          .moveTo(50, y)
          .lineTo(550, y)
          .stroke();
      };

      const formatCurrency = (rupees) => {
        return "Rs. " + rupees.toFixed(2);
      };

      res.setHeader(
        "Content-disposition",
        'attachment; filename="receipt.pdf"'
      );
      res.setHeader("Content-type", "application/pdf");

      generateHeader(doc);
      generateCustomerInformation(doc);
      generateInvoiceTable(doc, invoice);
      generateFooter(doc);

      doc.pipe(res);
      doc.end();
    } catch (err) {
      console.log(err);
      res.status(500).send("Error generating pay slip");
    }
  };
  handlePayment = async (req, res) => {
    try {
      const { feeId, mode } = req.body;
      const localUser = res.locals.user;
      const user = await prisma.student.findFirst({
        where: {
          rollno: localUser.rollno,
        },
      });

      if (feeId == null || feeId == undefined || feeId == "")
        return res.status(400).json({ error: "No fee id provided" });
      else {
        const tuitionFee = await prisma.tuition.findFirst({
          where: {
            id: feeId,
          },
        });

        const examFee = await prisma.exam.findFirst({
          where: {
            id: feeId,
          },
        });

        const alumniFee = await prisma.alumni.findFirst({
          where: {
            id: feeId,
          },
        });

        const oldtuitonFee = await prisma.oldtuition.findFirst({
          where: {
            id: feeId,
          },
        });

        const oldexamFee = await prisma.oldexam.findFirst({
          where: {
            id: feeId,
          },
        });

        const oldalumniFee = await prisma.oldalumni.findFirst({
          where: {
            id: feeId,
          },
        });

        if (tuitionFee) {
          const paidFee = await prisma.tuition.update({
            where: {
              id: tuitionFee.id,
            },
            data: {
              paid: 1,
              paiddate: new Date(),
            },
          });
          this.generatePaySlip(user, paidFee, mode);
          return res.status(200).json({ message: "Payment successful" });
        } else if (examFee) {
          const paidFee = await prisma.exam.update({
            where: {
              id: examFee.id,
            },
            data: {
              paid: 1,
              paiddate: new Date(),
            },
          });
          this.generatePaySlip(user, paidFee, mode);
          return res.status(200).json({ message: "Payment successful" });
        } else if (alumniFee) {
          const paidFee = await prisma.alumni.update({
            where: {
              id: alumniFee.id,
            },
            data: {
              paid: 1,
              paiddate: new Date(),
            },
          });
          this.generatePaySlip(user, paidFee, mode);
          return res.status(200).json({ message: "Payment successful" });
        } else if (oldtuitonFee) {
          const paidFee = await prisma.oldtuition.update({
            where: {
              id: oldtuitonFee.id,
            },
            data: {
              paid: 1,
              paiddate: new Date(),
            },
          });
          this.generatePaySlip(user, paidFee, mode);
          return res.status(200).json({ message: "Payment successful" });
        } else if (oldexamFee) {
          const paidFee = await prisma.oldexam.update({
            where: {
              id: oldexamFee.id,
            },
            data: {
              paid: 1,
              paiddate: new Date(),
            },
          });
          this.generatePaySlip(user, paidFee, mode);
          return res.status(200).json({ message: "Payment successful" });
        } else if (oldalumniFee) {
          const paidFee = await prisma.oldalumni.update({
            where: {
              id: oldalumniFee.id,
            },
            data: {
              paid: 1,
              paiddate: new Date(),
            },
          });
          this.generatePaySlip(user, paidFee, mode);
          return res.status(200).json({ message: "Payment successful" });
        } else return res.status(400).json({ error: "Fee not found" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  constructor() {
    const salt = process.env.MERCHANT_SALT;
    if (!salt) {
      throw new Error("MERCHANT_SALT environment variable is not set");
    }
    this.SALT = salt;
  }
  generateToken = async (req, res) => {
    try {
      const consumerData = req.body;

      // Validate required fields
      const requiredFields = [
        "merchantId",
        "txnId",
        "totalamount",
        "consumerId",
      ];
      const missingFields = requiredFields.filter(
        (field) => !consumerData[field]
      );

      if (missingFields.length > 0) {
        return res.status(400).json({
          status: "error",
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }

      // Destructure with default empty strings for optional fields
      const {
        merchantId,
        txnId,
        totalamount,
        accountNo = "",
        consumerId,
        consumerMobileNo = "",
        consumerEmailId = "",
        debitStartDate = "",
        debitEndDate = "",
        maxAmount = "",
        amountType = "",
        frequency = "",
        cardNumber = "",
        expMonth = "",
        expYear = "",
        cvvCode = "",
      } = consumerData;

      // Optional validation for email and mobile if provided
      if (consumerEmailId && !this.isValidEmail(consumerEmailId)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid email format",
        });
      }

      if (consumerMobileNo && !this.isValidMobile(consumerMobileNo)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid mobile number format",
        });
      }

      // Create data string for hashing
      const dataFields = [
        merchantId,
        txnId,
        totalamount,
        accountNo,
        consumerId,
        consumerMobileNo,
        consumerEmailId,
        debitStartDate,
        debitEndDate,
        maxAmount,
        amountType,
        frequency,
        cardNumber,
        expMonth,
        expYear,
        cvvCode,
        this.SALT,
      ];

      const dataToHash = dataFields.join("|");

      // Generate hash using SHA-512
      const token = crypto
        .createHash("sha512")
        .update(dataToHash)
        .digest("hex");

      // Log for debugging (remove in production)
      console.log("Token Generation:", {
        merchantId,
        txnId,
        tokenPreview: token.substring(0, 10) + "...",
      });

      return res.json({
        status: "success",
        token,
        merchantId,
        txnId,
      });
    } catch (error) {
      console.error("Token Generation Error:", error);
      return res.status(500).json({
        status: "error",
        message: "Failed to generate token",
        error: error.message || "Unknown error",
      });
    }
  };
  verifyToken = async (req, res) => {
    try {
      const responseData = req.body;

      // Validate required hash
      if (!responseData.hash) {
        return res.status(400).json({
          status: "error",
          message: "Missing hash in response",
        });
      }

      // Destructure with default empty strings
      const {
        txn_status = "",
        txn_msg = "",
        txn_err_msg = "",
        clnt_txn_ref = "",
        tpsl_bank_cd = "",
        tpsl_txn_id = "",
        txn_amt = "",
        clnt_rqst_meta = "",
        tpsl_txn_time = "",
        bal_amt = "",
        card_id = "",
        alias_name = "",
        BankTransactionID = "",
        mandate_reg_no = "",
        token = "",
        hash,
      } = responseData;

      // Create data string for hash verification
      const dataFields = [
        txn_status,
        txn_msg,
        txn_err_msg,
        clnt_txn_ref,
        tpsl_bank_cd,
        tpsl_txn_id,
        txn_amt,
        clnt_rqst_meta,
        tpsl_txn_time,
        bal_amt,
        card_id,
        alias_name,
        BankTransactionID,
        mandate_reg_no,
        token,
        this.SALT,
      ];

      const dataToHash = dataFields.join("|");

      // Generate verification hash
      const calculatedHash = crypto
        .createHash("sha512")
        .update(dataToHash)
        .digest("hex");

      // Verify hash
      const isValid = calculatedHash === hash;

      if (isValid) {
        // Get transaction status details
        const statusDetails = this.getTransactionStatusResponse(txn_status);

        return res.json({
          status: "success",
          message: "Transaction verified successfully",
          transaction: {
            status: statusDetails,
            statusCode: txn_status,
            reference: clnt_txn_ref,
            amount: txn_amt,
            bankTransactionId: BankTransactionID,
            timestamp: tpsl_txn_time,
            message: txn_msg || "Transaction processed",
          },
        });
      } else {
        // Log hash mismatch (remove sensitive data in production)
        console.warn("Hash Mismatch:", {
          receivedHash: hash.substring(0, 10) + "...",
          calculatedHash: calculatedHash.substring(0, 10) + "...",
          transactionRef: clnt_txn_ref,
        });

        return res.json({
          status: "failure",
          message: "Hash mismatch, verification failed",
          details: {
            txnStatus: txn_status,
            txnMessage: txn_msg,
            errorMessage: txn_err_msg,
          },
        });
      }
    } catch (error) {
      console.error("Token Verification Error:", error);
      return res.status(500).json({
        status: "error",
        message: "Failed to verify transaction",
        error: error.message || "Unknown error",
      });
    }
  };
  getTransactionStatusResponse(status) {
    const statusMap = {
      "0300": "Success",
      "0398": "Initiated",
      "0399": "Failed",
      "0396": "Awaited",
      "0392": "Aborted",
    };
    return statusMap[status] || "Unknown";
  }
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  isValidMobile(mobile) {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  }
  handleDownload = async (req, res) => {
    try {
      const { feeId, rollno } = req.body;
      const fileName = "Receipt-" + rollno + "-" + feeId + ".pdf";
      const fileLink = process.env.BASE_URL + "/static/" + fileName;

      res.status(200).json({ message: "Download successful", fileLink });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

export default PaymentController;
