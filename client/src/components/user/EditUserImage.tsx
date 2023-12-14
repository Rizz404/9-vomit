import {
  Avatar,
  Box,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import Dropzone from "react-dropzone";
import { useGetUserProfileQuery } from "../../redux/api/userApiSlices";
import { FaUserAltSlash, FaUserFriends } from "react-icons/fa";
import { PostAdd } from "@mui/icons-material";
import { useGetPostsByCategoryQuery } from "../../redux/api/postApiSlices";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const EditUserImage = () => {
  const [showSubmit, setShowSubmit] = useState(false);
  const navigate = useNavigate();
  const { data: user } = useGetUserProfileQuery();
  const { data: posts } = useGetPostsByCategoryQuery({ category: "self" });

  return (
    <Box p={2} display="flex" flexDirection="column" gap={1}>
      <Box display="flex" justifyContent="center" alignItems="center" p={1}>
        {user?.profilePict ? (
          <Avatar
            sx={{ cursor: "pointer", width: 150, height: 150 }}
            src={`http://localhost:5000/assets/profilePict/${user.profilePict}`}
            alt={user.username}
          />
        ) : (
          <Avatar sx={{ cursor: "pointer", width: 150, height: 150 }}>
            {user?.username.split("")[0]}
          </Avatar>
        )}
      </Box>
      <Box>
        <Formik
          initialValues={{ profilePict: "" }}
          onSubmit={() => console.log("hehe")}
          enableReinitialize>
          {({ values, touched, errors, handleChange, handleBlur, resetForm, setFieldValue }) => (
            <Form>
              <Dropzone
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
                      <Typography align="center">Change picture</Typography>
                    ) : (
                      <>
                        {setShowSubmit(true)}
                        <Typography align="center">
                          {(values.profilePict as unknown as File).name}
                        </Typography>
                      </>
                    )}
                  </Box>
                )}
              </Dropzone>

              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                sx={{ mt: 1, display: showSubmit === false ? "none" : "block" }}>
                hehe
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
      <Box>
        <List>
          <ListItemButton>
            <ListItemIcon>
              <FaUserFriends />
            </ListItemIcon>
            <ListItemText
              primary={`Follower ${user?.following?.length}`}
              secondary={user?.following?.length === 0 && "Follow some people"}
            />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <FaUserAltSlash />
            </ListItemIcon>
            <ListItemText
              primary={`Following ${user?.following?.length}`}
              secondary={user?.following?.length === 0 && "Follow some people"}
            />
          </ListItemButton>
          <ListItemButton onClick={() => navigate("/self")}>
            <ListItemIcon>
              <PostAdd />
            </ListItemIcon>
            <ListItemText
              primary={`Posted ${posts?.length}`}
              secondary={posts?.length === 0 ? "Post something" : "Click to see post"}
            />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );
};
export default EditUserImage;
