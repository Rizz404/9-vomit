import * as yup from "yup";

export const postSchema = yup.object().shape({
  title: yup.string().required("Required"),
  description: yup.string().max(255, "Maximum 255 characters"),
  tags: yup.string().required("Required"),
  images: yup.array().of(
    yup
      .mixed()
      .test("fileSize", "File terlalu besar", (value) => value && (value as File).size <= 10485760)
      .test(
        "fileType",
        "Format tidak didukung",
        (value) => value && ["image/jpg", "image/jpeg", "image/png"].includes((value as File).type)
      )
  ),
});

export type PostSchema = yup.InferType<typeof postSchema>;
