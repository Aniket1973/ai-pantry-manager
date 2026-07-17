import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const pantryItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.coerce.number().int().min(0, "Quantity must be a positive integer"),
  unit: z.string().min(1, "Unit is required"),
  category: z.string().min(1, "Category is required"),
  expiryDate: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Expiry date must be a valid date",
  }),
});

export const recipePromptSchema = z.object({
  items: z.array(z.string()).min(1, "At least one pantry item is required"),
});
