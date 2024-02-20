import { ThemeProvider } from "styled-components";
import { useState, useEffect } from "react";
import { darkTheme, lightTheme } from "./utils/Theme";
import Signup from "../src/components/SignUp.jsx";
import Signin from "../src/components/Signin.jsx";
// import OTP from "../src/components/OTP.jsx";
import Navbar from "../src/components/Navbar.jsx";
import Menu from "../src/components/Menu.jsx";
import Dashboard from "../src/pages/Dashboard.jsx";
import ToastMessage from "../src/components/ToastMessage.jsx";
import Search from "../src/pages/Search.jsx";
import Favourites from "../src/pages/Favourites.jsx";
import Profile from "../src/pages/Profile.jsx";
import Upload from "../src/components/Upload.jsx";
import DisplayPodcasts from "../src/pages/DisplayPodcasts.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import AudioPlayer from "./components/AudioPlayer.jsx";
import VideoPlayer from "./components/Videoplayer.jsx";
import PodcastDetails from "./pages/PodcastDetails.jsx";
import { closeSignin } from "./redux/setSigninSlice.jsx";

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
`;

const Podstream = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
  backgrond: ${({ theme }) => theme.bgLight};
  overflow-y: hidden;
  overflow-x: hidden;
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const { open, message, severity } = useSelector((state) => state.snackbar);
  const { openplyer, type, episode, podid, currenttime, index } = useSelector(
    (state) => state.audioplayer
  );
  const { opensi } = useSelector((state) => state.signin);
  const [SignUpOpen, setSignUpOpen] = useState(false);
  const [SignInOpen, setSignInOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 1110) {
        setMenuOpen(false);
      } else {
        setMenuOpen(true);
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    dispatch(closeSignin());
  }, []);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <BrowserRouter>
        {opensi && (
          <Signin setSignInOpen={setSignInOpen} setSignUpOpen={setSignUpOpen} />
        )}
        {SignUpOpen && (
          <Signup setSignInOpen={setSignInOpen} setSignUpOpen={setSignUpOpen} />
        )}
        {uploadOpen && <Upload setUploadOpen={setUploadOpen} />}
        {openplyer && type === "video" && (
          <VideoPlayer
            episode={episode}
            podid={podid}
            currenttime={currenttime}
            index={index}
          />
        )}
        {openplyer && type === "audio" && (
          <AudioPlayer
            episode={episode}
            podid={podid}
            currenttime={currenttime}
            index={index}
          />
        )}
        <Podstream>
          {menuOpen && (
            <Menu
              setMenuOpen={setMenuOpen}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              setUploadOpen={setUploadOpen}
              setSignInOpen={setSignInOpen}
            />
          )}
          <Frame>
            <Navbar
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              setSignInOpen={setSignInOpen}
              setSignUpOpen={setSignUpOpen}
            />
            <Routes>
              <Route
                path="/"
                exact
                element={<Dashboard setSignInOpen={setSignInOpen} />}
              />
              <Route path="/search" exact element={<Search />} />
              <Route path="/favourites" exact element={<Favourites />} />
              <Route path="/profile" exact element={<Profile />} />
              <Route path="/podcast/:id" exact element={<PodcastDetails />} />
              <Route
                path="/showpodcasts/:type"
                exact
                element={<DisplayPodcasts />}
              />
            </Routes>
          </Frame>

          {open && (
            <ToastMessage open={open} message={message} severity={severity} />
          )}
        </Podstream>
      </BrowserRouter>
    </ThemeProvider>
  );
}
export default App;
