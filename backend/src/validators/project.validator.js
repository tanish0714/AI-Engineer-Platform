import { z } from "zod";

/* -------------------- Create Project -------------------- */

export const createProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Project title must be at least 3 characters")
    .max(100, "Project title cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional()
    .default(""),

  visibility: z
    .enum(["private", "public"])
    .default("private"),
});

/* -------------------- Update Project -------------------- */

export const updateProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3)
    .max(100)
    .optional(),

  description: z
    .string()
    .trim()
    .max(1000)
    .optional(),

  visibility: z
    .enum(["private", "public"])
    .optional(),

  status: z
    .enum(["active", "archived"])
    .optional(),
});