import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setCredentials } from "../redux/slices/authSices";
import { useLoginMutation } from "../redux/api/authApiSlices";
import { Formik } from "formik";
import { loginSchema, LoginSchema } from "../schema/authSchema";
import { Button, TextField, Typography, Box, Container, Grid } from "@mui/material";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const { userInfo } = useAppSelector((state) => state.auth);

  const onSubmit = async (values: LoginSchema) => {
    try {
      const response = await login(values).unwrap();

      dispatch(setCredentials({ ...response }));
      navigate("/home");
      toast.success("Successfully Login");
    } catch (error) {
      toast.error("Login failed");
    }
  };

  const initialValuesLogin: LoginSchema = {
    email: "",
    password: "",
  };

  useEffect(() => {
    if (userInfo) return navigate("/home");
  }, [navigate, userInfo]);

  return (
    <Formik initialValues={initialValuesLogin} validationSchema={loginSchema} onSubmit={onSubmit}>
      {({ values, touched, errors, handleChange, handleBlur, handleSubmit }) => (
        <Container component="main" maxWidth="xs">
          <Box mt={8} display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h5" fontWeight={500}>
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} mt={3}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.email) && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password"
                    type="password"
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
              </Grid>
              <Button fullWidth type="submit" variant="contained" sx={{ mb: 3, mt: 2 }}>
                Login
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Typography>
                    Don't have an account? <Link to="/register">Sign up</Link>
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
export default LoginPage;
