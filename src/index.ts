import express from "express";
import dotenv from "dotenv";

import authRouter from "./routes/auth-routes";
import spamRouter from "./routes/spam-routes";
import searchRouter from "./routes/search-routes";
import contactRouter from "./routes/contact-routes";

const app = express();
app.use(express.json());
dotenv.config();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ mssg: "Working" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/spam", spamRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/contact", contactRouter);

app.listen(port, () => {
  console.log(`The server is running on ${port}`);
});
