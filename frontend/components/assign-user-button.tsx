"use client";

import { Box, Tooltip } from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { addRecipeButton } from "@/style/style";
import { useState } from "react";
import AddRecipeDialog from "./search-user-dialog";

const AssignUserButton = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <Tooltip title="add recipe">
        <Box sx={addRecipeButton}>
          <AddCircleOutlineIcon sx={{ fontSize: 54 }} onClick={handleOpen} />
        </Box>
      </Tooltip>
      <AddRecipeDialog open={open} handleClose={handleClose} />
    </>
  );
};

export default AssignUserButton;
