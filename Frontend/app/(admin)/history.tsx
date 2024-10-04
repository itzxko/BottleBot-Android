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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/loader";
import { LinearGradient } from "expo-linear-gradient";
import { useAdminHistory } from "@/context/AdminHistoryProvider";
import { useUsers } from "@/context/UsersProvider";
import { red } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { Image, ImageBackground } from "expo-image";
import { useUrl } from "@/context/UrlProvider";

const History = () => {
  const { user } = useAuth();
  const [pointsPage, setPointsPage] = useState(false);
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const [redeemables, setRedeemables] = useState<RedeemableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    pointsHistory,
    rewardsHistory,
    fetchAllPointsHistory,
    fetchAllRewardsHistory,
  } = useAdminHistory();
  const { users, getUsers } = useUsers();
  const { ipAddress, port } = useUrl();

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

  const toggleHistoryPage = () => {
    setPointsPage(!pointsPage);
  };

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
      try {
        await fetchAllPointsHistory();
        await fetchAllRewardsHistory();
        await getUsers();
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false); // Ensure loading is set to false in both success and error cases
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView className="flex-1 px-4 bg-[#F0F0F0]">
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
        <View className="w-full flex items-center justify-center pt-6">
          <View className="w-full flex items-start justify-center pb-4">
            <Text className="text-xl font-semibold">Rewards History</Text>
            <Text className="text-xs font-normal text-black/50">
              all records of redeemed rewards
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex"
          >
            {rewardsHistory.map((rewardHistory: RewardsHistory) => {
              const reward = redeemables.find(
                (reward: RedeemableItem) =>
                  reward._id === rewardHistory.rewardId
              );

              return (
                <View
                  className=" bg-slate-500 rounded-[32px] w-[320px] h-[240px] overflow-hidden mr-4"
                  key={rewardHistory._id}
                >
                  <ImageBackground
                    className="w-full h-full "
                    source={
                      reward
                        ? {
                            uri: `http://192.168.254.139:8080/api/images/${reward.image}`,
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
                                {`${rewardHistory.userInfo.personalInfo.firstName} ${rewardHistory.userInfo.personalInfo.lastName}`}
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
            })}
          </ScrollView>
        </View>
        <View className="w-full flex items-center justify-center pt-6">
          <View className="w-full flex items-start justify-center pb-4">
            <Text className="text-xl font-semibold">Points History</Text>
            <Text className="text-xs font-normal text-black/50">
              all records of collected points
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex"
          >
            {pointsHistory.map((pointHistory: PointsHistory) => {
              const reward = redeemables.find(
                (reward: RedeemableItem) => reward._id === "hehe"
              );

              return (
                <View
                  className=" bg-slate-500 rounded-[32px] w-[320px] h-[240px] overflow-hidden mr-4"
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
            })}
          </ScrollView>
        </View>
      </>
      {loading && <Loader />}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default History;
