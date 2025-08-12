"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { findFeedbacks } from "@/redux/thunk/feedback.thunk";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { VoteType } from "@/utils/enum";
import { voteThunk } from "@/redux/thunk/vote.thunk";
import { stringAvatar } from "@/style/style";

const Feedback = () => {
  const { feedbackId } = useParams();

  const dispatch = useAppDispatch();
  const { feedbacks } = useAppSelector((state) => state.feedback);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const findFeedbackById = async () => {
      if (feedbackId) {
        const result = await dispatch(
          findFeedbacks({
            feedbackId: Number(feedbackId),
          })
        );
        if (result.meta.requestStatus === "rejected") {
          toast.error("Failed to fetch feedback");
        }
      }
    };
    findFeedbackById();
  }, [dispatch, feedbackId]);

  return (
    <Container>
      {feedbacks.length > 0 ? (
        feedbacks.map((feedback) => (
          <Paper
            variant="outlined"
            key={feedback.id}
            sx={{
              mb: 2,
              p: 2,
              position: "relative",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <Avatar
                {...stringAvatar(feedback.author.username)}
                sizes="small"
              />
              <Box>
                <Typography variant="subtitle1">
                  {feedback.author.username}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {feedback.author.email}
                </Typography>
              </Box>
            </Stack>
            <Typography variant="h6">{feedback.title}</Typography>
            <Typography variant="body2">{feedback.description}</Typography>
            <Stack direction="row" spacing={1} mt={1}>
              {feedback.tags.map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  size="small"
                  variant="outlined"
                  sx={{
                    color: "#1976d2",
                    borderColor: "#e3f2fd",
                    backgroundColor: "#e3f2fd",
                  }}
                />
              ))}
            </Stack>
            <Stack spacing={1} p={1} mt={2}>
              {feedback.comments.map((comment) => {
                return (
                  <Box
                    key={comment.id}
                    sx={{
                      border: "1px solid #ccc",
                      padding: 1,
                      borderRadius: 1,
                    }}
                  >
                    <Stack direction="row" spacing={1}>
                      <Avatar {...stringAvatar(comment.author.username)} />
                      <Box>
                        <Typography variant="subtitle2">
                          {comment.author.username}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {comment.content}
                        </Typography>
                        {comment.replies && comment.replies.length > 0 && (
                          <Stack spacing={1} mt={1}>
                            {comment.replies.map((reply) => {
                              return (
                                <Box
                                  key={reply.id}
                                  sx={{
                                    border: "1px solid #ccc",
                                    padding: 1,
                                    borderRadius: 1,
                                    backgroundColor: "#f9f9f9",
                                  }}
                                >
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                  >
                                    <Avatar
                                      {...stringAvatar(reply.author.username)}
                                      sizes="small"
                                    />
                                    <Box>
                                      <Typography variant="subtitle2">
                                        {reply.author.username}
                                      </Typography>
                                      <Typography variant="body2">
                                        {reply.content}
                                      </Typography>
                                    </Box>
                                  </Stack>
                                </Box>
                              );
                            })}
                          </Stack>
                        )}
                      </Box>
                    </Stack>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      sx={{ mt: 2, float: "right" }}
                    >
                      Add Reply
                    </Button>
                  </Box>
                );
              })}
            </Stack>
            <Box
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
              }}
            >
              <Tooltip title="vote">
                <ThumbUpIcon
                  sx={{
                    color:
                      feedback.votes &&
                      feedback.votes.find(
                        (vote) =>
                          vote.user.id === user?.id &&
                          vote.type === VoteType.UPVOTE
                      )
                        ? "#1976d2"
                        : "action.disabled",
                    "&:hover": {
                      scale: 1.1,
                    },
                  }}
                  onClick={async (e) => {
                    e.preventDefault();
                    if (!user) {
                      toast.error("You must be logged in to vote");
                      return;
                    }
                    await dispatch(
                      voteThunk({
                        userId: user.id,
                        feedbackId: feedback.id,
                      })
                    );
                  }}
                />
              </Tooltip>
            </Box>
            <Button variant="outlined" size="small" sx={{ mt: 2 }}>
              Add Comments
            </Button>
          </Paper>
        ))
      ) : (
        <Typography variant="h1">No feedback available</Typography>
      )}
    </Container>
  );
};

export default Feedback;
