import { View, Text } from "react-native";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useUrl } from "./UrlProvider";

const AdminHistoryContext = createContext<any>(null);

export const AdminHistoryProvider = ({ children }: any) => {
  const [rewardsHistory, setRewardsHistory] = useState([]);
  const [pointsHistory, setPointsHistory] = useState([]);
  const { ipAddress, port } = useUrl();
  const [rewardTotalPages, setRewardTotalPages] = useState(0);
  const [pointTotalPages, setPointTotalPages] = useState(0);

  const getRewardsHistory = async (pageNumber: number, limit: number) => {
    try {
      let url = `http://${ipAddress}:${port}/api/history/claim?status=active&page=${pageNumber}&limit=${limit}`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        setRewardsHistory(response.data.allusersrewardclaimhistory);
        setRewardTotalPages(response.data.totalPages);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchActiveRewardHistory = async (
    user: string,
    pageNumber: number,
    limit: number
  ) => {
    try {
      let url = `http://${ipAddress}:${port}/api/history/claim?userName=${user}&status=active&page=${pageNumber}&limit=${limit}`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        setRewardsHistory(response.data.allusersrewardclaimhistory);
        setRewardTotalPages(response.data.totalPages);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchArchivedRewardHistory = async (
    user: string,
    pageNumber: number,
    limit: number
  ) => {
    try {
      let url = `http://${ipAddress}:${port}/api/history/claim?userName=${user}&status=archived&page=${pageNumber}&limit=${limit}`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        setRewardsHistory(response.data.allusersrewardclaimhistory);
        setRewardTotalPages(response.data.totalPages);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getArchivedRewardHistory = async (
    pageNumber: number,
    limit: string
  ) => {
    try {
      let url = `http://${ipAddress}:${port}/api/history/claim?status=archived&page=${pageNumber}&limit=${limit}`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        setRewardsHistory(response.data.allusersrewardclaimhistory);
        setRewardTotalPages(response.data.totalPages);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPointsHistory = async (pageNumber: number, limit: number) => {
    try {
      let url = `http://${ipAddress}:${port}/api/history/dispose?status=active&page=${pageNumber}&limit=${limit}`;

      let response = await axios.get(url);

      if (response.status === 200) {
        setPointsHistory(response.data.allusersdisposalhistory);
        setPointTotalPages(response.data.totalPages);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchActivePointHistory = async (
    user: string,
    pageNumber: number,
    limit: number
  ) => {
    try {
      let url = `http://${ipAddress}:${port}/api/history/dispose?userName=${user}&status=active&page=${pageNumber}&limit=${limit}`;

      let response = await axios.get(url);

      if (response.status === 200) {
        setPointsHistory(response.data.allusersdisposalhistory);
        setPointTotalPages(response.data.totalPages);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getArchivedPointHistory = async (pageNumber: number, limit: number) => {
    try {
      let url = `http://${ipAddress}:${port}/api/history/dispose?status=archived&page=${pageNumber}&limit=${limit}`;

      let response = await axios.get(url);

      if (response.status === 200) {
        setPointsHistory(response.data.allusersdisposalhistory);
        setPointTotalPages(response.data.totalPages);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchArchivedPointHistory = async (
    user: string,
    pageNumber: number,
    limit: number
  ) => {
    try {
      let url = `http://${ipAddress}:${port}/api/history/dispose?userName=${user}&status=archived&page=${pageNumber}&limit=${limit}`;

      let response = await axios.get(url);

      if (response.status === 200) {
        setPointsHistory(response.data.allusersdisposalhistory);
        setPointTotalPages(response.data.totalPages);
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
        getRewardsHistory,
        rewardsHistory,
        searchActiveRewardHistory,
        searchArchivedRewardHistory,
        getArchivedRewardHistory,
        rewardTotalPages,
        getPointsHistory,
        pointsHistory,
        searchActivePointHistory,
        getArchivedPointHistory,
        searchArchivedPointHistory,
        pointTotalPages,
      }}
    >
      {children}
    </AdminHistoryContext.Provider>
  );
};

export const useAdminHistory = () => useContext(AdminHistoryContext);
