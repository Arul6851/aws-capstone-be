class DownloadController {
  downloadReceipt = async (req, res) => {
    try {
      const { feeId, rollno } = req.body;
      console.log(feeId, rollno);
      const fileName = "Receipt-" + rollno + "-" + feeId + ".pdf";
      const fileLink = process.env.BASE_URL + "/static/" + fileName;

      res.status(200).json({ message: "Download successful", fileLink });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

export default DownloadController;
