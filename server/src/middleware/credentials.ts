import { RequestHandler } from "express";
import allowedOrigins from "../config/allowedOrigins";

const credentials: RequestHandler = (req, res, next) => {
  const { origin } = req.headers;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  }
  next();
};

export default credentials;
