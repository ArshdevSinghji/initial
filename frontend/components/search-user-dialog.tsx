"use client";

import * as React from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useState } from "react";
import { debounce } from "lodash";
import { toast } from "sonner";

interface User {
  uid: number;
  username: string;
  email: string;
}

const AddRecipeDialog: React.FC<{
  taskId: number;
  open: boolean;
  handleClose: () => void;
}> = ({ taskId, open, handleClose }) => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.user);
  const { user } = useAppSelector((state) => state.auth);

  const [inputValue, setInputValue] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  if (!user) return null;

  const debouncedSearch = React.useMemo(
    () =>
      debounce(async (value: string) => {
        const result = await dispatch(getUsersThunk({ searchTerm: value }));
        if (result.payload.statusCode === 400) {
          toast.error(`${result.payload.message}`);
        }
      }, 500),
    [dispatch]
  );

  const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign User</DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <Autocomplete
          disablePortal
          options={users.filter((i) => i.username !== user.username)}
          getOptionLabel={(option) => option.username}
          sx={{ width: 350 }}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          value={selectedUser}
          onChange={(event, newValue) => {
            setSelectedUser(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search users by name"
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
          noOptionsText="No matching users"
        />
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            disabled={!selectedUser}
            onClick={async () => {
              if (selectedUser) {
                console.log("taskId:", taskId);
                const result = await dispatch(
                  createAssignTaskThunk({
                    taskId: Number(taskId),
                    userId: selectedUser.uid,
                  })
                );
                if (result.payload.statusCode === 400) {
                  toast.error(`${result.payload.message}`);
                } else {
                  toast.success("User assigned successfully");
                  handleClose();
                }
              }
            }}
          >
            Assign
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecipeDialog;
