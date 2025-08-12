import z from "zod";
import { FeedbackStatus } from "./enum copy";

export const SignUpSchema = z
  .object({
    username: z.string().nonempty("username is required!"),
    email: z.email(),
    password: z
      .string()
      .nonempty("password is required!")
      .min(8, "passoword must be at least of 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "password must match!",
    path: ["confirmPassword"],
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

export const FeedbackSchema = z.object({
  title: z.string().trim().nonempty("title is required!"),
  description: z.string().trim().nonempty("description is required!"),
  status: z.enum(FeedbackStatus, {
    message: "status must be either Private or Public",
  }),
  tags: z
    .array(z.string().trim())
    .min(1, "At least one tag is required")
    .max(5, "Maximum of 5 tags are allowed"),
});

export type ZFeedbackSchema = z.infer<typeof FeedbackSchema>;

export const FilterSchema = z.object({
  search: z.string().trim().optional(),
  tags: z.array(z.string()).optional(),
});

export type ZFilterSchema = z.infer<typeof FilterSchema>;

export const CommentSchema = z.object({
  content: z.string().trim().nonempty("content is required!"),
});

export type ZCommentSchema = z.infer<typeof CommentSchema>;
