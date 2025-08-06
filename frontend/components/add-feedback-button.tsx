"use client";

import { Box, Tooltip } from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { addButton } from "@/style/style";
import { useState } from "react";
import AddFeedbackDialog from "./add-feedback-dialog";
import { useRouter } from "next/navigation";

const AddFeedbackButton = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!accessToken) {
      router.push("/");
      return;
    }

    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  return (
    <>
      <Tooltip title="add feedback">
        <Box sx={addButton}>
          <AddCircleOutlineIcon sx={{ fontSize: 54 }} onClick={handleOpen} />
        </Box>
      </Tooltip>
      <AddFeedbackDialog open={open} handleClose={handleClose} />
    </>
  );
};

export default AddFeedbackButton;
