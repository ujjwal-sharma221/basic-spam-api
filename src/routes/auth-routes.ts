import express from "express";

import { loginSchema, signupSchema } from "../schema/auth-schema";
import { Login, SignUp } from "../controllers/auth-controllers";
import { validateRequest } from "../middleware/validation";

const authRouter = express.Router();

authRouter.get("/health", (req, res) => {
  res.json({ mssg: "Auth routes working" });
});

authRouter.post("/signup", validateRequest(signupSchema), SignUp);
authRouter.post("/login", validateRequest(loginSchema), Login);

export default authRouter;
