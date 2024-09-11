import { Request, Response } from "express";
import { z } from "zod";

import {
  searchNumberSchema,
  searchNameSchema,
  searchSchema,
} from "../schema/search-schema";
import prisma from "../prisma";
import { CalculateSpam } from "../lib/utils";

export const SearchByName = async (
  req: Request<{}, {}, { query: string }>,
  res: Response,
) => {
  const { query } = req.query;

  try {
    const parsedQuery = searchNameSchema.parse({ query });
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: parsedQuery.query,
          mode: "insensitive",
        },
      },
    });

    const sortedUsers = users.sort((a, b) => {
      const aStartsWith = a.name
        .toLowerCase()
        .startsWith(parsedQuery.query.toLowerCase());
      const bStartsWith = b.name
        .toLowerCase()
        .startsWith(parsedQuery.query.toLowerCase());

      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return 0;
    });

    const results = await Promise.all(
      sortedUsers.map(async (user) => {
        const spamResult = await CalculateSpam(user.phoneNumber);
        return {
          name: user.name,
          phoneNumber: user.phoneNumber,
          spamLikelihood: spamResult.spamLikelihood,
        };
      }),
    );

    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error searching for users" });
  }
};

export const SearchByNumber = async (
  req: Request<{}, {}, {}, { phoneNumber: string }>,
  res: Response,
) => {
  const { phoneNumber } = req.query;

  try {
    searchNumberSchema.parse({ phoneNumber });
    const registeredUser = await prisma.user.findUnique({
      where: { phoneNumber },
      select: {
        name: true,
        phoneNumber: true,
        email: true,
        createdAt: true,
      },
    });

    if (registeredUser) {
      return res.json({
        name: registeredUser.name,
        phoneNumber: registeredUser.phoneNumber,
        email: registeredUser.email,
        isRegisteredUser: true,
      });
    }

    const contacts = await prisma.contact.findMany({
      where: { phoneNumber },
      select: {
        name: true,
        phoneNumber: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (contacts.length === 0) {
      return res
        .status(404)
        .json({ message: "No results found for this phone number." });
    }

    const contactResults = contacts.map((contact) => ({
      contactName: contact.name,
      addedByUser: contact.user.name,
      phoneNumber: contact.phoneNumber,
      isRegisteredUser: false,
    }));

    return res.json(contactResults);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Invalid data", errors: error.errors });
    }

    console.error("Error while finding contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const Search = async (
  req: Request<{}, {}, {}, { phoneNumber?: string; name?: string }>,
  res: Response,
) => {
  const { phoneNumber, name } = req.query;
  const currentUserId = req.user?.id;
  try {
    searchSchema.parse({ phoneNumber, name });
    let user;
    if (phoneNumber) {
      user = await prisma.user.findUnique({
        where: { phoneNumber },
        include: {
          contacts: true,
        },
      });
    } else if (name) {
      user = await prisma.user.findFirst({
        where: { name },
        include: {
          contacts: true,
        },
      });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const isInContactList = user.contacts.some(
      (contact) => Number(contact.userId) === Number(currentUserId),
    );

    const spamLikelihood = await CalculateSpam(user.phoneNumber);
    return res.json({
      name: user.name,
      phoneNumber: user.phoneNumber,
      spamLikelihood,
      email: isInContactList ? user.email : "Email not available",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Invalid data", errors: error.errors });
    }

    console.error("Error while fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
