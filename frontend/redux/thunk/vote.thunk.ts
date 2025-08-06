import { axiosInstance } from "@/utils/axios-instance";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface VotePayload {
  userId: number;
  feedbackId: number;
}

export const voteThunk = createAsyncThunk(
  "feedback/voteFeedback",
  async (payload: VotePayload, thunkAPI) => {
    try {
      const res = await axiosInstance.patch(`/vote`, payload);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch feedback"
      );
    }
  }
);
