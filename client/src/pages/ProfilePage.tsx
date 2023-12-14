import { useGetUserProfileQuery, useUpdateUserProfileMutation } from "../redux/api/userApiSlices";
import { useAppDispatch } from "../hooks/reduxHooks";
import { setCredentials } from "../redux/slices/authSices";
import { toast } from "react-toastify";
import { Formik, Form, FormikHelpers } from "formik";
import { userProfileSchema, UserProfileSchema } from "../schema/profileSchema";
import Dropzone from "react-dropzone";
import { Box, Button, TextField, Typography, Container, Grid } from "@mui/material";
import EditUserImage from "../components/user/EditUserImage";

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { data: user, isLoading, isError } = useGetUserProfileQuery();
  const [updateProfile] = useUpdateUserProfileMutation();

  const initialValuesUser: UserProfileSchema = {
    username: user?.username ? user.username : "",
    email: user?.email ? user.email : "",
    fullname: user?.fullname ? user.fullname : "",
  };

  const handleUpdateProfile = async (
    values: UserProfileSchema,
    { resetForm }: FormikHelpers<UserProfileSchema>
  ) => {
    try {
      // Filter out unchanged values
      const payload = Object.keys(values).reduce((acc, key) => {
        if (values[key] !== initialValuesUser[key]) {
          acc[key] = values[key];
        }

        return acc;
      }, {});

      // Call the onSubmit function with the payload

      const response = await updateProfile(payload).unwrap();

      dispatch(setCredentials({ ...response }));
      resetForm();
      toast.success("Successfully updated profile");
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  if (isLoading) return <h1>Loading</h1>;
  if (isError) return <h1>Error</h1>;
  return (
    <Container component="section" maxWidth="xl">
      <Grid container spacing={2}>
        <Grid item lg={3} md={4} display={{ xs: "none", sm: "block" }}>
          <EditUserImage />
        </Grid>
        <Grid item lg={6} xs={12}>
          <Formik
            initialValues={initialValuesUser}
            validationSchema={userProfileSchema}
            enableReinitialize
            onSubmit={handleUpdateProfile}>
            {({ values, touched, errors, handleChange, handleBlur, resetForm, setFieldValue }) => (
              <Form>
                <Box display="flex" flexDirection="column" gap={3} mt={8}>
                  {/* <Dropzone
                    accept={{ "image/*": [".png", ".jpg", ".jpeg", ".gif"] }}
                    multiple={false}
                    onDrop={(acceptedFiles) => setFieldValue("profilePict", acceptedFiles[0])}>
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border="2px dashed"
                        p={1}
                        sx={{ "&: hover": { cursor: "pointer" } }}>
                        <input {...getInputProps()} />
                        {!values.profilePict ? (
                          <p>Add picture</p>
                        ) : (
                          <Typography>{(values.profilePict as File).name}</Typography>
                        )}
                      </Box>
                    )}
                  </Dropzone> */}

                  <TextField
                    label="username"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.username && touched.username}
                    helperText={
                      (touched.username && errors.username) ||
                      (touched.username &&
                        values.username !== initialValuesUser.username &&
                        "Initial username: " + initialValuesUser.username)
                    }
                  />

                  <TextField
                    label="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.email && touched.email}
                    helperText={
                      (touched.email && errors.email) ||
                      (touched.email &&
                        values.email !== initialValuesUser.email &&
                        "Initial email: " + initialValuesUser.email)
                    }
                  />

                  <TextField
                    label="fullname"
                    name="fullname"
                    value={values.fullname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.fullname && touched.fullname}
                    helperText={
                      (touched.fullname && errors.fullname) ||
                      (touched.fullname &&
                        values.fullname !== initialValuesUser.fullname &&
                        initialValuesUser.fullname !== "" &&
                        "Initial fullname: " + initialValuesUser.fullname)
                    }
                  />

                  <Box display="flex" justifyContent="space-around">
                    <Button type="button" variant="outlined" fullWidth onClick={() => resetForm()}>
                      Reset
                    </Button>
                    <Button type="submit" variant="outlined" fullWidth>
                      Update
                    </Button>
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </Container>
  );
};
export default ProfilePage;
