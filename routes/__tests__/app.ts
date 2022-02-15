import express from "express";

import authRouter from "../../routes/api/auth";
import userRouter from "../../routes/api/user";
import categoryRouter from "../../routes/api/category";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);

export = app;
