import * as yup from "yup";

export const commentSchema = yup.object().shape({
  content: yup.string().max(1001, "Too much to say"),
  image: yup
    .mixed()
    // ? hanya dijalankan kalau ada karena memakai ! tapi kenapa yang lain tetap bisa? apakah karena react dropzone
    .test("fileSize", "File terlalu besar", (value) => !value || (value as File).size <= 5000000)
    .test(
      "fileType",
      "Format tidak didukung",
      (value) => !value || ["image/jpg", "image/jpeg", "image/png"].includes((value as File).type)
    ),
});

export type CommentSchema = yup.InferType<typeof commentSchema>;
