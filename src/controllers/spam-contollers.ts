import express, { Request, Response } from "express";

import { SpamSchemaType } from "../schema/spam-schema";
import prisma from "../prisma";

export const MarkSpam = async (
  req: Request<{}, {}, SpamSchemaType>,
  res: Response,
) => {
  const { phoneNumber } = req.body;

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const existingEntry = await prisma.spam.findFirst({
      where: {
        phoneNumber,
        markedByUserId: Number(userId),
      },
    });

    if (existingEntry) {
      return res
        .status(400)
        .json({ message: "You have already marked this number as spam" });
    }

    const spam = await prisma.spam.create({
      data: {
        phoneNumber,
        markedByUserId: Number(userId),
        markedCount: 1,
      },
    });

    return res
      .status(201)
      .json({ message: "Number marked as spam successfully", spam });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error marking number as spam" });
  }
};
