import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/mongoConfig";
dotenv.config();
import helmet from "helmet";
import compression from "compression";
import cors from "cors";

const app = express();

connectDB();

app.use(
  cors({
    origin: [/\localhost/, /\mdesanker.github.io/],
    credentials: true,
  })
);
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = (process.env.PORT as string) || 8000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
