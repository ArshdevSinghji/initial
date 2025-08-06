import { axiosInstance } from "@/utils/axios-instance";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface CommentPayload {
  content: string;
  userId: number;
  parentId: number;
}

export const commentThunk = createAsyncThunk(
  "feedback/commentFeedback",
  async (payload: CommentPayload, thunkAPI) => {
    try {
      const res = await axiosInstance.patch(`/comment`, payload);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch feedback"
      );
    }
  }
);
