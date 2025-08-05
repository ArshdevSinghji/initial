"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import AdbIcon from "@mui/icons-material/Adb";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hook";
import { logout } from "@/redux/slice/auth.slice";

function Navbar() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Tooltip title={!accessToken ? "Login to access Favorites" : ""}>
              <span>
                <Button
                  sx={{ my: 2, color: "white", display: "block" }}
                  disabled={!accessToken}
                  onClick={() => router.push("/favorites")}
                >
                  Favorites
                </Button>
              </span>
            </Tooltip>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {accessToken ? (
              <Tooltip title="Logout">
                <Button
                  sx={{ color: "white" }}
                  onClick={() => {
                    document.cookie = "accessToken=; Max-Age=0; path=/;";
                    dispatch(logout());
                    window.location.reload();
                  }}
                >
                  Logout
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Login">
                <Button
                  sx={{ color: "white" }}
                  onClick={() => router.push("/")}
                >
                  Login
                </Button>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
