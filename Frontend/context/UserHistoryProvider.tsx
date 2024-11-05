import { View, Text } from "react-native";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useUrl } from "./UrlProvider";

const HistoryContext = createContext<any>(null);

export const UserHistoryProvider = ({ children }: any) => {
  const [pointsHistory, setPointsHistory] = useState([]);
  const [rewardsHistory, setRewardsHistory] = useState([]);
  const [pointsTotalPages, setPointsTotalPages] = useState(0);
  const [rewardTotalPages, setRewardTotalPages] = useState(0);
  const { ipAddress, port } = useUrl();
  interface user {
    _id: string;
  }

  const getPointsHistory = async (
    user: user,
    pageNumber: number,
    limit: number
  ) => {
    try {
      let url = `http://${ipAddress}:${port}/api/history/dispose/user/${user._id}?status=active&page=${pageNumber}&limit=${limit}`;
      let response = await axios.get(url);
      if (response.data.success === true) {
        setPointsHistory(response.data.userdisposalhistory);
        setPointsTotalPages(response.data.totalPages);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRewardsHistory = async (
    user: user,
    pageNumber: number,
    limit: number
  ) => {
    try {
      let url = `http://${ipAddress}:${port}/api/history/claim/user/${user._id}?status=active&page=${pageNumber}&limit=${limit}`;
      let response = await axios.get(url);
      if (response.data.success === true) {
        setRewardsHistory(response.data.userrewardclaimhistory);
        setRewardTotalPages(response.data.totalPages);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <HistoryContext.Provider
      value={{
        pointsHistory,
        rewardsHistory,
        getPointsHistory,
        getRewardsHistory,
        pointsTotalPages,
        rewardTotalPages,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);
