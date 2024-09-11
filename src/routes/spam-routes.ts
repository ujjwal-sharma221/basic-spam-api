import express from "express";

import { validateRequest } from "../middleware/validation";
import { markSpamSchema } from "../schema/spam-schema";
import { MarkSpam } from "../controllers/spam-contollers";
import { AuthenticateUser } from "../middleware/auth-middleware";

const spamRouter = express.Router();

spamRouter.get("/health", (req, res) => {
  res.json({ mssg: "Spam routes working" });
});

spamRouter.post(
  "/mark",
  AuthenticateUser,
  validateRequest(markSpamSchema),
  MarkSpam,
);

export default spamRouter;
