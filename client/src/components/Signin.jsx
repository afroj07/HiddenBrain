import React, { useState, useEffect } from "react";
import styles from "./Signin.module.css";
import googleIcon from "../Images/google.webp";
import styled from "styled-components";
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
import { useDispatch } from "react-redux";
import validator from "validator";
import {
  signIn,
  googleSingIn,
  findUserByEmail,
  resetPassword,
} from "../api/index";

import OTP from "./OTP.jsx";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { closeSignin } from "../redux/setSigninSlice";

const Signin = ({ setSignInOpen, setSignUpOpen, theme }) => {
  const OutlineBox = styled.div`
    height: 44px;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.text_secondary};
    color: ${({ theme }) => theme.text_secondary};
    ${({ googleButton, theme }) =>
      googleButton &&
      `user-select:none;
  gap:16px  `}

    ${({ button, theme }) =>
      button &&
      `user-select:none;
border:none;
background:${theme.button};
color:${theme.bg};
`}
${({ activeButton, theme }) =>
      activeButton &&
      ` user-select:none;
  border:none;
  background:${theme.primary};
  color:white;
  `}
  margin:3px 20px;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    padding: 0px 14px;
  `;

  const Error = styled.div`
    color: red;
    font-size: 10px;
    margin: 2px 26px 8px 26px;
    display: block;
    ${({ error, theme }) => error === "" && `display: none;`}
  `;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });
  // verify otp

  const [showOTP, setShowOTP] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  //resetPassword
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [samepassword, setSamepassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [confirmedpassword, setConfirmedpassword] = useState("");
  const [passwordCorrect, setPasswordCurrect] = useState(false);
  const [resetDisabled, setResetDisabled] = useState(true);
  const [resettingPassword, setResettingPassword] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (email !== "") validateEmail();
    if (validator.isEmail(email) && password.length > 5) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [email, password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!disabled) {
      dispatch(loginStart());
      setDisabled(true);
      setLoading(true);
      try {
        signIn({ email, password }).then((res) => {
          if (res.status === 200) {
            dispatch(loginSuccess(res.data));
            setLoading(false);
            setDisabled(false);
            dispatch(closeSignin());
            dispatch(
              openSnackbar({
                message: "Logged In Successfully",
                severity: "success",
              })
            );
          } else if (res.status === 203) {
            dispatch(loginFailure());
            setLoading(false);
            setDisabled(false);
            dispatch(
              openSnackbar({
                message: "Account Not Verified",
                severity: "error",
              })
            );
          } else {
            dispatch(loginFailure());
            setLoading(false);
            setDisabled(false);
            setcredentialError(`Invalid Credential : ${res.data.message}`);
          }
        });
      } catch (err) {
        dispatch(loginFailure());
        setLoading(false);
        setDisabled(false);
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      }
    }

    if (email === "" || password === "") {
      dispatch(
        openSnackbar({
          message: "Please fill all the fields",
          severity: "error",
        })
      );
    }
  };

  const [emailError, setEmailError] = useState("");
  const [credentialError, setcredentialError] = useState("");

  const validateEmail = () => {
    if (validator.isEmail(email)) {
      setEmailError("");
    } else {
      setEmailError("Enter a valid Email Id!");
    }
  };

  //validate password
  const validatePassword = () => {
    if (newpassword.length < 8) {
      setSamepassword("Password must be atleast 8 chaacters long!");
      setPasswordCurrect(false);
    } else if (newpassword.length > 16) {
      setSamepassword("Passord must be less than 16 characters long!");
      setPasswordCurrect(false);
    } else if (
      !newpassword.match(/[a-z]/g) ||
      !newpassword.match(/[A-Z]/g) ||
      !newpassword.match(/[0-9]/g) ||
      !newpassword.match(/[^a-zA-Z\d]/g)
    ) {
      setPasswordCurrect(false);
      setSamepassword(
        "Password must contain atleast one lowercase, uppercase,number and special character!"
      );
    } else {
      setSamepassword("");
      setPasswordCurrect(true);
    }
  };

  useEffect(() => {
    if (newpassword !== "") validatePassword();
    if (passwordCorrect && newpassword === confirmedpassword) {
      setSamepassword("");
      setResetDisabled(false);
    } else if (confirmedpassword !== "" && passwordCorrect) {
      setSamepassword("Password do not match!");
      setResetDisabled(true);
    }
  }, [newpassword, confirmedpassword]);

  const sendOtp = () => {
    if (!resetDisabled) {
      setResetDisabled(true);
      setLoading(true);
      findUserByEmail(email)
        .then((res) => {
          if (res.status === 200) {
            setShowOTP(true);
            setResetDisabled(false);
            setLoading(false);
          } else if (res.status === 202) {
            setEmailError("User not found!");
            setResetDisabled(false);
            setLoading(false);
          }
        })
        .catch((err) => {
          setResetDisabled(false);
          setLoading(false);
          dispatch(
            openSnackbar({
              message: err.message,
              severity: "error",
            })
          );
        });
    }
  };

  const performResetPassword = async () => {
    if (otpVerified) {
      setShowOTP(false);
      setResettingPassword(true);

      await resetPassword(email, confirmedpassword)
        .then((res) => {
          if (res.status === 200) {
            dispatch(
              openSnackbar({
                message: "Password Reset Successfully",
                severity: "success",
              })
            );
            setShowForgetPassword(false);
            setEmail("");
            setNewpassword("");
            setConfirmedpassword("");
            setOtpVerified(false);
            setResettingPassword(false);
          }
        })
        .catch((err) => {
          dispatch(
            openSnackbar({
              message: err.message,
              severity: "error",
            })
          );
          setShowOTP(false);
          setOtpVerified(false);
          setResettingPassword(false);
        });
    }
  };

  const closeForgetPassword = () => {
    setShowForgetPassword(false);
    setShowOTP(false);
  };
  useEffect(() => {
    performResetPassword();
  }, [otpVerified]);

  //Google SignIn

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      const user = await axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .catch((err) => {
          disabled(loginFailure());
          dispatch(
            openSnackbar({
              message: err.message,
              severity: "error",
            })
          );
        });
      googleSingIn({
        name: user.data.name,
        email: user.data.email,
        img: user.data.picture,
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          dispatch(loginSuccess(res.data));
          dispatch(closeSignin());
          dispatch(
            openSnackbar({
              message: "Logged In Successfully",
              severity: "success",
            })
          );
          setLoading(false);
        } else {
          dispatch(loginFailure(res.data));
          dispatch(
            openSnackbar({
              message: res.data.message,
              severity: "error",
            })
          );
          setLoading(false);
        }
      });
    },

    onError: (errorResponse) => {
      dispatch(loginFailure());
      setLoading(false);
      dispatch(
        openSnackbar({
          message: errorResponse.error,
          severity: "error",
        })
      );
    },
  });

  return (
    <Modal open={true} onClose={() => dispatch(closeSignin())}>
      <div className={styles.container}>
        {!showForgetPassword ? (
          <div className={styles.wrapper}>
            <CloseRounded
              style={{
                position: "absolute",
                top: "24px",
                right: "30px",
                cursor: "pointer",
                color: "whitesmoke",
              }}
              onClick={() => dispatch(closeSignin())}
            />
            <>
              <div className={styles.title}>Sign In</div>
              <OutlineBox
                googleButton={TroubleshootRounded}
                style={{ margin: "24px" }}
                onClick={() => googleLogin()}
              >
                {Loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  <>
                    <img style={{ width: "22px" }} src={googleIcon} />
                    Sign In with Google
                  </>
                )}
              </OutlineBox>
              <div className={styles.divider}>
                <div className={styles.line}>or</div>
              </div>
              <OutlineBox style={{ marginTop: "24px" }}>
                <EmailRounded
                  sx={{ fontSize: "20px" }}
                  style={{ paddingRight: "12px" }}
                />
                <input
                  className={styles.textInput}
                  type="email"
                  placeholder="Email Id"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </OutlineBox>
              <Error error={emailError}>{emailError}</Error>
              <OutlineBox>
                <PasswordRounded
                  sx={{ fontSize: "20px" }}
                  style={{ paddingRight: "12px" }}
                />
                <input
                  className={styles.textInput}
                  type={values.showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <IconButton
                  color="inherit"
                  onClick={() =>
                    setValues({ ...values, showPassword: !values.showPassword })
                  }
                >
                  {values.showPassword ? (
                    <Visibility sx={{ fontSize: "20px" }} />
                  ) : (
                    <VisibilityOff sx={{ fontSize: "20px" }} />
                  )}
                </IconButton>
              </OutlineBox>
              <Error error={credentialError}>{credentialError}</Error>
              <div
                className={styles.forgetPassword}
                onClick={() => {
                  setShowForgetPassword(true);
                }}
              >
                <b>Forget Password</b>
              </div>
              <OutlineBox
                button={"true"}
                activeButton={!disabled}
                style={{ marginTop: "6px", cursor: "pointer" }}
                onClick={handleLogin}
              >
                {Loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  "Sign In"
                )}
              </OutlineBox>
            </>
            <div className={styles.loginText}>
              Don't have an account ?
              <span
                className={styles.span}
                onClick={() => {
                  setSignUpOpen(true);
                  dispatch(closeSignin());
                }}
                style={{
                  fontWeight: "500",
                  marginLeft: "6px",
                  cursor: "pointer",
                }}
              >
                Create Account
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.wrapper}>
            <CloseRounded
              style={{
                position: "absolute",
                top: "24px",
                right: "30px",
                cursor: "pointer",
              }}
              onClick={() => {
                closeForgetPassword();
              }}
            />
            {!showOTP ? (
              <>
                <div className={styles.title}>Reset Password</div>
                {resettingPassword ? (
                  <div
                    style={{
                      padding: "12px 26px",
                      marginBottom: "20px",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "14px",
                      justifyContent: "center",
                    }}
                  >
                    Updating Password
                    <CircularProgress color="inherit" size={20} />
                  </div>
                ) : (
                  <>
                    <OutlineBox style={{ marginTop: "24px" }}>
                      <EmailRounded
                        sx={{ fontSize: "20px" }}
                        style={{ paddingRight: "12px" }}
                      />
                      <input
                        className={styles.textInput}
                        placeholder="Email ID"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </OutlineBox>
                    <Error error={emailError}>{emailError}</Error>

                    <OutlineBox>
                      <PasswordRounded
                        sx={{ fontSize: "20px" }}
                        style={{ paddingRight: "12px" }}
                      />
                      <input
                        className={styles.textInput}
                        placeholder="New Password"
                        type="text"
                        onChange={(e) => setNewpassword(e.target.value)}
                      />
                    </OutlineBox>
                    <OutlineBox>
                      <PasswordRounded
                        sx={{ fontSize: "20px" }}
                        style={{ paddingRight: "12px" }}
                      />
                      <input
                        className={styles.textInput}
                        placeholder="Confirm Password"
                        type={values.showPassword ? "text" : "password"}
                        onChange={(e) => setConfirmedpassword(e.target.value)}
                      />
                      <IconButton
                        color="inherit"
                        onClick={() =>
                          setValues({
                            ...values,
                            showPassword: !values.showPassword,
                          })
                        }
                      >
                        {values.showPassword ? (
                          <Visibility sx={{ fontSize: "20px" }} />
                        ) : (
                          <VisibilityOff sx={{ fontSize: "20px" }} />
                        )}
                      </IconButton>
                    </OutlineBox>
                    <Error error={samepassword}>{samepassword}</Error>

                    <OutlineBox
                      button={"true"}
                      activeButton={!resetDisabled}
                      style={{ marginTop: "6px", marginBottom: "24px" }}
                      onClick={() => sendOtp()}
                    >
                      {Loading ? (
                        <CircularProgress color="inherit" size={24} />
                      ) : (
                        "Submit"
                      )}
                    </OutlineBox>
                    <div className={styles.loginText}>
                      Don'nt have an account ?
                      <span
                        className={styles.span}
                        onClick={() => {
                          setSignUpOpen(true);
                          dispatch(closeSignin());
                        }}
                        style={{
                          fontWeight: "500",
                          marginLeft: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Create Account
                      </span>
                    </div>
                  </>
                )}
              </>
            ) : (
              <OTP
                email={email}
                name="User"
                otpVerified={otpVerified}
                setOtpVerified={setOtpVerified}
                reason="FORGOTPASSWORD"
              />
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default Signin;
