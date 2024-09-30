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

const History = () => {
  const [rewardsHistory, setRewardsHistory] = useState([]);
  const [pointsHistory, setPointsHistory] = useState([]);
  const { user } = useAuth();
  const [pointsPage, setPointsPage] = useState(false);
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const [redeemables, setRedeemables] = useState([]);
  const [loading, setLoading] = useState(false);

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
    const fetchPointsHistory = async () => {
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
      }
    };

    fetchPointsHistory();
  }, [pointsHistory]);

  useEffect(() => {
    const fetchRewardsHistory = async () => {
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
          setMessage("Failed to fetch rewards history.");
        }
      } else {
        console.log("not user");
      }
    };
    fetchRewardsHistory();
  }, [rewardsHistory]);

  return (
    <SafeAreaView className="flex-1 px-6">
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
          <View className="flex flex-row items-center justify-center p-2 bg-[#E1E1E1] rounded-2xl">
            <Pressable
              className={`${
                !pointsPage ? "bg-[#F6F6F6]" : "bg-[#E1E1E1]"
              } flex px-6 py-3 rounded-xl`}
              onPress={toggleHistoryPage}
            >
              <Text>Rewards</Text>
            </Pressable>
            <Pressable
              className={`${
                pointsPage ? "bg-[#F6F6F6]" : "bg-[#E1E1E1]"
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
              <View className="w-full flex items-center justify-center py-2 ">
                {/* Title Section */}
                <View className="w-full flex items-start justify-center py-2">
                  <Text className="text-xl font-semibold">Rewards History</Text>
                  <Text className="text-xs font-normal text-black/50">
                    Your record of rewards redeemed
                  </Text>
                </View>
                {/* Reward Cards */}
                <View className="w-full flex h-3/4 items-center justify-center py-2">
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
                    rewardsHistory.map(
                      (rewardHistory: RewardsHistory, index) => {
                        // Find the redeemable item that matches the rewardId from rewardsHistory
                        const redeemableItem = redeemables.find(
                          (item: Item) => item._id === rewardHistory.rewardId
                        ) as RedeemableItem | undefined;
                        const rewardName = redeemableItem
                          ? redeemableItem.rewardName
                          : "Not Found";

                        return (
                          <View
                            className="w-full bg-[#E1E1E1] p-6 rounded-xl mb-4"
                            key={index}
                          >
                            <View className="w-full flex flex-row justify-between items-center pb-3">
                              <Text className="text-xs font-normal text-black/50">
                                {(() => {
                                  const date = new Date(
                                    rewardHistory.dateClaimed
                                  );
                                  return isNaN(date.getTime())
                                    ? "Invalid Date"
                                    : date.toLocaleDateString("en-US"); // Format the date as needed
                                })()}
                              </Text>
                              <Text className="text-xs font-normal text-black/50 uppercase">
                                {rewardHistory._id}
                              </Text>
                            </View>
                            <View className="w-full flex flex-row items-end justify-between pt-3">
                              <Text className="text-lg text-[#00674F] font-semibold">
                                {rewardName}{" "}
                                {/* Display the reward name here */}
                              </Text>
                              <Text className="text-sm font-normal">
                                {rewardHistory.pointsSpent} pt.
                              </Text>
                            </View>
                          </View>
                        );
                      }
                    )
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
                    pointsHistory.map((pointsHistory: PointsHistory, index) => (
                      <View
                        className="w-full bg-[#E1E1E1] p-6 rounded-xl mb-4"
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
                            {pointsHistory.pointsAccumulated}
                          </Text>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              </View>
            </>
          )}
          <View className="w-full pb-32"></View>
        </ScrollView>
      </>
      {loading && <Loader />}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default History;
