import { createSlice } from "@reduxjs/toolkit";
import { findUserThunk } from "../thunk/user.thunk";

export interface User {
  id: number;
  username: string;
  email: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(findUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(findUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      });
  },
});

export default userSlice.reducer;
