import express from "express";

import authRouter from "../../routes/api/auth";
import userRouter from "../../routes/api/user";
import categoryRouter from "../../routes/api/category";
import productRouter from "../../routes/api/product";
import cartRouter from "../../routes/api/cart";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);

export = app;
