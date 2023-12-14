import * as yup from "yup";
// import { z } from "zod";

export const registerSchema = yup.object().shape({
  username: yup.string().min(3, "Username too sort").required("Required"),
  email: yup.string().email("Please enter a valid email").required("Required"),
  password: yup.string().min(5, "Password to sort").required("Required"),
  cpPassword: yup
    .string()
    .oneOf([yup.ref("password"), ""], "Password must match")
    .required("Required"),
});

export type RegisterSchema = yup.InferType<typeof registerSchema>;

export const loginSchema = yup.object().shape({
  // username: yup.string().required("Required"),
  email: yup.string().email("Please enter a valid email").required("Required"),
  password: yup.string().required("Required"),
});

export type LoginSchema = yup.InferType<typeof loginSchema>;

// export const zodAuthSchema = z
//   .object({
//     username: z.string().min(3, "Username is to sort"),
//     email: z.string().email("Email is not valid"),
//     password: z.string().min(5, "Password is too sort"),
//     cpPassword: z.string(),
//   })
//   .refine((data) => data.password === data.cpPassword, {
//     message: "Password does not match",
//     path: ["cpPassword"],
//   });

// type zodAuthSchema = z.infer<typeof zodAuthSchema>;
