import express from "express";
import authRouter from "../../routes/api/auth";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);

export default app;
