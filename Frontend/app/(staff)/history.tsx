import {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  Pressable,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/loader";
import { LinearGradient } from "expo-linear-gradient";
import { useAdminHistory } from "@/context/AdminHistoryProvider";
import { useUsers } from "@/context/UsersProvider";
import { Image, ImageBackground } from "expo-image";
import RewardHistoryAdd from "@/components/admin/history/rewards/RewardHistoryAdd";
import RewardHistoryEdit from "@/components/admin/history/rewards/RewardHistoryEdit";
import Modal from "@/components/modal";
import PointsHistoryAdd from "@/components/admin/history/points/PointsHistoryAdd";
import PointsHistoryEdit from "@/components/admin/history/points/PointsHistoryEdit";
import { useRewards } from "@/context/RewardsProvider";
import { useUrl } from "@/context/UrlProvider";

const History = () => {
  const { ipAddress, port } = useUrl();
  const { user } = useAuth();
  const { fetchRewards, rewards } = useRewards();
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const [redeemables, setRedeemables] = useState<RedeemableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    pointsHistory,
    rewardsHistory,
    fetchAllPointsHistory,
    fetchAllRewardsHistory,
    searchRewardHistory,
    searchPointHistory,
    fetchAllHistory,
  } = useAdminHistory();
  const { users, getUsers } = useUsers();
  const [userSearch, setUserSearch] = useState("");
  const [searchType, setSearchType] = useState(true);
  const [rewardAdd, setRewardAdd] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);

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
    userInfo: {
      personalInfo: {
        firstName: string;
        lastName: string;
      };
    };
  }

  interface PointsHistory {
    _id: string;
    userId: string;
    dateDisposed: Date;
    pointsAccumulated: number;
    bottleCount: number;
    userInfo: {
      personalInfo: {
        firstName: string;
        lastName: string;
      };
    };
  }

  interface RedeemableItem {
    _id: string;
    rewardName: string;
    image: string;
  }

  interface Item {
    _id: string;
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        await fetchAllHistory();
        await getUsers();
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchType = async () => {
    setLoading(true);

    try {
      setSearchType(!searchType);

      if (searchType) {
        await fetchAllRewardsHistory();
        await searchPointHistory(userSearch);
      } else {
        await fetchAllPointsHistory();
        await searchRewardHistory(userSearch);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (text: string) => {
    setUserSearch(text);
    setLoading(true);

    try {
      if (text.trim() === "") {
        await fetchAllPointsHistory();
        await fetchAllRewardsHistory();
      } else {
        if (searchType) {
          await searchRewardHistory(text);
        } else {
          await searchPointHistory(text);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
          <Text className="text-xl font-semibold">History</Text>
        </View>
        <View className="w-full flex flex-row items-center justify-between px-4 py-4">
          <View className="w-full flex flex-row items-center justify-between pl-6 pr-4 py-3 rounded-full bg-[#E6E6E6]">
            <View className="w-6/12 flex-row items-center justify-start">
              <Feather name="search" size={16} color={"rgba(0, 0, 0, 0.5)"} />
              <TextInput
                value={userSearch}
                className="w-full bg-[#E6E6E6] text-xs font-normal pl-2"
                placeholder="search for a user's history"
                onChangeText={handleSearch}
              />
            </View>
            <Pressable
              className="w-4/12 px-4 py-2 flex flex-row items-center justify-between rounded-full bg-[#050301]"
              onPress={handleSearchType}
            >
              <Text
                className="text-xs font-normal text-white"
                numberOfLines={1}
              >
                {searchType ? "Rewards" : "Points"}
              </Text>
              <Feather name="rotate-cw" size={16} color={"white"} />
            </Pressable>
          </View>
        </View>
        <ScrollView
          className="flex-1 w-full"
          showsVerticalScrollIndicator={false}
        >
          {/* Titlebar */}
          <View className="w-full flex items-center justify-center pt-4">
            <View className="w-full flex flex-row items-start justify-between px-4 pb-4">
              <View className="w-3/4 flex items-start justify-center">
                <Text className="text-xl font-semibold" numberOfLines={1}>
                  Rewards History
                </Text>
                <Text
                  className="text-xs font-normal text-black/50"
                  numberOfLines={1}
                >
                  all records of redeemed rewards
                </Text>
              </View>
              <View className="w-1/4 flex items-end justify-center">
                <Pressable
                  className="p-2 bg-[#050301] rounded-full"
                  onPress={() => setRewardAdd(true)}
                >
                  <Feather name="plus" size={16} color={"white"} />
                </Pressable>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex w-full"
            >
              {rewardsHistory.length > 0 ? (
                rewardsHistory.map(
                  (rewardHistory: RewardsHistory, index: number) => {
                    const reward = rewards.find(
                      (reward: RedeemableItem) =>
                        reward._id === rewardHistory.rewardId
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
                                    className="text-xl font-semibold text-white capitalize max-w-[60%]"
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
                                    colors={["#D2AF26", "#BE8400"]}
                                  >
                                    <Text
                                      className="text-xs font-normal text-white"
                                      numberOfLines={1}
                                    >
                                      {`${rewardHistory.userInfo.personalInfo.firstName} ${rewardHistory.userInfo.personalInfo.lastName}`}
                                    </Text>
                                  </LinearGradient>
                                  <LinearGradient
                                    className="flex items-center justify-center px-4 py-2 rounded-full max-w-[30%]"
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
          </View>
          <View className="w-full flex items-center justify-center pt-6">
            <View className="w-full flex flex-row items-start justify-between px-4 pb-4">
              <View className="w-3/4 flex items-start justify-center">
                <Text className="text-xl font-semibold" numberOfLines={1}>
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
                  (pointHistory: PointsHistory, index: number) => {
                    const reward = rewards.find(
                      (reward: RedeemableItem) => reward._id === "hehe"
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
                                    className="text-xl font-semibold text-white capitalize"
                                    numberOfLines={1}
                                  >
                                    {`${pointHistory.userInfo.personalInfo.firstName} ${pointHistory.userInfo.personalInfo.lastName}`}
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
                                      {`${pointHistory.bottleCount} ${
                                        pointHistory.bottleCount > 1
                                          ? "bottles"
                                          : "bottle"
                                      }`}
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
          </View>
          <View className="pb-32"></View>
        </ScrollView>
      </>
      {loading && <Loader />}
      {rewardAdd && (
        <RewardHistoryAdd
          onClose={() => {
            setRewardAdd(false);
            setUserSearch("");
          }}
        />
      )}
      {visibleModal && (
        <Modal
          header="History"
          icon="history"
          message={message}
          isVisible={visibleModal}
          onClose={() => setVisibleModal(false)}
        />
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default History;
