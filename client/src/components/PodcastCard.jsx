import React from "react";
import { Avatar } from "@mui/material";
import styled from "styled-components";
import FavoriteICon from "@mui/icons-material/Favorite";
import { useState } from "react";
import { IconButton } from "@mui/material";
import { favoritePodcast } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { openSignin } from "../redux/setSigninSlice";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const PlayIcon = styled.div`
  padding: 10px;
  border-radius: 50%;
  z-index: 100;
  display: flex;
  align-items: center;
  background-color: #9000ff !important;
  color: white !important;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  position: absolute !important;
  top: 45%;
  right: 10%;
  display: none;
  transition: all 0.4s ease-in-out;
  box-shadow: 0 0 16px 4px #9000ff50 !important;
`;

const Card = styled(Link)`
position: relative;
text-decoration: none;
background-color: ${({ theme }) => theme.card}; */
max-width:220px ;
height: 280px;
display: flex;
flex-direction: column;
justify-content: flex-start;
align-items: center;
padding: 16px;
border-radius: 6px;
box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
&:hover{
  cursor: pointer;
  transform: translateY(-8px);
  transition: all 0.4 ease-in-out;
  box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.3);
  filter: brightness(1.3);
}
&:hover ${PlayIcon}{
  display: flex;
}
`;
const Top = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 150px;
`;

const Title = styled.div`
  overflow: hidden;
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.text_primary};
`;

const Description = styled.div`
  overflow: hidden;
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
`;

const CardImage = styled.img`
  object-fit: cover;
  width: 220px;
  height: 140px;
  border-radius: 6px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  &:hover {
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
  }
`;

const CardInfromation = styled.div`
  display: flex;
  align-items: flex-end;
  font-weight: 450;
  padding: 14px 0px 0px 0px;
  width: 100%;
`;

const MainInfo = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  gap: 4px;
`;

const CreatorInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 6px;
`;

const CreatorName = styled.div`
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.text_secondary};
`;

const Views = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.text_secondary};
  width: max-content;
`;

const Favorite = styled(IconButton)`
  color: white;
  top: 8px;
  right: 6px;
  padding: 6px !important;
  border-radius: 50%;
  z-index: 100;
  display: flex;
  align-items: center;
  position: absolute !important;
  background: ${({ theme }) => theme.text_secondary + 95} !important;
  backdrop-filter: blur(4px);
  box-shadow: 0 0 16px #222423 !important;
`;

const PodcastCard = ({ podcast, user, setSignInOpen }) => {
  const [favourite, setFavourite] = useState(false);
  const dispatch = useDispatch();
  const token = localStorage.getItem("podstreamtoken");

  const favoritepodcast = async () => {
    await favoritePodcast(podcast._id, token)
      .then((res) => {
        if (res.status === 200) {
          setFavourite(!favourite);
        }
      })
      .catch((err) => {
        console, log(err);
      });
  };

  React.useEffect(() => {
    if (user?.favorites?.find((fav) => fav._id === podcast._id)) {
      setFavourite(true);
    }
  }, [user]);

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Card to={`/podcast/${podcast._id}`}>
      <div>
        <Top>
          <Link
            onClick={() => {
              if (!currentUser) {
                dispatch(openSignin());
              } else {
                favoritePodcast();
              }
            }}
          >
            <Favorite>
              {favourite ? (
                <FavoriteICon
                  style={{ color: "#E30022", width: "16px", height: "16px" }}
                />
              ) : (
                <FavoriteICon style={{ width: "16px", height: "16px" }} />
              )}
            </Favorite>
          </Link>
          <CardImage src={podcast.thumbnail} />
        </Top>
        <CardInfromation>
          <MainInfo>
            <Title>{podcast.name}</Title>
            <Description>{podcast.desc}</Description>
            <CreatorInfo>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Avatar
                  src={podcast.creator.img}
                  style={{ with: "26px", height: "26px" }}
                >
                  {podcast.creator.name?.charAt(0).toUpperCase()}
                </Avatar>
                <CreatorName>{podcast.creator.name}</CreatorName>
              </div>
              <Views>{podcast.views}</Views>
            </CreatorInfo>
          </MainInfo>
        </CardInfromation>
      </div>
      <PlayIcon>
        {podcast?.type === "video" ? (
          <PlayArrowIcon style={{ width: "28px", height: "28px" }} />
        ) : (
          <HeadphonesIcon style={{ width: "28px", height: "28px" }} />
        )}
      </PlayIcon>
    </Card>
  );
};

export default PodcastCard;
