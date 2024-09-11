import express, { Request, Response } from "express";
import { z } from "zod";

import { ContactType } from "../schema/auth-schema";
import prisma from "../prisma";

export const AddContanct = async (
  req: Request<{}, {}, ContactType>,
  res: Response,
) => {
  const { name, phoneNumber } = req.body;
  try {
    const userId = req.user?.id;
    const existingContact = await prisma.contact.findFirst({
      where: {
        phoneNumber,
        userId: Number(userId),
      },
    });

    if (existingContact) {
      return res
        .status(400)
        .json({ message: "Contact with this phone number already exists" });
    }

    const newContact = await prisma.contact.create({
      data: {
        name,
        phoneNumber,
        userId: Number(userId),
      },
    });

    res.status(201).json(newContact);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Invalid data", errors: error.errors });
    }

    console.error("Error adding contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
