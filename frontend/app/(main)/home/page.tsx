"use client";

import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  InputAdornment,
  Pagination,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import debounce from "lodash/debounce";
import SearchIcon from "@mui/icons-material/Search";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AddFeedbackButton from "@/components/add-feedback-button";
import ShieldIcon from "@mui/icons-material/Shield";
import RemoveModeratorIcon from "@mui/icons-material/RemoveModerator";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { FilterSchema, ZFilterSchema } from "@/utils/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { findFeedbacks, updateStatus } from "@/redux/thunk/feedback.thunk";
import { voteThunk } from "@/redux/thunk/vote.thunk";
import { FeedbackStatus, VoteType } from "@/utils/enum";
import { findUserThunk } from "@/redux/thunk/user.thunk";
import { User } from "@/redux/slice/user.slice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [usersOpen, setUsersOpen] = useState(false);
  const [isLoadingDebounce, setIsLoadingDebounce] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [selectedUser, setSelectedUser] = useState<User[]>([]);

  const dispatch = useAppDispatch();
  const { feedbacks, count } = useAppSelector((state) => state.feedback);
  const { user } = useAppSelector((state) => state.auth);
  const { users } = useAppSelector((state) => state.searchUser);

  if (!user) return null;

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ZFilterSchema>({
    resolver: zodResolver(FilterSchema),
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray<any>({ control, name: "tags" });

  useEffect(() => {
    const fetchFeedbacks = async () => {
      await dispatch(
        findFeedbacks({
          limit: 10,
          pageNumber: page,
        })
      );
    };
    fetchFeedbacks();
  }, [dispatch, page]);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (value: string) => {
        await dispatch(
          findFeedbacks({
            search: value,
            limit: 10,
            pageNumber: page,
          })
        );
      }, 500),
    [dispatch]
  );
  const debouncedSearchUser = useMemo(
    () =>
      debounce(async (value: string) => {
        await dispatch(findUserThunk({ searchTerm: value, limit: 10 }));
      }, 500),
    [dispatch]
  );

  const onSubmit = async (data: ZFilterSchema) => {
    const filterConstraints = {
      data,
      selectedUser: selectedUser.map((user) => user.username),
    };
    const result = await dispatch(
      findFeedbacks({
        search: data.search,
        tags: data.tags,
        author: filterConstraints.selectedUser,
        limit: 10,
        pageNumber: page,
      })
    );
    if (result.payload.statusCode === 400) {
      toast.error(`${result.payload.message}`);
    } else {
      toast.success("Tasks fetched successfully!");
    }
  };

  const handleInputChange = (event: any, value: string) => {
    setInputValue(value);
    if (value) {
      setIsLoadingDebounce(false);
      debouncedSearchUser(value);
    } else {
      setIsLoadingDebounce(true);
    }
  };

  return (
    <Container>
      <Box>
        <Box
          component={"form"}
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            p: 4,
          }}
          noValidate
        >
          <TextField
            {...register("search")}
            label="Search Tasks"
            variant="outlined"
            placeholder="Search by title or description"
            fullWidth
            onChange={(e) => debouncedSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
            }}
            margin="normal"
          />
          <Box>
            {tagFields.map((field, index) => (
              <Box
                key={field.id}
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 2,
                  alignItems: "flex-start",
                }}
              >
                <TextField
                  {...register(`tags.${index}`)}
                  label={`Tag #${index + 1}`}
                  fullWidth
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
              variant="outlined"
              onClick={() => appendTag("")}
              sx={{ mb: 1 }}
            >
              + Add Tag
            </Button>
          </Box>

          <Box>
            <Autocomplete
              disablePortal
              sx={{ minWidth: 400 }}
              options={users}
              getOptionLabel={(option) => option.username}
              loading={isLoadingDebounce}
              loadingText={<CircularProgress size={18} />}
              inputValue={inputValue}
              onInputChange={handleInputChange}
              open={usersOpen}
              onOpen={() => {
                if (inputValue) setUsersOpen(true);
              }}
              onClose={() => {
                setIsLoadingDebounce(true);
                setUsersOpen(false);
              }}
              forcePopupIcon={false}
              noOptionsText="No user found :("
              onChange={(event, value) => {
                if (value) {
                  if (!selectedUser.some((user) => user.id === value.id)) {
                    setSelectedUser((prev) => [...prev, value]);
                  }
                  setUsersOpen(true);
                } else {
                  setUsersOpen(false);
                }
                setIsLoadingDebounce(true);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Filter by user..."
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Divider orientation="vertical" flexItem />

            {selectedUser.map((user) => (
              <Chip
                key={user.id}
                label={user.username}
                sx={{ m: 0.5, mt: 1 }}
                onDelete={() =>
                  setSelectedUser((prev) =>
                    prev.filter((u) => u.username !== user.username)
                  )
                }
              />
            ))}
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ mt: 2 }}
          >
            Apply filters
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              reset();
              setSelectedUser([]);
              setInputValue("");
              setIsLoadingDebounce(true);
              setUsersOpen(false);
              dispatch(findFeedbacks({ limit: 10, pageNumber: page }));
            }}
            sx={{ ml: 2, mt: 2 }}
          >
            Reset Filters
          </Button>
        </Box>
      </Box>

      <Box>
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback) => {
            // if (
            //   feedback.status === FeedbackStatus.PRIVATE &&
            //   feedback.author.id !== user.id
            // ) {
            //   return <></>;
            // }
            return (
              <Paper
                variant="outlined"
                key={feedback.id}
                sx={{
                  mb: 2,
                  p: 2,
                  "&:hover": { boxShadow: 3, cursor: "pointer" },
                  position: "relative",
                }}
                onClick={() => {
                  router.push(`/home/${feedback.id}`);
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <Avatar />
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
                      sx={{ backgroundColor: "#f0f0f0" }}
                    />
                  ))}
                </Stack>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    const accessToken = document.cookie
                      .split("; ")
                      .find((row) => row.startsWith("token="))
                      ?.split("=")[1];
                    if (!accessToken) router.push("/");

                    router.push(`/home/${feedback.id}`);
                  }}
                  sx={{ mt: 2 }}
                >
                  View Comments
                </Button>
                <Box
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                  }}
                >
                  <Tooltip
                    title={`${feedback.status}`}
                    sx={{ mr: 1 }}
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (feedback.author.id !== user.id) {
                        return toast.error(
                          "You cannot change the status of this feedback"
                        );
                      }
                      await dispatch(updateStatus(feedback.id));
                    }}
                  >
                    {feedback.status === FeedbackStatus.PRIVATE ? (
                      <ShieldIcon />
                    ) : (
                      <RemoveModeratorIcon />
                    )}
                  </Tooltip>
                  <Tooltip title="vote">
                    <ThumbUpIcon
                      sx={{
                        color:
                          feedback.votes &&
                          feedback.votes.find(
                            (vote) =>
                              vote.user.id === user.id &&
                              vote.type === VoteType.UPVOTE
                          )
                            ? "#1976d2"
                            : "action.disabled",
                        "&:hover": {
                          scale: 1.1,
                        },
                      }}
                      onClick={async (e) => {
                        e.stopPropagation();
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
              </Paper>
            );
          })
        ) : (
          <Typography variant="body2">No feedback available</Typography>
        )}
      </Box>

      <Pagination
        count={Math.ceil(count / 10)}
        color="primary"
        variant="outlined"
        shape="rounded"
        page={page}
        onChange={(event, value) => setPage(value)}
        sx={{ float: "right", marginTop: "20px" }}
      />
      <AddFeedbackButton />
    </Container>
  );
};

export default Home;
