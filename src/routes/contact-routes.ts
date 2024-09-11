import express from "express";

import { AuthenticateUser } from "../middleware/auth-middleware";
import { validateRequest } from "../middleware/validation";
import { contactSchema } from "../schema/auth-schema";
import { AddContanct } from "../controllers/contact-controllers";

const contactRouter = express.Router();

contactRouter.get("/health", (req, res) => {
  res.json({ mssg: "Contact routes working" });
});

contactRouter.post(
  "/add-contact",
  AuthenticateUser,
  validateRequest(contactSchema),
  AddContanct,
);

export default contactRouter;
