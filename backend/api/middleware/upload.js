import multer from "multer";

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/files/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(
      null,
      `${new Date().toISOString().replace(/:/g, "-")}-khoamk-${
        file.originalname
      }`
    );
  },
});

const uploadFile = multer({ storage: storage, fileFilter: excelFilter });
export default uploadFile;
