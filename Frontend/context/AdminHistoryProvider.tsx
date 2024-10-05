import { View, Text } from "react-native";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useUrl } from "./UrlProvider";

const AdminHistoryContext = createContext<any>(null);

export const AdminHistoryProvider = ({ children }: any) => {
  const [rewardsHistory, setRewardsHistory] = useState([]);
  const [pointsHistory, setPointsHistory] = useState([]);
  const { ipAddress, port } = useUrl();

  const fetchAllRewardsHistory = async () => {
    try {
      let url = `http://${ipAddress}:${port}/api/history/claim`;

      let response = await axios.get(url);

      if (response.status === 200) {
        setRewardsHistory(response.data.allusersrewardclaimhistory);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchAllPointsHistory = async () => {
    try {
      let url = `http://${ipAddress}:${port}/api/history/dispose`;

      let response = await axios.get(url);

      if (response.status === 200) {
        setPointsHistory(response.data.allusersdisposalhistory);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchRewardHistory = async (user: string) => {
    try {
      let url = `http://${ipAddress}:${port}/api/history/claim?userName=${user}`;

      let response = await axios.get(url);

      if (response.status === 200) {
        setRewardsHistory(response.data.allusersrewardclaimhistory);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchPointHistory = async (user: string) => {
    try {
      let url = `http://${ipAddress}:${port}/api/history/dispose?userName=${user}`;

      let response = await axios.get(url);

      if (response.status === 200) {
        setPointsHistory(response.data.allusersdisposalhistory);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminHistoryContext.Provider
      value={{
        fetchAllRewardsHistory,
        fetchAllPointsHistory,
        rewardsHistory,
        pointsHistory,
        searchRewardHistory,
        searchPointHistory,
      }}
    >
      {children}
    </AdminHistoryContext.Provider>
  );
};

export const useAdminHistory = () => useContext(AdminHistoryContext);
