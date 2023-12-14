import { useEffect } from "react";
import { useAppSelector } from "../hooks/reduxHooks";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../redux/api/authApiSlices";
import { Formik } from "formik";
import { registerSchema, RegisterSchema } from "../schema/authSchema";
import { useLazySearchUserQuery } from "../redux/api/userApiSlices";
import { Box, Button, Container, Grid, TextField, Typography } from "@mui/material";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useAppSelector((state) => state.auth);
  const [register] = useRegisterMutation();
  const [triggerUsername, { data: userUsername }] = useLazySearchUserQuery();
  const [triggerEmail, { data: userEmail }] = useLazySearchUserQuery();

  const onSubmit = async (values: RegisterSchema) => {
    try {
      await register(values).unwrap();
      toast.success("Registration successful");
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed");
    }
  };

  const registerValues: RegisterSchema = {
    username: "",
    email: "",
    password: "",
    cpPassword: "",
  };

  useEffect(() => {
    if (userInfo) return navigate("/home");
  }, [navigate, userInfo]);

  return (
    <Formik initialValues={registerValues} validationSchema={registerSchema} onSubmit={onSubmit}>
      {({ errors, touched, values, handleChange, handleBlur, handleSubmit }) => (
        <Container component="main" maxWidth="xs">
          <Box mt={8} display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h5" fontWeight={500}>
              Sign up
            </Typography>
            <Box component="form" onSubmit={handleSubmit} mt={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Username"
                    name="username"
                    value={values.username}
                    onChange={(e) => {
                      handleChange(e);
                      e.target.value && triggerUsername({ by: "username", query: e.target.value });
                    }}
                    onBlur={handleBlur}
                    error={Boolean(touched.username) && Boolean(errors.username)}
                    helperText={
                      (touched.username && errors.username) ||
                      (touched.username &&
                        values.username.toLowerCase().trim() ===
                          userUsername?.username.toLowerCase().trim() &&
                        "username already exist")
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="email"
                    value={values.email}
                    onChange={(e) => {
                      handleChange(e);
                      e.target.value && triggerEmail({ by: "email", query: e.target.value });
                    }}
                    onBlur={handleBlur}
                    error={Boolean(touched.email) && Boolean(errors.email)}
                    helperText={
                      (touched.email && errors.email) ||
                      (touched.email &&
                        values.email.toLowerCase().trim() ===
                          userEmail?.email.toLowerCase().trim() &&
                        "email already exist")
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type="password"
                    label="Password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.password) && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    fullWidth
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type="password"
                    label="Confirm Password"
                    name="cpPassword"
                    value={values.cpPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.cpPassword) && Boolean(errors.cpPassword)}
                    helperText={touched.cpPassword && errors.cpPassword}
                    fullWidth
                    autoComplete="off"
                  />
                </Grid>
              </Grid>
              <Button fullWidth type="submit" variant="contained" sx={{ mb: 3, mt: 2 }}>
                Register
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Typography>
                    Don't have an account? <Link to="/login">Sign in</Link>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      )}
    </Formik>
  );
};
export default RegisterPage;
