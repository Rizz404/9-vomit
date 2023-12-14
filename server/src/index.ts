import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import "dotenv/config";
import authRoutes from "./routes/authRoutes";
import logger from "./middleware/logger";
import corsOptions from "./middleware/corsConfig";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import adminRoutes from "./routes/adminRoutes";
import commentRoutes from "./routes/commentRoutes";
import tagRoutes from "./routes/tagRoutes";
import credentials from "./middleware/credentials";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;

// * Middleware configuration
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());
app.use(credentials);
app.use(cors(corsOptions));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // ! buat image harus begini
app.use(morgan("dev"));
app.use(morgan("combined", { stream: logger }));
app.use("/assets", express.static(path.join(__dirname, "./public/assets")));

// * Routes
app.use("/auth", authRoutes);
app.use("/admins", adminRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/tags", tagRoutes);

// * Server configuration
mongoose
  .connect(process.env.DB_URI)
  .then(() => app.listen(PORT, () => console.log(`Server run on port ${PORT}`)))
  .catch((error) => console.log(error));
