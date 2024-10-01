import {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/loader";
import { LinearGradient } from "expo-linear-gradient";
import { useHistory } from "@/context/UserHistoryProvider";

const History = () => {
  // const [rewardsHistory, setRewardsHistory] = useState([]);
  // const [pointsHistory, setPointsHistory] = useState([]);
  const { user } = useAuth();
  const [pointsPage, setPointsPage] = useState(false);
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const [redeemables, setRedeemables] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    pointsHistory,
    rewardsHistory,
    fetchPointsHistory,
    fetchRewardsHistory,
  } = useHistory();

  interface user {
    _id: string;
    personalInfo: {
      firstName: string;
      lastName: string;
    };
  }

  interface RewardsHistory {
    dateClaimed: Date;
    _id: string;
    pointsSpent: number;
    userId: string;
    rewardId: string;
  }

  interface PointsHistory {
    _id: string;
    dateDisposed: Date;
    pointsAccumulated: number;
  }

  interface RedeemableItem {
    rewardName: string;
  }

  interface Item {
    _id: string;
  }

  const toggleHistoryPage = () => {
    setPointsPage(!pointsPage);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        let url = "http://192.168.254.139:8080/api/rewards";
        let response = await axios.get(url);
        setRedeemables(response.data.rewards);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRewards();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchRewardsHistory(user);
      await fetchPointsHistory(user);
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView className="flex-1 px-6 bg-[#F0F0F0]">
      <>
        {/* Titlebar */}
        <View className="relative w-full flex flex-row items-center justify-center py-4">
          <TouchableHighlight
            underlayColor={"#C9C9C9"}
            className="absolute left-0 rounded-full"
            onPress={() => navigation.goBack()}
          >
            <View className="p-2 bg-[#E1E1E1] rounded-full flex items-center justify-center">
              <Ionicons name="chevron-back" size={18} />
            </View>
          </TouchableHighlight>
          <Text className="text-xl font-semibold">History</Text>
        </View>
        {/* ToggleBar */}
        <View className="w-full flex items-center justify-center my-4">
          <View className="flex flex-row items-center justify-center p-2 bg-[#E6E6E6] rounded-2xl">
            <Pressable
              className={`${
                !pointsPage ? "bg-[#F6F6F6]" : "bg-[#E6E6E6]"
              } flex px-6 py-3 rounded-xl`}
              onPress={toggleHistoryPage}
            >
              <Text>Rewards</Text>
            </Pressable>
            <Pressable
              className={`${
                pointsPage ? "bg-[#F6F6F6]" : "bg-[#E6E6E6]"
              } flex px-6 py-3 rounded-xl`}
              onPress={toggleHistoryPage}
            >
              <Text>Points</Text>
            </Pressable>
          </View>
        </View>
        <ScrollView
          className="flex-1 w-full"
          showsVerticalScrollIndicator={false}
        >
          {!pointsPage ? (
            <>
              <View className="w-full flex items-center justify-center py-2">
                {/* Title Section */}
                <View className="w-full flex items-start justify-center py-2">
                  <Text className="text-xl font-semibold">Rewards History</Text>
                  <Text className="text-xs font-normal text-black/50">
                    Your record of redeemed rewards
                  </Text>
                </View>
                {/* Reward Cards */}
                <View className="w-full flex items-center justify-center py-2">
                  {rewardsHistory.length === 0 ? (
                    <View className="w-full flex justify-center items-center">
                      <LinearGradient
                        className="p-3 rounded-full"
                        colors={["#00674F", "#06402B"]}
                      >
                        <MaterialCommunityIcons
                          name="timer-sand-empty"
                          size={40}
                          color={"white"}
                        />
                      </LinearGradient>
                      <Text className="text-sm font-normal text-black/50 pt-4">
                        No Rewards History Available
                      </Text>
                    </View>
                  ) : (
                    rewardsHistory.map((rewardsHistory: RewardsHistory) => {
                      const redeemableItem = redeemables.find(
                        (item: Item) => item._id === rewardsHistory.rewardId
                      ) as RedeemableItem | undefined;
                      const rewardName = redeemableItem
                        ? redeemableItem.rewardName
                        : "Not Found";

                      return (
                        <View
                          className="w-full bg-[#E6E6E6] p-6 rounded-xl mb-4"
                          key={rewardsHistory._id}
                        >
                          <View className="w-full flex flex-row justify-between items-center pb-3">
                            <Text className="text-xs font-normal text-black/50">
                              {(() => {
                                const date = new Date(
                                  rewardsHistory.dateClaimed
                                );
                                return isNaN(date.getTime())
                                  ? "Invalid Date"
                                  : date.toLocaleDateString("en-US"); // Format the date as needed
                              })()}
                            </Text>
                            <Text className="text-xs font-normal text-black/50 uppercase">
                              #{rewardsHistory._id}
                            </Text>
                          </View>
                          <View className="w-full flex flex-row items-end justify-between pt-3">
                            <Text className="text-lg text-[#00674F] font-semibold">
                              {rewardName} {/* Display the reward name here */}
                            </Text>
                            <Text className="text-sm font-normal">
                              {rewardsHistory.pointsSpent} pt.
                            </Text>
                          </View>
                        </View>
                      );
                    })
                  )}
                </View>
              </View>
            </>
          ) : (
            <>
              <View className="w-full flex items-center justify-center py-2">
                {/* Title Section */}
                <View className="w-full flex items-start justify-center py-2">
                  <Text className="text-xl font-semibold">Points History</Text>
                  <Text className="text-xs font-normal text-black/50">
                    Your record of accumulated points
                  </Text>
                </View>
                {/* Reward Cards */}
                <View className="w-full flex items-center justify-center py-2">
                  {pointsHistory.length === 0 ? (
                    <View className="w-full flex justify-center items-center">
                      <LinearGradient
                        className="p-3 rounded-full"
                        colors={["#00674F", "#06402B"]}
                      >
                        <MaterialCommunityIcons
                          name="timer-sand-empty"
                          size={40}
                          color={"white"}
                        />
                      </LinearGradient>
                      <Text className="text-sm font-normal text-black/50 pt-4">
                        No Points History Available
                      </Text>
                    </View>
                  ) : (
                    pointsHistory.map((pointsHistory: PointsHistory) => (
                      <View
                        className="w-full bg-[#E6E6E6] p-6 rounded-xl mb-4"
                        key={pointsHistory._id}
                      >
                        <View className="w-full flex flex-row justify-between items-center pb-3">
                          <Text className="text-xs font-normal text-black/50">
                            {(() => {
                              const date = new Date(pointsHistory.dateDisposed);
                              return isNaN(date.getTime())
                                ? "Invalid Date"
                                : date.toLocaleDateString("en-US"); // Format the date as needed
                            })()}
                          </Text>
                          <Text className="text-xs font-normal text-black/50 uppercase">
                            {pointsHistory._id}
                          </Text>
                        </View>
                        <View className="w-full flex flex-row items-end justify-start pt-3">
                          <Text className="text-lg text-[#00674F] font-semibold">
                            {pointsHistory.pointsAccumulated}{" "}
                            {pointsHistory.pointsAccumulated > 1
                              ? "pts."
                              : "pt."}
                          </Text>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              </View>
            </>
          )}
          <View className="w-full pb-24"></View>
        </ScrollView>
      </>
      {loading && <Loader />}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default History;
