import { View, Text, ScrollView, TouchableHighlight } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/loader";
import { LinearGradient } from "expo-linear-gradient";
import { useHistory } from "@/context/UserHistoryProvider";
import { ImageBackground } from "expo-image";
import { useUrl } from "@/context/UrlProvider";

// Define the interfaces
interface User {
  personalInfo: {
    firstName: string;
    lastName: string;
  };
}

interface Reward {
  _id: string;
  rewardName: string;
  image: string;
}

interface RewardHistory {
  _id: string;
  rewardId: string;
  pointsSpent: number;
  dateClaimed: string;
}

interface PointHistory {
  _id: string;
  pointsAccumulated: number;
  bottleCount: number;
  dateDisposed: string;
}

const History: React.FC = () => {
  const { user } = useAuth() as { user: User };
  const [pointsPage, setPointsPage] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [redeemables, setRedeemables] = useState<Reward[]>([]);
  const {
    pointsHistory,
    rewardsHistory,
    fetchPointsHistory,
    fetchRewardsHistory,
  } = useHistory();
  const { ipAddress, port } = useUrl();

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        let url = `http://${ipAddress}:${port}/api/rewards`;
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
      setLoading(true);
      await fetchRewardsHistory(user);
      await fetchPointsHistory(user);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#F0F0F0]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-full flex-1"
      >
        {/* Titlebar */}
        <View className="relative w-full flex flex-row items-center justify-center p-4">
          <TouchableHighlight
            underlayColor={"#C9C9C9"}
            className="absolute left-4 rounded-full"
            onPress={() => navigation.goBack()}
          >
            <View className="p-2 bg-[#E1E1E1] rounded-full flex items-center justify-center">
              <Ionicons name="chevron-back" size={18} />
            </View>
          </TouchableHighlight>
          <Text className="text-xl font-semibold">History</Text>
        </View>

        {/* Rewards History */}
        <View className="w-full flex items-center justify-center pt-6 ">
          <View className="w-full flex items-start justify-center pb-4 px-4">
            <Text className="text-xl font-semibold">Rewards History</Text>
            <Text className="text-xs font-normal text-black/50">
              all records of redeemed rewards
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex w-full"
          >
            {rewardsHistory.map(
              (rewardHistory: RewardHistory, index: number) => {
                const reward = redeemables.find(
                  (reward: Reward) => reward._id === rewardHistory.rewardId
                );

                const firstItem = index === 0;
                const lastItem = index === pointsHistory.length - 1;

                const margin = firstItem ? "mx-4" : lastItem ? "mr-4" : "mr-4";

                return (
                  <View
                    className={`bg-slate-500 rounded-3xl w-[320px] h-[240px] overflow-hidden ${margin}`}
                    key={rewardHistory._id}
                  >
                    <ImageBackground
                      className="w-full h-full"
                      source={
                        reward
                          ? {
                              uri: `http://${ipAddress}:${port}/api/images/${reward.image}`,
                            }
                          : require("../../assets/images/borgar.jpg")
                      }
                    >
                      <LinearGradient
                        className="w-full h-full p-5"
                        colors={[
                          "rgba(18, 18, 18, 0.2)",
                          "rgba(18, 18, 18, 0.8)",
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                      >
                        <View className="flex flex-col h-full justify-between">
                          <View className="w-full flex flex-row items-start justify-between">
                            <Text
                              className="text-xs font-normal text-white uppercase max-w-[60%]"
                              numberOfLines={1}
                            >
                              #{rewardHistory._id}
                            </Text>
                            <Text
                              className="text-xs font-normal text-white uppercase max-w-[20%]"
                              numberOfLines={1}
                            >
                              {`${rewardHistory.pointsSpent} ${
                                rewardHistory.pointsSpent > 1 ? "pts." : "pt."
                              }`}
                            </Text>
                          </View>
                          <View className="w-full flex items-start justify-center">
                            <View className="w-full flex items-start justify-center pb-4">
                              <Text
                                className="text-xl font-semibold text-white capitalize"
                                numberOfLines={1}
                              >
                                {reward?.rewardName}
                              </Text>
                            </View>
                            <View className="w-full overflow-hidden flex flex-row justify-start items-center">
                              <LinearGradient
                                className="flex items-center justify-center px-4 py-2 rounded-full mr-1 max-w-[60%]"
                                colors={["#D2AF26", "#BE8400"]}
                              >
                                <Text
                                  className="text-xs font-normal text-white"
                                  numberOfLines={1}
                                >
                                  {user?.personalInfo
                                    ? `${user.personalInfo.firstName} ${user.personalInfo.lastName}`
                                    : "Unknown User"}
                                </Text>
                              </LinearGradient>
                              <LinearGradient
                                className="flex items-center justify-center px-4 py-2 rounded-full max-w-[40%]"
                                colors={["#00674F", "#06402B"]}
                              >
                                <Text
                                  className="text-xs font-normal text-white"
                                  numberOfLines={1}
                                >
                                  {(() => {
                                    const date = new Date(
                                      rewardHistory.dateClaimed
                                    );
                                    return isNaN(date.getTime())
                                      ? "Invalid Date"
                                      : date.toLocaleDateString("en-US");
                                  })()}
                                </Text>
                              </LinearGradient>
                            </View>
                          </View>
                        </View>
                      </LinearGradient>
                    </ImageBackground>
                  </View>
                );
              }
            )}
          </ScrollView>
        </View>

        {/* Points History */}
        <View className="w-full flex items-center justify-center pt-6">
          <View className="w-full flex items-start justify-center pb-4 px-4">
            <Text className="text-xl font-semibold">Points History</Text>
            <Text className="text-xs font-normal text-black/50">
              all records of collected points
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex w-full"
          >
            {pointsHistory.map((pointHistory: PointHistory, index: number) => {
              const reward = redeemables.find(
                (reward) => reward._id === "hehe"
              );

              const firstItem = index === 0;
              const lastItem = index === pointsHistory.length - 1;

              const margin = firstItem ? "mx-4" : lastItem ? "mr-4" : "mr-4";

              return (
                <View
                  className={`bg-slate-500 rounded-3xl w-[320px] h-[240px] overflow-hidden mr-4 ${margin}`}
                  key={pointHistory._id}
                >
                  <ImageBackground
                    className="w-full h-full"
                    source={
                      reward
                        ? {
                            uri: `http://${ipAddress}:${port}/api/images/${reward.image}`,
                          }
                        : require("../../assets/images/Man.jpg")
                    }
                  >
                    <LinearGradient
                      className="w-full h-full p-5"
                      colors={[
                        "rgba(18, 18, 18, 0.2)",
                        "rgba(18, 18, 18, 0.8)",
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                    >
                      <View className="flex flex-col h-full justify-between">
                        <View className="w-full flex flex-row items-start justify-between">
                          <Text
                            className="text-xs font-normal text-white uppercase max-w-[60%]"
                            numberOfLines={1}
                          >
                            #{pointHistory._id}
                          </Text>
                          <Text
                            className="text-xs font-normal text-white uppercase max-w-[20%]"
                            numberOfLines={1}
                          >
                            {`${pointHistory.pointsAccumulated} ${
                              pointHistory.pointsAccumulated > 1
                                ? "pts."
                                : "pt."
                            }`}
                          </Text>
                        </View>
                        <View className="w-full flex items-start justify-center">
                          <View className="w-full flex items-start justify-center pb-4">
                            <Text
                              className="text-xl font-semibold text-white capitalize"
                              numberOfLines={1}
                            >
                              {`${pointHistory.bottleCount} bottle${
                                pointHistory.bottleCount > 1 ? "s" : ""
                              } recycled`}
                            </Text>
                          </View>
                          <View className="w-full overflow-hidden flex flex-row justify-start items-center">
                            <LinearGradient
                              className="flex items-center justify-center px-4 py-2 rounded-full mr-1 max-w-[60%]"
                              colors={["#D2AF26", "#BE8400"]}
                            >
                              <Text
                                className="text-xs font-normal text-white"
                                numberOfLines={1}
                              >
                                {user?.personalInfo
                                  ? `${user.personalInfo.firstName} ${user.personalInfo.lastName}`
                                  : "Unknown User"}
                              </Text>
                            </LinearGradient>
                            <LinearGradient
                              className="flex items-center justify-center px-4 py-2 rounded-full max-w-[40%]"
                              colors={["#00674F", "#06402B"]}
                            >
                              <Text
                                className="text-xs font-normal text-white"
                                numberOfLines={1}
                              >
                                {(() => {
                                  const date = new Date(
                                    pointHistory.dateDisposed
                                  );
                                  return isNaN(date.getTime())
                                    ? "Invalid Date"
                                    : date.toLocaleDateString("en-US");
                                })()}
                              </Text>
                            </LinearGradient>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <View className="w-full pb-32 "></View>
      </ScrollView>

      <StatusBar style="auto" />
      {loading && <Loader />}
    </SafeAreaView>
  );
};

export default History;
