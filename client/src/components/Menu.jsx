import React from "react";
import styles from "./Menu.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/userSlice";
import { Link } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FavpuriteRoundeIcon from "@mui/icons-material/FavoriteRounded";
import BackupRoundedIcon from "@mui/icons-material/BackupRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeROundedIcon from "@mui/icons-material/DarkModeRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import logoIcon from "../Images/micImage.png";
import { openSignin } from "../redux/setSigninSlice";

const Menu = ({ setMenuOpen, darkMode, setDarkMode, setUploadOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const logoutUser = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div
      className={
        (styles.menuContainer,
        `${darkMode ? styles.darkMode : styles.lightMode}`)
      }
      setMenuOpen={setMenuOpen}
    >
      <div className={styles.flexProperty}>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <div className={styles.logo}>
            <img src={logoIcon} className={styles.Image} />
            HiddenBrain
          </div>
        </Link>
        <div className={styles.closeIcon}>
          <CloseRounded
            onClick={() => setMenuOpen(false)}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
      <Link
        to="/"
        style={{ textDecoration: "none", color: "inherit", width: "100%" }}
      >
        <div className={styles.element}>
          <HomeRoundedIcon />
          <div className={styles.navtext}>Dashboard</div>
        </div>
      </Link>

      <Link
        to="/search"
        style={{ textDecoration: "none", color: "inherit", width: "100%" }}
      >
        <div className={styles.element}>
          <SearchRoundedIcon />
          <div className={styles.navtext}>Search</div>
        </div>
      </Link>
      {currentUser ? (
        <Link
          to="/favourites"
          style={{ textDecoration: "none", color: "inherit", width: "100%" }}
        >
          <div className={styles.element}>
            <FavpuriteRoundeIcon />
            <div className={styles.navtext}>Favourites</div>
          </div>
        </Link>
      ) : (
        <Link
          onClick={() => dispatch(openSignin())}
          style={{ textDecoration: "none", color: "inherit", width: "100%" }}
        >
          <div className={styles.element}>
            <FavpuriteRoundeIcon />
            <div className={styles.navtext}>Favourites</div>
          </div>
        </Link>
      )}
      <hr />
      <Link
        onClick={() => {
          if (currentUser) {
            setUploadOpen(true);
          } else {
            dispatch(openSignin());
          }
        }}
        style={{ textDecoration: "none", color: "inherit", width: "100%" }}
      >
        <div className={styles.element}>
          <BackupRoundedIcon />
          <div className={styles.navtext}>Upload</div>
        </div>
      </Link>
      {darkMode ? (
        <>
          <div className={styles.element} onClick={() => setDarkMode(false)}>
            <LightModeRoundedIcon />
            <div className={styles.navtext}>Light Mode</div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.element} onClick={() => setDarkMode(true)}>
            <DarkModeROundedIcon />
            <div className={styles.navtext}>Dark Mode</div>
          </div>
        </>
      )}
      {currentUser ? (
        <div className={styles.element} onClick={() => logoutUser()}>
          <ExitToAppRoundedIcon />
          <div className={styles.navtext}>Log Out</div>
        </div>
      ) : (
        <div className={styles.element} onClick={() => dispatch(openSignin())}>
          <PersonOutlineRoundedIcon />
          <div className={styles.navtext}>Log In</div>
        </div>
      )}
    </div>
  );
};

export default Menu;
