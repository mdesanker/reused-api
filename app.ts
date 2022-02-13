import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/mongoConfig";
dotenv.config();

const app = express();

connectDB();

const PORT = (process.env.PORT as string) || 8000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
