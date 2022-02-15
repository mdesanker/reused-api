import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/mongoConfig";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";

import authRouter from "./routes/api/auth";
import userRouter from "./routes/api/user";
import categoryRouter from "./routes/api/category";

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

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);

const PORT = (process.env.PORT as string) || 8000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
