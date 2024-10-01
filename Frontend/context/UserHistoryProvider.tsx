import { View, Text } from "react-native";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const HistoryContext = createContext<any>(null);

export const UserHistoryProvider = ({ children }: any) => {
  const [pointsHistory, setPointsHistory] = useState([]);
  const [rewardsHistory, setRewardsHistory] = useState([]);

  interface user {
    _id: string;
  }

  const fetchPointsHistory = async (user: user) => {
    if (user) {
      try {
        let url = `http://192.168.254.139:8080/api/history/dispose/${user._id}`;
        let response = await axios.get(url);
        if (response.status === 200) {
          setPointsHistory(response.data.userdisposalhistory);
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("not user");
    }
  };

  const fetchRewardsHistory = async (user: user) => {
    if (user) {
      try {
        let url = `http://192.168.254.139:8080/api/history/claim/${user._id}`;
        let response = await axios.get(url);
        if (response.status === 200) {
          setRewardsHistory(response.data.userrewardclaimhistory);
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("not user");
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
