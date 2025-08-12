"use client";

import { CommentSchema, ZCommentSchema } from "@/utils/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  CircularProgress,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";

import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { commentThunk } from "@/redux/thunk/comment.thunk";
import { toast } from "sonner";

const CommentBox: React.FC<{
  open: boolean;
  handleClose: () => void;
  parentId: number | undefined;
  message: string;
}> = ({ open, handleClose, parentId, message }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ZCommentSchema>({
    resolver: zodResolver(CommentSchema),
  });

  const onSubmit = async (data: ZCommentSchema) => {
    if (!user) {
      toast.error("user must be logged in!");
      return;
    }

    if (!parentId) return;
    await dispatch(
      commentThunk({
        content: data.content,
        userId: user?.id,
        parentId: parentId,
      })
    );
    reset();
    handleClose();
  };

  return (
    open && (
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          p: 1,
        }}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          width={"100%"}
          alignItems={"center"}
        >
          <Typography variant="body2" sx={{ my: 1 }}>
            {message}
          </Typography>
          <Box onClick={handleClose}>
            <CloseIcon />
          </Box>
        </Stack>

        <TextField
          {...register("content")}
          multiline
          minRows={3}
          placeholder="Write a comment..."
          size="small"
          error={!!errors.content}
          helperText={errors?.content?.message}
          InputProps={{
            endAdornment: (
              <Box
                component="button"
                type="submit"
                sx={{
                  display: "flex",
                  alignSelf: "flex-end",
                  outline: "none",
                  border: "none",
                  backgroundColor: "transparent",
                  "&:hover": { cursor: "pointer" },
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} />
                ) : (
                  <Tooltip title="Send Comment" arrow>
                    <SendIcon />
                  </Tooltip>
                )}
              </Box>
            ),
          }}
          fullWidth
        />
      </Box>
    )
  );
};

export default CommentBox;
