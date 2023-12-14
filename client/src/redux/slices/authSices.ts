import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  userInfo: null,
};

const authSlices = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state: AuthState, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    removeCredentials: (state: AuthState) => {
      state.userInfo = null;
    },
  },
});

export const { setCredentials, removeCredentials } = authSlices.actions;
export default authSlices.reducer;
