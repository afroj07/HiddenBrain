import React, { useState, useEffect } from "react";
import {
  Block,
  CloseRounded,
  EmailRounded,
  Visibility,
  VisibilityOff,
  PasswordRounded,
  TroubleshootRounded,
} from "@mui/icons-material";
import { IconButton, Modal } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { openSnackbar } from "../redux/snackbarSlice";
import { UseDispatch } from "react-redux";
import validator from "validator";
import {
  signIn,
  googleSignIn,
  findUserByEmail,
  resetPassword,
} from "../api/index";
const Signin = () => {
  return <div>Signin</div>;
};

export default Signin;
