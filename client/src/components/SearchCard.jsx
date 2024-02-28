import React, { useState, useRef } from "react";
import CloseRounded from "@mui/icons-material/CloseRounded";
import { Modal } from "@mui/material";
import styled from "styled-components";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { UseDispatch } from "react-redux";
import {
  closePlayer,
  openPlayer,
  setCurrentTime,
} from "../redux/audioplayerSlice";
import { openSnackbar } from "../redux/snackbarSlice";

const SearchCard = () => {
  return <div>SearchCard</div>;
};

export default SearchCard;
