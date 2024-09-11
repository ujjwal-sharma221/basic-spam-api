import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "../prisma";
import { LoginType, SignUpType } from "../schema/auth-schema";

export const SignUp = async (
  req: Request<{}, {}, SignUpType>,
  res: Response,
) => {
  const { name, phoneNumber, password, email } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber },
    });
    if (existingUser)
      return res.status(400).json({
        message:
          "Phone number already registered, please try again with a different number",
      });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        phoneNumber,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Error creating user", error });
  }
};

export const Login = async (req: Request<{}, {}, LoginType>, res: Response) => {
  try {
    const { phoneNumber, password } = req.body;
    const user = await prisma.user.findUnique({ where: { phoneNumber } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || ("secret" as string),
    );

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error logging in", error });
  }
};
