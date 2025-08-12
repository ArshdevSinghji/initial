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
  upvoteCount: number;
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
        const feedbackIndex = state.feedbacks.findIndex(
          (f) => f.id === action.payload.feedback.id
        );

        if (feedbackIndex !== -1) {
          const feedback = state.feedbacks[feedbackIndex];
          const userId = action.payload.user.id;

          const existingVoteIndex = feedback.votes.findIndex(
            (vote) => vote.user.id === userId
          );

          if (existingVoteIndex !== -1) {
            const existingVote = feedback.votes[existingVoteIndex];

            if (existingVote.type === action.payload.type) {
              feedback.votes.splice(existingVoteIndex, 1);
              if (action.payload.type === VoteType.UPVOTE) {
                feedback.upvoteCount -= 1;
              } else {
                feedback.upvoteCount += 1;
              }
            } else {
              feedback.votes[existingVoteIndex] = {
                id: action.payload.id,
                type: action.payload.type,
                user: {
                  id: action.payload.user.id,
                  username: action.payload.user.username,
                  email: action.payload.user.email,
                  isAdmin: action.payload.user.isAdmin,
                  isDisabled: action.payload.user.isDisabled,
                },
              };
              if (action.payload.type === VoteType.UPVOTE) {
                feedback.upvoteCount += 1;
              } else {
                feedback.upvoteCount -= 1;
              }
            }
          } else {
            feedback.votes.push({
              id: action.payload.id,
              type: action.payload.type,
              user: {
                id: action.payload.user.id,
                username: action.payload.user.username,
                email: action.payload.user.email,
                isAdmin: action.payload.user.isAdmin,
                isDisabled: action.payload.user.isDisabled,
              },
            });
            if (action.payload.type === VoteType.UPVOTE) {
              feedback.upvoteCount += 1;
            } else {
              feedback.upvoteCount -= 1;
            }
          }
        }
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
        const feedbackIndex = state.feedbacks.findIndex(
          (f) => f.id === action.payload.feedback.id
        );
        if (feedbackIndex === -1) {
          state.isLoading = false;
          return;
        }
        if (action.payload.parent) {
          const commentIndex = state.feedbacks[
            feedbackIndex
          ].comments.findIndex((c) => c.id === action.payload.parent.id);
          if (commentIndex !== -1) {
            state.feedbacks[feedbackIndex].comments[commentIndex].replies.push(
              action.payload
            );
          }
        } else {
          state.feedbacks[feedbackIndex].comments.push(action.payload);
        }
        state.isLoading = false;
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
