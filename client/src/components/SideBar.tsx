import { Home, GraphicEq, Watch, ChevronLeft, Add } from "@mui/icons-material";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Typography,
  ListItemButton,
} from "@mui/material";
import AddNewPost from "./post/AddNewPost";
import { useState } from "react";

interface SidebarProps {
  openDrawer: boolean;
  setOpenDrawer: (value: boolean) => void;
}

const SideBar = ({ openDrawer, setOpenDrawer }: SidebarProps) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Drawer
        anchor="left"
        variant="persistent"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}>
        <List>
          <ListItemButton>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
              <ListItemText primary="Home" />
              <Typography>40k</Typography>
            </Box>
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <GraphicEq />
            </ListItemIcon>
            <ListItemText primary="Top" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <Watch />
            </ListItemIcon>
            <ListItemText primary="Fresh" />
          </ListItemButton>
          <ListItemButton onClick={() => setOpenModal(true)}>
            <ListItemIcon>
              <Add />
            </ListItemIcon>
            <ListItemText primary="Post" />
          </ListItemButton>
        </List>
      </Drawer>

      <AddNewPost openModal={openModal} setOpenModal={setOpenModal} />
    </>
  );
};
export default SideBar;
