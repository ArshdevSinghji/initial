"use client";

import { Box, Tooltip } from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { addButton } from "@/style/style";
import { useEffect, useState } from "react";
import AddFeedbackDialog from "./add-feedback-dialog";
import SignInDialog from "./signIn-dialog";

const AddFeedbackButton = () => {
  const [open, setOpen] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    setAccessToken(token || null);
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleOpenFeedbackDialog = () => {
    setOpenFeedbackDialog(true);
  };

  const handleClose = () => {
    setOpenFeedbackDialog(false);
    setOpen(false);
  };
  return (
    <>
      <Tooltip title="add feedback">
        <Box sx={addButton}>
          <AddCircleOutlineIcon
            sx={{ fontSize: 54 }}
            onClick={() => {
              if (!accessToken) {
                console.log("accessToken not found!");
                handleOpen();
                return;
              }
              handleOpenFeedbackDialog();
            }}
          />
        </Box>
      </Tooltip>
      <SignInDialog open={open} handleClose={handleClose} />
      <AddFeedbackDialog open={openFeedbackDialog} handleClose={handleClose} />
    </>
  );
};

export default AddFeedbackButton;
