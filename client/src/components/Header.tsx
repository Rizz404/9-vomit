import { useLogoutMutation } from "../redux/api/authApiSlices";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { removeCredentials } from "../redux/slices/authSices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import React, { MouseEvent, useState } from "react";
import AddNewPost from "./post/AddNewPost";
import { useLazySearchPostsByTitleQuery } from "../redux/api/postApiSlices";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Autocomplete,
  TextField,
} from "@mui/material";
import { Mail, Notifications, Menu as MenuIcon } from "@mui/icons-material";
import SideBar from "./SideBar";
import { useGetUserProfileQuery } from "../redux/api/userApiSlices";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { sideBar } = useAppSelector((state) => state.post);

  const [search, setSearch] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const [logout] = useLogoutMutation();
  const { data: profile, isLoading } = useGetUserProfileQuery();
  const [trigger, { data: posts }] = useLazySearchPostsByTitleQuery();

  // * Sebenarnya lebih baik mencari post berdasarkan tag daripada title
  // * tapi itu nanti aja pas refactor
  const handleSearch = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setSearch("");
      search !== "" && navigate(`/search?title=${search}`);
    } catch (error) {
      toast.error("hehe");
    }
  };

  const handleListClick = async (postId: string) => {
    try {
      navigate(`/post/${postId}`);
      setSearch("");
    } catch (error) {
      toast.error("hehe");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(removeCredentials());
      toast.success("Successfully logout");
    } catch (error) {
      toast.error("hehe");
    }
  };

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box
          component="div"
          display={{ xs: "none", sm: "flex" }}
          justifyContent="space-between"
          alignItems="center"
          gap={1}
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/home")}>
          <IconButton sx={{ color: "white" }} onClick={() => setOpenDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">HaOv</Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSearch}
          borderRadius={1}
          width="40%"
          display={{ md: "block", xs: "none" }}
          sx={{ backgroundColor: "white" }}>
          <Box
            component={Autocomplete}
            id="search-bar"
            freeSolo
            options={posts ? posts.map((post) => post.title) : []}
            onInputChange={(_event, newInputValue) => {
              trigger(newInputValue);
            }}
            disableClearable // ! agar tanda silang tidak dua kali
            fullWidth
            size="small"
            renderInput={(params) => (
              <TextField
                {...params}
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                  fullWidth: true,
                }}
              />
            )}
          />
        </Box>

        <Box display={{ md: "flex", xs: "none" }} alignItems="center" gap={2}>
          <Badge badgeContent={4} color="error">
            <Mail />
          </Badge>
          <Badge badgeContent={4} color="error">
            <Notifications />
          </Badge>
          {isLoading ? (
            <Typography>Wait</Typography>
          ) : (
            <IconButton onClick={handleClick}>
              <Avatar
                src={profile && `http://localhost:5000/assets/profilePict/${profile?.profilePict}`}
                sx={{ width: 30, height: 30 }}
              />
            </IconButton>
          )}
        </Box>

        <Box display={{ sm: "none", xs: "flex" }} alignItems="center" gap={1}>
          {isLoading ? (
            <Typography>Wait</Typography>
          ) : (
            <IconButton onClick={handleClick}>
              <Avatar
                src={profile && `http://localhost:5000/assets/profilePict/${profile?.profilePict}`}
                sx={{ width: 30, height: 30 }}
              />
            </IconButton>
          )}
          <Typography variant="h6">Rizz</Typography>
        </Box>

        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}>
          <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
          <MenuItem>Account</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
      <SideBar openDrawer={openDrawer} setOpenDrawer={() => setOpenDrawer(false)} />
    </AppBar>
  );
};

export default Header;
