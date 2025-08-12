import { axiosInstance } from "@/utils/axios-instance";
import { FeedbackStatus } from "@/utils/enum";
import { createAsyncThunk } from "@reduxjs/toolkit";
import qs from "qs";

export const findFeedbacks = createAsyncThunk(
  "feedback/findFeedbacks",
  async (
    query: {
      search?: string;
      tags?: string[];
      author?: string[];
      score?: "ASC" | "DESC";
      feedbackId?: number;
      limit?: number;
      page?: number;
    },
    thunkAPI
  ) => {
    try {
      const res = await axiosInstance.get(`feedback`, {
        params: {
          search: query.search,
          tags: query.tags,
          author: query.author,
          score: query.score,
          feedbackId: query.feedbackId,
          limit: query.limit || 10,
          page: query.page || 1,
        },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch feedback"
      );
    }
  }
);

interface FeedbackPayload {
  title: string;
  description: string;
  status: FeedbackStatus;
  authorId: number;
  tags: string[];
}

export const createFeedbackThunk = createAsyncThunk(
  "feedback/createFeedback",
  async (data: FeedbackPayload, thunkAPI) => {
    try {
      const res = await axiosInstance.post("feedback", data);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create feedback"
      );
    }
  }
);

export const updateStatus = createAsyncThunk(
  "feedback/updateStatus",
  async (id: number, thunkAPI) => {
    try {
      const res = await axiosInstance.patch(`feedback/${id}/status`);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update feedback status"
      );
    }
  }
);
