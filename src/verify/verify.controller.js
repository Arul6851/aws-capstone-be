import crypto from "crypto";

class verifyController {
  verifyToken = async (req, res) => {
    try {
      const {
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
        hash,
      } = req.body;

      const SALT = process.env.MERCHANT_SALT;

      const dataToHash = `${txn_status}|${txn_msg}|${txn_err_msg}|${clnt_txn_ref}|${tpsl_bank_cd}|${tpsl_txn_id}|${txn_amt}|${clnt_rqst_meta}|${tpsl_txn_time}|${bal_amt}|${card_id}|${alias_name}|${BankTransactionID}|${mandate_reg_no}|${token}|${SALT}`;

      const calculatedHash = crypto
        .createHash("sha512")
        .update(dataToHash)
        .digest("hex");

      if (calculatedHash === hash) {
        res.json({
          status: "success",
          message: "Transaction verified successfully",
        });
      } else {
        res.json({
          status: "failure",
          message: "Hash mismatch, verification failed",
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
}
export default verifyController;
