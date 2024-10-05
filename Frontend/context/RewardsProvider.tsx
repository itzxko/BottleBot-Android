import { View, Text } from "react-native";
import React, { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";
import { useUrl } from "./UrlProvider";

const RewardsContext = createContext<any>(null);

export const RewardsProvider = ({ children }: any) => {
  const [rewards, setRewards] = useState([]);
  const [categories, setCategories] = useState([]);
  const { ipAddress, port } = useUrl();

  interface reward {
    category: string;
  }

  const fetchRewards = async () => {
    try {
      const response = await axios.get(
        `http://${ipAddress}:${port}/api/rewards`
      );
      setRewards(response.data.rewards);
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

  const fetchRewardQty = async () => {};

  const filterRewards = async (category: string) => {
    try {
      if (category === "All") {
        fetchRewards();
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

  return (
    <RewardsContext.Provider
      value={{ rewards, categories, fetchRewards, filterRewards }}
    >
      {children}
    </RewardsContext.Provider>
  );
};

export const useRewards = () => useContext(RewardsContext);
