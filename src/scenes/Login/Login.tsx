import React from "react";
import { useForm } from "react-hook-form";
import { useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "@/theme";
import FormInputText from "@/components/FormInputText";

type LoginFormValues = {
  username: string;
  password: string;
};

const defaultValues = {
  username: "",
  password: "",
};

const Login: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const signIn = useSignIn();
  const navigate = useNavigate();

  const { handleSubmit, control, setError } = useForm<LoginFormValues>({
    defaultValues: defaultValues,
  });

  async function login(payload: { username: string; password: string }) {
    console.log(payload);
    const response = await fetch(
      `http://${import.meta.env.VITE_API_HOST}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    const body = await response.json();
    const success = body["success"];
    const token = body["token"];
    const expIn = body["exp"];

    if (success) {
      signIn({
        token: token,
        expiresIn: expIn / 60,
        tokenType: "Bearer",
        authState: { username: payload.username },
      });

      navigate("/");
    } else {
      console.log("Error login in");
      setError("username", { type: "custom", message: "Incorrect" });
      setError("password", { type: "custom", message: "Incorrect" });
    }
  }

  return (
    <Box maxWidth="500px" margin="auto">
      <Typography variant="h3" color={colors.greenAccent[500]} m="0.5rem 0">
        Login
      </Typography>

      <FormInputText name="username" control={control} label="Username" />
      <FormInputText
        name="password"
        control={control}
        label="Password"
        password={true}
      />

      <Button
        onClick={handleSubmit((data: LoginFormValues) => login(data))}
        variant="contained"
        color="secondary"
        sx={{ m: "0.5rem 0" }}
      >
        Login
      </Button>
    </Box>
  );
};

export default Login;
