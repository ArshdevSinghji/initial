"use client";

import * as React from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { toast } from "sonner";
import { SignInSchema, ZSignInSchema } from "@/utils/zod";
import { signInThunk } from "@/redux/thunk/authentication.thunk";
import { useRouter } from "next/navigation";
import { divider } from "@/style/style";

import GoogleIcon from "@mui/icons-material/Google";
import Link from "next/link";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const SignInDialog: React.FC<{
  open: boolean;
  handleClose: () => void;
}> = ({ open, handleClose }) => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ZSignInSchema>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (data: ZSignInSchema) => {
    const result = await dispatch(
      signInThunk({
        email: data.email,
        password: data.password,
      })
    );

    if (
      result.payload.statusCode === 400 ||
      result.payload.statusCode === 401 ||
      result.payload.statusCode === 500 ||
      result.payload.statusCode === 404
    ) {
      toast.error(`${result.payload.message}`);
    } else {
      toast.success("Successfully signed in!");
      handleClose();
      window.location.reload();
    }
    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <Stack
          component={"form"}
          onSubmit={handleSubmit(onSubmit)}
          alignItems={"center"}
          gap={2}
          p={2}
          noValidate
        >
          <Typography variant="subtitle2">Put in your credentials</Typography>

          <TextField
            required
            {...register("email")}
            name="email"
            label="Email"
            type="email"
            size="small"
            error={!!errors.email}
            helperText={errors?.email?.message}
            fullWidth
          />

          <FormControl size="small" variant="outlined">
            <InputLabel
              htmlFor="outlined-adornment-password"
              error={!!errors.password}
            >
              Password *
            </InputLabel>
            <OutlinedInput
              required
              {...register("password")}
              name="password"
              error={!!errors.password}
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
            {errors?.password?.message && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {errors.password.message}
              </Typography>
            )}
          </FormControl>

          <Button
            disabled={isLoading || isSubmitting}
            type="submit"
            variant="outlined"
            size="small"
            fullWidth
          >
            {isLoading ? <CircularProgress /> : "Sign in"}
          </Button>

          <Divider sx={divider}>
            <Typography variant="body1">OR</Typography>
          </Divider>

          <Button
            disabled={isSubmitting}
            type="submit"
            variant="contained"
            startIcon={<GoogleIcon />}
            size="small"
            fullWidth
          >
            sign in with Google
          </Button>

          <Typography variant="subtitle2">
            Don't have an account? <Link href={"/signUp"}>SignUp</Link>
          </Typography>
        </Stack>
        {/* <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions> */}
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;
