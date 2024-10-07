import { View, Text } from "react-native";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useUrl } from "./UrlProvider";

const HistoryContext = createContext<any>(null);

export const UserHistoryProvider = ({ children }: any) => {
  const [pointsHistory, setPointsHistory] = useState([]);
  const [rewardsHistory, setRewardsHistory] = useState([]);
  const { ipAddress, port } = useUrl();
  interface user {
    _id: string;
  }

  const fetchPointsHistory = async (user: user) => {
    try {
      let url = `http://${ipAddress}:${port}/api/history/dispose/${user._id}`;
      let response = await axios.get(url);
      if (response.status === 200) {
        setPointsHistory(response.data.userdisposalhistory);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRewardsHistory = async (user: user) => {
    try {
      let url = `http://${ipAddress}:${port}/api/history/claim/${user._id}`;
      let response = await axios.get(url);
      if (response.status === 200) {
        setRewardsHistory(response.data.userrewardclaimhistory);
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
        fetchPointsHistory,
        fetchRewardsHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);
