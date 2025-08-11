"use client";

import { Box, Tooltip } from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { addButton } from "@/style/style";
import { useEffect, useState } from "react";
import AddFeedbackDialog from "./add-feedback-dialog";
import { useRouter } from "next/navigation";

const AddFeedbackButton = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

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
  const handleClose = () => setOpen(false);
  return (
    <>
      <Tooltip title="add feedback">
        <Box sx={addButton}>
          <AddCircleOutlineIcon
            sx={{ fontSize: 54 }}
            onClick={() => {
              if (!accessToken) {
                router.push("/login");
                return;
              }
              handleOpen();
            }}
          />
        </Box>
      </Tooltip>
      <AddFeedbackDialog open={open} handleClose={handleClose} />
    </>
  );
};

export default AddFeedbackButton;
