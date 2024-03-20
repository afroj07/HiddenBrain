import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import PodcastCard from "../components/PodcastCard";

const Topic = styled.div`
  font-size: 24px;
  font-weight: 540;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.text_primary};
`;

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  display: flex;
  gap: 20px;
  height: 100%;
  flex-direction: column;
  overflow-y: scroll;
`;
const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;
const FavoriteICon = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  padding: 20px 30px;
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const DisplayNo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.text_primary};
`;

const Favourites = () => {
  const [user, setUser] = useState();
  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const token = localStorage.getItem("podstreamtoken");

  const getUser = async () => {
    await getUser(token)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getuser = async () => {
    if (currentUser) {
      setLoading(true);
      await getUser();
      setLoading(false);
    }
  };
  useEffect(() => {
    getuser();
  }, [currentUser]);

  return (
    <Container>
      <Topic>Favourites</Topic>
      {Loading ? (
        <Loader>
          <CircularProgress />
        </Loader>
      ) : (
        <FavouritesContainer>
          {user?.favorits?.length === 0 && <DisplayNo>No Favourites</DisplayNo>}
          {user &&
            user?.favorits.map((podcast) => (
              <PodcastCard podcast={podcast} user={user} />
            ))}
        </FavouritesContainer>
      )}
    </Container>
  );
};

export default Favourites;
