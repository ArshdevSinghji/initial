import z from "zod";
import { RecipeCategory } from "./enum";

export const SignUpSchema = z.object({
  username: z.string().nonempty("username is required!"),
  email: z.email("invalid email address!"),
  password: z
    .string()
    .nonempty("password is required!")
    .min(8, "password must be at least of 8 characters"),
});

export type ZSignUpSchema = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.email("invalid email address!"),
  password: z
    .string()
    .nonempty("password is required!")
    .min(8, "password must be at least of 8 characters"),
});

export type ZSignInSchema = z.infer<typeof SignInSchema>;
