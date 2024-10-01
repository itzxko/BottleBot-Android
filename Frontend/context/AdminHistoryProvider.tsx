import { View, Text } from "react-native";
import React, { createContext, useContext, useState, useEffect } from "react";

const AdminHistoryContext = createContext<any>(null);

export const AdminHistoryProvider = ({ children }: any) => {
  const [rewardsHistory, setRewardsHistory] = useState([]);
  const [pointsHistory, setPointsHistory] = useState([]);

  const fetchAllRewardsHistory = async () => {};
  const fetchAllPointsHistory = async () => {};

  return (
    <AdminHistoryContext.Provider value={{ fetchAllRewardsHistory }}>
      {children}
    </AdminHistoryContext.Provider>
  );
};

export const useAdminHistory = () => useContext(AdminHistoryContext);
