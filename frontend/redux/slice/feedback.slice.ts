import { createSlice } from "@reduxjs/toolkit";
import {
  createFeedbackThunk,
  findFeedbacks,
  updateStatus,
} from "../thunk/feedback.thunk";
import { FeedbackStatus, VoteType } from "@/utils/enum";
import { voteThunk } from "../thunk/vote.thunk";
import { commentThunk } from "../thunk/comment.thunk";

interface Author {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  isDisabled: boolean;
}

interface Replies {
  id: number;
  content: string;
  author: Author;
}

interface Comment {
  id: number;
  author: Author;
  feedback: Feedback;
  replies: Replies[];
  content: string;
  authorId: number;
}

interface Vote {
  id: number;
  type: VoteType;
  user: Author;
}

interface Tag {
  id: number;
  name: string;
}

interface Feedback {
  author: Author;
  id: number;
  title: string;
  description: string;
  status: FeedbackStatus;
  tags: Tag[];
  isHidden: boolean;
  comments: Comment[];
  votes: Vote[];
}

interface FeedbackState {
  count: number;
  feedbacks: Feedback[];
  isLoading: boolean;
}

const initialState: FeedbackState = {
  count: 0,
  feedbacks: [],
  isLoading: false,
};

const feedbackSlice = createSlice({
  name: "feedbackSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(findFeedbacks.fulfilled, (state, action) => {
        state.count = action.payload.count;
        state.feedbacks = action.payload.feedbacks;
        state.isLoading = false;
      })
      .addCase(findFeedbacks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(findFeedbacks.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(voteThunk.fulfilled, (state, action) => {
        const { feedbackId, userId, type } = action.payload;
        const feedback = state.feedbacks.find((f) => f.id === feedbackId);
        if (feedback) {
          const existingVote = feedback.votes.find((v) => v.user.id === userId);
          if (existingVote) {
            existingVote.type = type;
          } else {
            feedback.votes.push({
              id: userId,
              type,
              user: {
                id: userId,
                username: action.payload.username,
                email: action.payload.email,
                isAdmin: action.payload.isAdmin,
                isDisabled: action.payload.isDisabled,
              },
            });
          }
        }
        state.feedbacks = [...state.feedbacks];
        state.isLoading = false;
      })
      .addCase(voteThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(voteThunk.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createFeedbackThunk.fulfilled, (state, action) => {
        state.feedbacks.push(action.payload);
        state.count += 1;
        state.isLoading = false;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        const feedback = state.feedbacks.find(
          (f) => f.id === action.payload.id
        );
        if (feedback) {
          feedback.status = action.payload.status;
        }
        state.isLoading = false;
      })
      .addCase(createFeedbackThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createFeedbackThunk.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(commentThunk.fulfilled, (state, action) => {
        const feedback = state.feedbacks.find(
          (f) => f.id === action.payload.feedbackId
        );
        if (feedback) {
          feedback.comments.push({
            id: action.payload.id,
            content: action.payload.content,
            author: {
              id: action.payload.userId,
              username: action.payload.username,
              email: action.payload.email,
              isAdmin: action.payload.isAdmin,
              isDisabled: action.payload.isDisabled,
            },
            feedback: feedback,
            replies: [],
            authorId: action.payload.userId,
          });
        }
      })
      .addCase(commentThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(commentThunk.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default feedbackSlice.reducer;
