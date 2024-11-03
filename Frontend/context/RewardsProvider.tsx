import { View, Text } from "react-native";
import React, { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";
import { useUrl } from "./UrlProvider";

const RewardsContext = createContext<any>(null);

export const RewardsProvider = ({ children }: any) => {
  const [rewards, setRewards] = useState([]);
  const [totalPages, setTotalPages] = useState();
  const [categories, setCategories] = useState([]);
  const { ipAddress, port } = useUrl();

  interface reward {
    category: string;
  }

  const getCategories = async () => {
    try {
      const response = await axios.get(
        `http://${ipAddress}:${port}/api/rewards`
      );
      setCategories(
        Array.from(
          new Set(
            response.data.rewards.map((reward: reward) => reward.category)
          )
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const getRewards = async (pageNumber: number, limit: number) => {
    try {
      const response = await axios.get(
        `http://${ipAddress}:${port}/api/rewards?status=active&page=${pageNumber}&limit=${limit}`
      );
      setRewards(response.data.rewards);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.log(err);
    }
  };

  const searchRewards = async (
    reward: string,
    category: string,
    pageNumber: number,
    limit: number
  ) => {
    try {
      const baseUrl = `http://${ipAddress}:${port}/api/rewards?rewardName=${reward}&status=active&page=${pageNumber}&limit=${limit}`;

      const url =
        category === "All" ? baseUrl : `${baseUrl}&category=${category}`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        setRewards(response.data.rewards);
        setTotalPages(response.data.totalPages);
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };

  const filterRewards = async (category: string) => {
    try {
      if (category === "All") {
        getRewards(1, 6);
      } else {
        let url = `http://${ipAddress}:${port}/api/rewards?category=${category}`;

        let response = await axios.get(url);

        if (response.status === 200) {
          setRewards(response.data.rewards);
        } else {
          console.log(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getArchivedRewards = async (pageNumber: number, limit: number) => {
    try {
      let url = `http://${ipAddress}:${port}/api/rewards?status=archived&page=${pageNumber}&limit=${limit}`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        setRewards(response.data.rewards);
        setTotalPages(response.data.totalPages);
      }
    } catch (error: any) {}
  };

  const searchArchivedRewards = async (
    reward: string,
    category: string,
    pageNumber: number,
    limit: number
  ) => {
    try {
      const baseUrl = `http://${ipAddress}:${port}/api/rewards?rewardName=${reward}&status=archived&page=${pageNumber}&limit=${limit}`;

      const url =
        category === "All" ? baseUrl : `${baseUrl}&category=${category}`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        setRewards(response.data.rewards);
        setTotalPages(response.data.totalPages);
      }
    } catch (error: any) {}
  };

  return (
    <RewardsContext.Provider
      value={{
        rewards,
        categories,
        getRewards,
        filterRewards,
        searchRewards,
        totalPages,
        getArchivedRewards,
        getCategories,
        searchArchivedRewards,
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
};

export const useRewards = () => useContext(RewardsContext);
