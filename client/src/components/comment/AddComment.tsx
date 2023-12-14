import { useCreateCommentMutation } from "../../redux/api/commentApiSlices";
import { Formik, Form, FormikHelpers } from "formik";
import { CommentSchema, commentSchema } from "../../schema/commentSchema";
import { toast } from "react-toastify";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { Photo } from "@mui/icons-material";

interface AddCommentProps {
  postId: string;
  commentId?: string;
}
const AddComment = ({ postId, commentId }: AddCommentProps) => {
  const [createComment] = useCreateCommentMutation();
  const [openField, setOpenField] = useState(false);

  const intialValues: CommentSchema = {
    content: "",
    image: "",
  };

  const onSubmit = async (
    values: CommentSchema,
    { resetForm, setSubmitting }: FormikHelpers<CommentSchema>
  ) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let commentData: any = {
        postId,
        content: values.content,
      };

      //  *Cek keberadaan image sebelum menambahkannya ke objek commentData
      if (values.image) {
        commentData = {
          ...commentData,
          image: values.image,
        };
      }

      // * Panggil createComment dengan nilai dari form
      if (commentId !== "") {
        commentData._id = commentId;
      }

      await createComment(commentData).unwrap();

      setSubmitting(false);
      resetForm({ values: intialValues });
      setOpenField(false);
    } catch (error) {
      toast.error("Ada masalah saat menambahkan komentar");
    }
  };

  return (
    <Box mb={2}>
      <Formik initialValues={intialValues} onSubmit={onSubmit} validationSchema={commentSchema}>
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          resetForm,
          setFieldValue,
          isSubmitting,
        }) => (
          <Form>
            <TextField
              label="comment"
              name="content"
              onClick={() => setOpenField(true)}
              value={values.content}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.content && touched.content}
              placeholder="add comment"
              autoFocus={openField === true}
              helperText={touched.content && errors.content}
              multiline={openField}
              fullWidth
            />
            <Box display={openField === false ? "none" : "block"}>
              <Dropzone
                accept={{
                  "image/*": [".png", ".jpg", ".jpeg", ".gif"],
                }}
                onDrop={(acceptedFiles) => setFieldValue("image", acceptedFiles[0])}
                multiple={false}>
                {({ getRootProps, getInputProps }) => (
                  <>
                    <div
                      {...getRootProps()}
                      className="btn btn-secondary btn-sm"
                      style={{ cursor: "pointer" }}>
                      <input {...getInputProps()} />
                    </div>
                    <Box component="div" display="flex" alignItems="center" gap={1}>
                      <IconButton>
                        <Photo />
                      </IconButton>
                      <Typography>
                        {values.image ? (values.image as File).name : "Add image"}
                      </Typography>
                    </Box>
                  </>
                )}
              </Dropzone>

              <Box display="flex" justifyContent="end" gap={1}>
                <Button
                  variant="outlined"
                  type="button"
                  onClick={() => {
                    setOpenField(false);
                    resetForm();
                  }}>
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  type="submit"
                  disabled={values.content === "" || isSubmitting}>
                  Submit
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
export default AddComment;
