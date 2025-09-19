import express from "express";
import multer from "multer";
import faceRouter from "./routes/face";

const app = express();

app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter:(req:Express.Request, file:Express.Multer.File, cb:multer.FileFilterCallback) =>{
    const allowed = ["image/jpeg", "image/jpg", "image/png" ];
    if(allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, JPEG and PNG files are allowed."))
  }
});

app.use('/verify-faces', faceRouter(upload));
app.use("/ping", (req, res)=>res.send("PONG"));
export default app;