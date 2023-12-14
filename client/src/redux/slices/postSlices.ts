import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// State type
interface PostState {
  imagePost: { [key: string]: number };
  sideBar: boolean;
}

// Action payload types
interface SetImagePostIndexPayload {
  postId: string;
  index: number;
}

interface SetSidebarPayload {
  sideBar: boolean;
}

// Action types
type PostActionTypes = {
  setImagePostIndex: (payload: SetImagePostIndexPayload) => void;
  setSidebar: (payload: SetSidebarPayload) => void;
  openSidebar: () => void;
  closeSidebar: () => void;
};

// Initial state
const initialState: PostState = {
  imagePost: {},
  sideBar: false,
};

// Create slice
const postSlices = createSlice({
  name: "post",
  initialState,
  reducers: {
    setImagePostIndex: (state, action: PayloadAction<SetImagePostIndexPayload>) => {
      state.imagePost[action.payload.postId] = action.payload.index;
    },
    setSidebar: (state, action: PayloadAction<SetSidebarPayload>) => {
      state.sideBar = action.payload.sideBar;
    },
    openSidebar: (state) => {
      state.sideBar = true;
    },
    closeSidebar: (state) => {
      state.sideBar = false;
    },
  },
});

// Export actions
export const { setImagePostIndex, setSidebar, openSidebar, closeSidebar } = postSlices.actions;

// Export reducer
export default postSlices.reducer;
