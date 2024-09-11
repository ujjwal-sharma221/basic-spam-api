import express, { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validateRequest =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: "Invalid fields" });
    }
  };
