import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const PORT = (process.env.PORT as string) || 8000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
