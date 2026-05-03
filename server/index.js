import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "CORS working fine ✅" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});