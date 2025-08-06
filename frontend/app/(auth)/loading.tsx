import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

const Loading = () => {
  return (
    <Backdrop open sx={{ color: "#fff", zIndex: 9999 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
