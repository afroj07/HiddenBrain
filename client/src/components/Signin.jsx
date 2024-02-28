import React, { useState, useEffect } from "react";
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

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 380px;
  border-radius: 16px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_primary};
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 500;
  margin: 16px 28px;
  color: ${({ theme }) => theme.text_primary};
`;

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
color:'${theme.bg}';
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

const Divider = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
  font-weight: 600;
`;

const Line = styled.div`
  width: 80px;
  height: 1px;
  border-radius: 10px;
  margin: 0px 10px;
  color: ${({ theme }) => theme.text_secondary};
`;
const TextInput = styled.input`
  width: 100%;
  border: none;
  background-color: transparent;
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  outline: none;
`;

const LoginText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
  margin: 20px 20px 30px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Span = styled.span`
  color: ${({ theme }) => theme.text_primary};
`;

const Error = styled.div`
  color: red;
  font-size: 10px;
  margin: 2px 26px 8px 26px;
  display: block;
  ${({ error, theme }) => error === "" && `display: none;`}
`;

const ForgetPassword = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 13px;
  margin: 8px 26px;
  display: block;
  cursor: pointer;
  text-align: center;
  &:hover {
    color: ${({ theme }) => theme.text_primary};
  }
`;

const Signin = ({ setSignInOpen, setSignUpOpen, theme }) => {
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
      <Container>
        {!showForgetPassword ? (
          <Wrapper>
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
              <Title>Sign In</Title>
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
              <Divider>
                <Line>or</Line>
              </Divider>
              <OutlineBox style={{ marginTop: "24px" }}>
                <EmailRounded
                  sx={{ fontSize: "20px" }}
                  style={{ paddingRight: "12px" }}
                />
                <TextInput
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
                <TextInput
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
              <ForgetPassword
                onClick={() => {
                  setShowForgetPassword(true);
                }}
              >
                <b>Forget Password</b>
              </ForgetPassword>
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
            <LoginText>
              Don't have an account ?
              <Span
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
              </Span>
            </LoginText>
          </Wrapper>
        ) : (
          <Wrapper>
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
                <Title>Reset Password</Title>
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
                      <TextInput
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
                      <TextInput
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
                      <TextInput
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
                    <LoginText>
                      Don'nt have an account ?
                      <Span
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
                      </Span>
                    </LoginText>
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
          </Wrapper>
        )}
      </Container>
    </Modal>
  );
};

export default Signin;
