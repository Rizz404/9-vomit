import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";

// * Konfigurasi storage untuk image dan video
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // * Menentukan folder tujuan berdasarkan field name
    if (file.fieldname === "images" || file.fieldname === "image") {
      cb(null, path.join(__dirname, "../public/assets/images"));
    } else if (file.fieldname === "video") {
      cb(null, path.join(__dirname, "../public/assets/videos"));
    } else if (file.fieldname === "profilePict") {
      cb(null, path.join(__dirname, "../public/assets/profilePict"));
    }
  },
  filename: function (req, file, cb) {
    // * Memberi nama file dengan format fieldname-timestamp.extensi
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

// * Konfigurasi filter untuk membatasi tipe file yang diterima
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  // * Jika field name adalah images, maka hanya terima file dengan mimetype image
  if (
    file.fieldname === "images" ||
    file.fieldname === "profilePict" ||
    file.fieldname === "image"
  ) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error("Only image format allowed");

      err.name = "ExtensionError";
      return cb(err);
    }
  }
  // * Jika field name adalah video, maka hanya terima file dengan mimetype video/mp4
  else if (file.fieldname === "video") {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error("Only video format allowed!");

      err.name = "ExtensionError";
      return cb(err);
    }
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 1024 * 1024 * 10 } });

export default upload;
