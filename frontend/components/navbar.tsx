"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hook";
import { logout } from "@/redux/slice/auth.slice";

function Navbar() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const [accessToken, setAccessToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    setAccessToken(token || null);
  }, []);

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
          <Box sx={{ flexGrow: 0 }}>
            {accessToken ? (
              <Tooltip title="Logout">
                <Button
                  sx={{ color: "white" }}
                  onClick={() => {
                    document.cookie = "token=; Max-Age=0; path=/;";
                    dispatch(logout());
                    setAccessToken(null);
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
                  onClick={() => router.push("/signIn")}
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
