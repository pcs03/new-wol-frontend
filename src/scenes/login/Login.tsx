import "./Login.scss";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
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

  const { handleSubmit, control } = useForm<LoginFormValues>({
    defaultValues: defaultValues,
  });

  const onSubmit: SubmitHandler<LoginFormValues> = (data: LoginFormValues) => {
    const payload = {
      username: data.username,
      password: data.password,
    };

    login(payload);
  };

  async function login(payload: { username: string; password: string }) {
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
    }
  }

  return (
    <Box>
      <Typography variant="h3" color={colors.greenAccent[500]} m="0.5rem">
        Login
      </Typography>

      <FormInputText name="username" control={control} label="Username" />
      <FormInputText name="password" control={control} label="Password" />

      <Button
        onClick={() => handleSubmit(onSubmit)}
        variant="contained"
        color="secondary"
        sx={{ m: "0.5rem 0.5rem" }}
      >
        Reset
      </Button>
    </Box>
    // <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
    //   <div className="login-form-fields">
    //     <div className="device-input">
    //       <input
    //         {...register("username", { required: true })}
    //         placeholder="Username"
    //       />
    //       <p>{errors.username && <span>Username is required</span>}</p>
    //     </div>
    //     <div className="device-input">
    //       <input
    //         {...register("password", { required: true })}
    //         placeholder="Password"
    //       />
    //       <p>{errors.password && <span>Password is required</span>}</p>
    //     </div>
    //   </div>

    //   <div className="form-submit-container">
    //     <button type="submit" className="form-submit">
    //       Submit
    //     </button>
    //   </div>
    // </form>
  );
};

export default Login;
