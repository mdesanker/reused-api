import express from "express";
import authRouter from "../../routes/api/auth";
import userRouter from "../../routes/api/user";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use("/user", userRouter);

export = app;
