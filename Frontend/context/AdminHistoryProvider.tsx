import { View, Text } from "react-native";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AdminHistoryContext = createContext<any>(null);

export const AdminHistoryProvider = ({ children }: any) => {
  const [rewardsHistory, setRewardsHistory] = useState([]);
  const [pointsHistory, setPointsHistory] = useState([]);

  const fetchAllRewardsHistory = async () => {
    try {
      let url = "http://192.168.254.139:8080/api/history/claim";

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
      let url = "http://192.168.254.139:8080/api/history/dispose";

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
      }}
    >
      {children}
    </AdminHistoryContext.Provider>
  );
};

export const useAdminHistory = () => useContext(AdminHistoryContext);
