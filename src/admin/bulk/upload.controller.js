import multer from "multer";
import path from "path";

class UploadController {
  storage = multer.diskStorage({
    destination: "./public/files/",
    filename: (req, file, cb) => {
      cb(null, "File-" + Date.now() + path.extname(file.originalname));
    },
  });

  uploader = multer({
    storage: this.storage,
    limits: { fileSize: 100000000 },
  }).single("myFile");

  uploadHandler = async (req, res, next) => {
    try {
      this.uploader(req, res, async (err) => {
        if (err) {
          res.status(400).json({
            message: "Error uploading file",
            error: await err,
          });
        } else {
          res.locals.file = req.file;
          next();
        }
      });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", code: 500 });
    }
  };
}

export default UploadController;
