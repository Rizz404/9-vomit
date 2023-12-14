import * as yup from "yup";

export const userProfileSchema = yup.object().shape({
  username: yup.string().max(25, "Username too long").required("Required"),
  email: yup.string().email("Please enter a valid email").required("Required"),
  fullname: yup.string().min(5, "Fullname too sort"),
  // profilePict: yup
  //   .mixed()
  //   .test("fileSize", "File terlalu besar", (value) => value && (value as File).size <= 10485760)
  //   .test(
  //     "fileType",
  //     "Format tidak didukung",
  //     (value) => value && ["image/jpg", "image/jpeg", "image/png"].includes((value as File).type)
  //   ),
});

export type UserProfileSchema = yup.InferType<typeof userProfileSchema>;
