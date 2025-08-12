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

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { stringAvatar } from "@/style/style";

import CommentBox from "@/components/comment-box";
import ReplyIcon from "@mui/icons-material/Reply";

const Feedback = () => {
  const { feedbackId } = useParams();

  const [parentId, setParentId] = useState<number>();
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const dispatch = useAppDispatch();
  const { feedbacks } = useAppSelector((state) => state.feedback);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
    <Container sx={{ my: 2 }}>
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
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                      }}
                      onClick={() => {
                        setMessage(`Replying to: ${comment.author.username}`);
                        setParentId(comment.id);
                        handleOpen();
                      }}
                    >
                      <Tooltip title="reply" arrow>
                        <ReplyIcon />
                      </Tooltip>
                    </Box>
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
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                      >
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
              onClick={() => {
                setMessage("Replying to feedback");
                setParentId(feedback.id);
                handleOpen();
              }}
            >
              <Tooltip title="reply" arrow>
                <ReplyIcon />
              </Tooltip>
            </Box>
            <CommentBox
              open={open}
              handleClose={handleClose}
              parentId={parentId}
              message={message}
            />
          </Paper>
        ))
      ) : (
        <Typography variant="h1">No feedback available</Typography>
      )}
    </Container>
  );
};

export default Feedback;
