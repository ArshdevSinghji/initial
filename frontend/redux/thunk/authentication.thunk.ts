import { axiosInstance } from "@/utils/axios-instance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  SignInPayloadInterface,
  SignUpPayloadInterface,
} from "../payload.interface";

export const signInThunk = createAsyncThunk(
  "signInThunk",
  async (signInPayload: SignInPayloadInterface, thunkAPI) => {
    try {
      const res = await axiosInstance.post("auth/signIn", signInPayload);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Sign in failed");
    }
  }
);

export const signUpThunk = createAsyncThunk(
  "signUpThunk",
  async (signUpPayload: SignUpPayloadInterface, thunkAPI) => {
    try {
      const res = await axiosInstance.post("auth/signUp", signUpPayload);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Sign up failed");
    }
  }
);
