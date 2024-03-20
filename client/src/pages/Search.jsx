import React, { useState } from "react";
import styled from "styled-components";
import SearchOutlineIcon from "@mui/icons-material/SearchOutlined";
import { DefaultCard } from "../components/DefaultCard.jsx";
import { Category } from "../utils/Data.js";
import { searchPodcast } from "../api/index.js";
import { PodcastCard } from "../components/PodcastCard.jsx";
import TopResult from "../components/TopResult.jsx";
import MoreResult from "../components/MoreResult.jsx";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/snackbarSlice.jsx";
import { CircularProgress } from "@mui/material";
import MoreResult from "../components/MoreResult.jsx";

const SearchMain = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: 768px) {
    padding: 20px 9px;
  }
`;
const Heading = styled.div`
  align-items: flex-start;
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 540;
`;

const BrowsAll = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  padding: 14px;
`;

const SearchedCards = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 20px;
  padding: 14px;
  @media (max-width: 768px) {
    padding: 6px;
    justify-content: center;
    flex-direction: column;
  }
`;

const Categories = styled.div`
  margin: 20px 10px;
`;

const Search_Whole = styled.div`
  max-width: 700px;
  display: flex;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  border-radius: 30px;
  cursor: pointer;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  color: ${({ theme }) => theme.text_secondary};
`;

const OtherResults = styled.div`
  display: flex;
  flex-direction: column;
  height: 700px;
  overflow-y: scroll;
  overflow-x: hidden;
  gap: 6px;
  padding: 4px 4px;
  @media (max-width: 768px) {
    padding: 4px 0px;
    height: 100%;
  }
`;
const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const DisplayNo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.text_primary};
`;

const Search = () => {
  const [searched, setSearched] = useState("");
  const [searchedPodcasts, setSearchedPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = async (e) => {
    setSearchedPodcasts([]);
    setLoading(true);
    setSearched(e.target.value);
    await searchPodcast(e.target.value)
      .then((res) => {
        setSearchedPodcasts(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      });
    setLoading(false);
  };

  return (
    <SearchMain>
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Search_Whole>
          <SearchOutlineIcon sx={{ color: "inherit" }} />
          <input
            type="text"
            placeholder="Search Artist/Podcast"
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              background: "inherit",
              color: "inherit",
            }}
            value={searched}
            onChange={(e) => handleChange(e)}
          />
        </Search_Whole>
      </div>
      {searched == "" ? (
        <Categories>
          <Heading>Browse All</Heading>
          <BrowsAll>
            {Category.map((category) => (
              <Link
                to={"/showpodcasts/${category.name.toLowerCase()}"}
                style={{ textDecoration: "none" }}
              >
                <DefaultCard category={category} />
              </Link>
            ))}
          </BrowsAll>
        </Categories>
      ) : (
        <>
          {loading ? (
            <Loader>
              <CircularProgress />
            </Loader>
          ) : (
            <SearchedCards>
              {searchedPodcasts.length === 0 ? (
                <DisplayNo>No Podcasts Found</DisplayNo>
              ) : (
                <>
                  <TopResult podcast={searchedPodcasts[0]} />
                  <OtherResults>
                    {searchedPodcasts.map((podcast) => (
                      <MoreResult podcast={podcast} />
                    ))}
                  </OtherResults>
                </>
              )}
            </SearchedCards>
          )}
        </>
      )}
    </SearchMain>
  );
};

export default Search;
