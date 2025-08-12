"use client";

import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { toast } from "sonner";
import { FeedbackSchema, ZFeedbackSchema } from "@/utils/zod";
import { FeedbackStatus } from "@/utils/enum copy";
import {
  createFeedbackThunk,
  findFeedbacks,
} from "@/redux/thunk/feedback.thunk";

const AddFeedbackDialog: React.FC<{
  open: boolean;
  handleClose: () => void;
}> = ({ open, handleClose }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ZFeedbackSchema>({
    resolver: zodResolver(FeedbackSchema),
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray<any>({ control, name: "tags" });

  const onSubmit = async (data: ZFeedbackSchema) => {
    if (!user) {
      toast.error("You must be logged in to submit feedback.");
      return;
    }
    const result = await dispatch(
      createFeedbackThunk({
        title: data.title,
        description: data.description,
        status: data.status,
        authorId: user.id,
        tags: data.tags,
      })
    );
    if (result.payload.statusCode === 400) {
      toast.error(`${result.payload.message}`);
    } else {
      toast.success("Successfully created feedback!");
      await dispatch(findFeedbacks({}));
      handleClose();
    }
    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>What's your feedback about?</DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <Box component="form" noValidate>
          <TextField
            autoFocus
            required
            margin="dense"
            id="title"
            label="Title"
            placeholder="Enter feedback title"
            fullWidth
            variant="standard"
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            required
            margin="dense"
            id="description"
            label="Description"
            placeholder="Enter feedback description"
            variant="standard"
            multiline
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
            fullWidth
          />

          <TextField
            required
            margin="dense"
            id="category"
            label="Category"
            select
            fullWidth
            variant="standard"
            defaultValue={FeedbackStatus.PUBLIC}
            {...register("status")}
            error={!!errors.status}
            helperText={errors.status?.message}
          >
            {Object.values(FeedbackStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>

          {tagFields.map((field, index) => (
            <Box
              key={field.id}
              sx={{
                display: "flex",
                gap: 2,
                mt: 2,
                alignItems: "flex-start",
              }}
            >
              <TextField
                {...register(`tags.${index}`)}
                label={`Tag #${index + 1}`}
                fullWidth
                placeholder="Enter tag"
                variant="standard"
                error={!!errors.tags?.[index]}
                helperText={errors.tags?.[index]?.message}
              />
              {tagFields.length > 1 && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => removeTag(index)}
                  sx={{ mt: 1 }}
                >
                  Remove
                </Button>
              )}
            </Box>
          ))}
          <Button
            size="small"
            variant="outlined"
            onClick={() => appendTag("")}
            disabled={tagFields.length >= 10}
            sx={{ my: 2 }}
          >
            + Add Tag ({tagFields.length}/5)
          </Button>
          <DialogActions>
            <Button
              onClick={() => {
                reset();
                handleClose();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              Create
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddFeedbackDialog;
