import { useCreatePostMutation } from "../../redux/api/postApiSlices";
import { Formik, Form, FormikHelpers } from "formik";
import { toast } from "react-toastify";
import { PostSchema, postSchema } from "../../schema/postSchema";
import Dropzone from "react-dropzone";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

interface AddNewPostProps {
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
}

const AddNewPost = ({ openModal, setOpenModal }: AddNewPostProps) => {
  const [createPost] = useCreatePostMutation();

  const initialValues: PostSchema = {
    title: "",
    description: "",
    tags: "",
    images: [],
  };

  const onSubmit = async (values: PostSchema, { resetForm }: FormikHelpers<PostSchema>) => {
    try {
      await createPost(values as unknown as Post).unwrap();
      setOpenModal(false);
      resetForm();
      toast.success("Successfully added a new post");
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={postSchema} onSubmit={onSubmit}>
      {({ values, errors, touched, handleBlur, handleChange, resetForm, setFieldValue }) => (
        <Dialog
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            resetForm();
          }}>
          <Form>
            <DialogTitle>Create Post</DialogTitle>
            <DialogContent>
              <TextField
                label="title"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.title && touched.title}
                helperText={touched.title && errors.title}
                fullWidth
                margin="normal"
                placeholder="Add title"
              />

              <TextField
                label="tags"
                name="tags"
                value={values.tags}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.tags && touched.tags}
                helperText={touched.tags && errors.tags}
                fullWidth
                margin="normal"
                placeholder="Add some tags seperated with coma"
              />

              <TextField
                label="description"
                name="description"
                multiline
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.description && touched.description}
                helperText={touched.description && errors.description}
                fullWidth
                margin="normal"
                placeholder="Add description"
              />

              <Dropzone
                accept={{
                  "image/*": [".png", ".jpg", ".jpeg", ".gif"],
                }}
                onDrop={(acceptedFiles) => setFieldValue("images", acceptedFiles)}
                multiple
                maxFiles={7}>
                {({ getRootProps, getInputProps }) => (
                  <Box
                    p={1}
                    border="2px dashed gray"
                    {...getRootProps()}
                    style={{ cursor: "pointer" }}>
                    <input {...getInputProps()} />
                    {!values.images?.length ? (
                      <Typography>Drag and drop image here</Typography>
                    ) : (
                      values.images.map((image, index) => (
                        <Typography key={index}>{(image as File).name}, </Typography>
                      ))
                    )}
                  </Box>
                )}
              </Dropzone>
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                onClick={() => {
                  setOpenModal(false);
                  resetForm();
                }}>
                Close
              </Button>
              <Button variant="outlined" type="submit">
                Post
              </Button>
            </DialogActions>
          </Form>
        </Dialog>
      )}
    </Formik>
  );
};
export default AddNewPost;
