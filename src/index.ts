// Imports
import * as dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
import cors from "cors";
import userRouter from "./routes/userRouter";
import mongoose from "mongoose";

const app: Application = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3001;

// Middleware
app.use(cors());
app.use(express.json());
// Middleware for global error handling
app.use((err: any, _req: Request, res: Response, next: Function) => {
  if (!err) return next();
  res.status(500).send("Server error");
});

// Connect to MongoDB
if (!process.env.MONGODB_URI) throw '"MONGODB_URI" not found in process.env';
mongoose.connect(process.env.MONGODB_URI, (err) => {
  if (err) throw err;
  console.log("Connected to MongoDB");
});

// Routes
app.use("/", userRouter);

// Start server
app.listen(port, () => {
  console.log("Server started");
});
