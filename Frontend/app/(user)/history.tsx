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
import axios from "axios";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/loader";
import { LinearGradient } from "expo-linear-gradient";
import { useHistory } from "@/context/UserHistoryProvider";
import { ImageBackground } from "expo-image";
import { useUrl } from "@/context/UrlProvider";
import { usePagination } from "@/context/PaginationProvider";
import RemixIcon from "react-native-remix-icon";

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
    getPointsHistory,
    getRewardsHistory,
    pointsTotalPages,
    rewardTotalPages,
  } = useHistory();
  const { ipAddress, port } = useUrl();
  const [rewardCurrentPage, setRewardCurrentPage] = useState(1);
  const [pointCurrentPage, setPointCurrentPage] = useState(1);
  const { historyLimit } = usePagination();

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

  console.log(user);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await getRewardsHistory(user, rewardCurrentPage, historyLimit);
        await getPointsHistory(user, pointCurrentPage, historyLimit);
      } catch (error: any) {
        console.log(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePointPageChange = async (newPage: number) => {
    if (newPage >= 1 && newPage <= pointsTotalPages) {
      setPointCurrentPage(newPage);
      setLoading(true);

      try {
        getPointsHistory(user, newPage, historyLimit);
      } catch (error) {
        console.error("Error fetching rewards:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRewardPageChange = async (newPage: number) => {
    if (newPage >= 1 && newPage <= rewardTotalPages) {
      setRewardCurrentPage(newPage);
      setLoading(true);

      try {
        getRewardsHistory(user, newPage, historyLimit);
      } catch (error) {
        console.error("Error fetching rewards:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F0F0F0]">
      <>
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
          <Text className="text-sm font-semibold">History</Text>
        </View>
        <ScrollView
          className="flex-1 w-full"
          showsVerticalScrollIndicator={false}
        >
          {/* Titlebar */}
          <View className="w-full flex items-center justify-center pt-4">
            <View className="w-full flex flex-row items-start justify-between px-4 pb-4">
              <View className="w-3/4 flex items-start justify-center">
                <Text className="text-sm font-semibold" numberOfLines={1}>
                  Rewards History
                </Text>
                <Text
                  className="text-xs font-normal text-black/50"
                  numberOfLines={1}
                >
                  all records of redeemed rewards
                </Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex w-full"
            >
              {rewardsHistory.length > 0 ? (
                rewardsHistory.map(
                  (rewardHistory: RewardHistory, index: number) => {
                    const reward = redeemables.find(
                      (reward: Reward) => reward._id === rewardHistory.rewardId
                    );

                    const firstItem = index === 0;
                    const lastItem = index === pointsHistory.length - 1;

                    const margin = firstItem
                      ? "mx-4"
                      : lastItem
                      ? "mr-4"
                      : "mr-4";

                    return (
                      <View
                        className={`bg-slate-500 rounded-[32px] w-[320px] h-[240px] overflow-hidden ${margin}`}
                        key={rewardHistory._id}
                      >
                        <ImageBackground
                          className="w-full h-full "
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
                              "rgba(18, 18, 18, 0)",
                              "rgba(18, 18, 18, 0.6)",
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                          >
                            <View className="flex flex-col h-full justify-between">
                              <View className="w-full flex flex-row items-start justify-between">
                                <Text
                                  className="text-xs font-normal text-white/50 uppercase max-w-[50%]"
                                  numberOfLines={1}
                                >
                                  #{rewardHistory._id}
                                </Text>
                              </View>
                              <View className="w-full flex items-start justify-center">
                                <View className="w-full flex flex-row items-center justify-start pb-4">
                                  <Text
                                    className="text-sm font-semibold text-white capitalize max-w-[60%]"
                                    numberOfLines={1}
                                  >
                                    {reward?.rewardName}
                                  </Text>
                                  <Text className="text-xs font-normal text-white/50 uppercase max-w-[30%] pl-2">
                                    {`${rewardHistory.pointsSpent} ${
                                      rewardHistory.pointsSpent > 1
                                        ? "pts."
                                        : "pt."
                                    }`}
                                  </Text>
                                </View>
                                <View className="w-full overflow-hidden flex flex-row justify-start items-center">
                                  <LinearGradient
                                    className="flex items-center justify-center px-4 py-2 rounded-full mr-1 max-w-[60%]"
                                    colors={["#699900", "#466600"]}
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
                                    className="flex items-center justify-center px-4 py-2 rounded-full max-w-[30%]"
                                    colors={["#699900", "#466600"]}
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
                )
              ) : (
                <View className="flex w-[100vw] h-[240px] items-center justify-center">
                  <View className="p-3 mb-2 rounded-full bg-black">
                    <Feather name="cloud-off" size={20} color={"white"} />
                  </View>
                  <Text className="text-xs font-normal text-black/50">
                    No Rewards History Available
                  </Text>
                </View>
              )}
            </ScrollView>
            {rewardTotalPages ? (
              <View className="flex flex-row space-x-2 items-center justify-center py-4">
                <Pressable
                  disabled={rewardCurrentPage === 1}
                  onPress={() => handleRewardPageChange(rewardCurrentPage - 1)}
                >
                  <RemixIcon name="arrow-left-s-line" size={16} color="black" />
                </Pressable>

                {Array.from(
                  {
                    length: Math.min(5, rewardTotalPages),
                  },
                  (_, index) => {
                    const startPage = Math.max(1, rewardCurrentPage - 2);
                    const page = startPage + index;
                    return page <= rewardTotalPages ? page : null;
                  }
                ).map(
                  (page) =>
                    page && ( // Only render valid pages
                      <Pressable
                        key={page}
                        onPress={() => handleRewardPageChange(page)}
                        className="p-2"
                      >
                        <Text
                          className={
                            rewardCurrentPage === page
                              ? "text-lg font-semibold text-[#466600]"
                              : "text-xs font-semibold text-black"
                          }
                        >
                          {page}
                        </Text>
                      </Pressable>
                    )
                )}

                <Pressable
                  disabled={rewardCurrentPage === rewardTotalPages}
                  onPress={() => handleRewardPageChange(rewardCurrentPage + 1)}
                >
                  <RemixIcon
                    name="arrow-right-s-line"
                    size={16}
                    color="black"
                  />
                </Pressable>
              </View>
            ) : null}
          </View>
          <View className="w-full flex items-center justify-center pt-6">
            <View className="w-full flex flex-row items-start justify-between px-4 pb-4">
              <View className="w-3/4 flex items-start justify-center">
                <Text className="text-sm font-semibold" numberOfLines={1}>
                  Points History
                </Text>
                <Text
                  className="text-xs font-normal text-black/50"
                  numberOfLines={1}
                >
                  all records of collected points
                </Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex w-full"
            >
              {pointsHistory.length > 0 ? (
                pointsHistory.map(
                  (pointHistory: PointHistory, index: number) => {
                    const reward = redeemables.find(
                      (reward: Reward) => reward._id === "hehe"
                    );

                    const firstItem = index === 0;
                    const lastItem = index === pointsHistory.length - 1;

                    const margin = firstItem
                      ? "mx-4"
                      : lastItem
                      ? "mr-4"
                      : "mr-4";

                    return (
                      <View
                        className={`bg-slate-500 rounded-[32px] w-[320px] h-[240px] overflow-hidden mr-4 ${margin}`}
                        key={pointHistory._id}
                      >
                        <ImageBackground
                          className="w-full h-full "
                          source={
                            reward
                              ? {
                                  uri: `http://192.168.254.139:8080/api/images/${reward.image}`,
                                }
                              : require("../../assets/images/Man.jpg")
                          }
                        >
                          <LinearGradient
                            className="w-full h-full p-5"
                            colors={[
                              "rgba(18, 18, 18, 0)",
                              "rgba(18, 18, 18, 0.6)",
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                          >
                            <View className="flex flex-col h-full justify-between">
                              <View className="w-full flex flex-row items-start justify-between">
                                <Text
                                  className="text-xs font-normal text-white/50 uppercase max-w-[50%]"
                                  numberOfLines={1}
                                >
                                  #{pointHistory._id}
                                </Text>
                              </View>
                              <View className="w-full flex items-start justify-center">
                                <View className="w-full flex items-start justify-center pb-4">
                                  <Text
                                    className="text-sm font-semibold text-white capitalize"
                                    numberOfLines={1}
                                  >
                                    {user?.personalInfo
                                      ? `${user.personalInfo.firstName} ${user.personalInfo.lastName}`
                                      : "Unknown User"}
                                  </Text>
                                </View>
                                <View className="w-full overflow-hidden flex flex-row justify-start items-center">
                                  <LinearGradient
                                    className="flex items-center justify-center px-4 py-2 rounded-full mr-1 max-w-[60%]"
                                    colors={["#699900", "#466600"]}
                                  >
                                    <Text
                                      className="text-xs font-normal text-white"
                                      numberOfLines={1}
                                    >
                                      {`${pointHistory.bottleCount} ${
                                        pointHistory.bottleCount > 1
                                          ? "bottles"
                                          : "bottle"
                                      }`}
                                    </Text>
                                  </LinearGradient>
                                  <LinearGradient
                                    className="flex items-center justify-center px-4 py-2 rounded-full max-w-[40%]"
                                    colors={["#699900", "#466600"]}
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
                  }
                )
              ) : (
                <View className="flex w-[100vw] h-[240px] items-center justify-center">
                  <View className="p-3 mb-2 rounded-full bg-black">
                    <Feather name="cloud-off" size={20} color={"white"} />
                  </View>
                  <Text className="text-xs font-normal text-black/50">
                    No Points History Available
                  </Text>
                </View>
              )}
            </ScrollView>
            {pointsTotalPages ? (
              <View className="flex flex-row space-x-2 items-center justify-center py-4">
                <Pressable
                  disabled={pointCurrentPage === 1}
                  onPress={() => handlePointPageChange(pointCurrentPage - 1)}
                >
                  <RemixIcon name="arrow-left-s-line" size={16} color="black" />
                </Pressable>

                {Array.from(
                  {
                    length: Math.min(5, pointsTotalPages),
                  },
                  (_, index) => {
                    const startPage = Math.max(1, pointCurrentPage - 2);
                    const page = startPage + index;
                    return page <= pointsTotalPages ? page : null;
                  }
                ).map(
                  (page) =>
                    page && ( // Only render valid pages
                      <Pressable
                        key={page}
                        onPress={() => handlePointPageChange(page)}
                        className="p-2"
                      >
                        <Text
                          className={
                            pointCurrentPage === page
                              ? "text-lg font-semibold text-[#466600]"
                              : "text-xs font-semibold text-black"
                          }
                        >
                          {page}
                        </Text>
                      </Pressable>
                    )
                )}

                <Pressable
                  disabled={pointCurrentPage === pointsTotalPages}
                  onPress={() => handlePointPageChange(pointCurrentPage + 1)}
                >
                  <RemixIcon
                    name="arrow-right-s-line"
                    size={16}
                    color="black"
                  />
                </Pressable>
              </View>
            ) : null}
          </View>
          <View className="pb-32"></View>
        </ScrollView>
      </>
      {loading && <Loader />}

      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default History;
