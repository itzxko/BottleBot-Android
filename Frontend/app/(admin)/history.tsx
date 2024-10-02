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
import { Image } from "expo-image";

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
    userId: string;
    dateDisposed: Date;
    pointsAccumulated: number;
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
        {/* ToggleBar */}
        <View className="w-full flex items-center justify-center my-4">
          <View className="flex flex-row items-center justify-center p-2 bg-[#E6E6E6] rounded-full">
            <Pressable
              className={`${
                !pointsPage ? "bg-[#F6F6F6]" : "bg-[#E6E6E6]"
              } flex px-6 py-3 rounded-full`}
              onPress={toggleHistoryPage}
            >
              <Text
                className={`${
                  !pointsPage
                    ? "text-sm font-semibold text-black"
                    : "text-xs font-normal text-black/50"
                }`}
              >
                Rewards
              </Text>
            </Pressable>
            <Pressable
              className={`${
                pointsPage ? "bg-[#F6F6F6]" : "bg-[#E6E6E6]"
              } flex px-6 py-3 rounded-full`}
              onPress={toggleHistoryPage}
            >
              <Text
                className={`${
                  pointsPage
                    ? "text-sm font-semibold text-black"
                    : "text-xs font-normal text-black/50"
                }`}
              >
                Points
              </Text>
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
                    rewardsHistory.map(
                      (rewardsHistory: RewardsHistory, index: any) => {
                        const user = users.find(
                          (user: user) => user._id === rewardsHistory.userId
                        );

                        const reward = redeemables.find(
                          (reward: RedeemableItem) =>
                            reward._id === rewardsHistory.rewardId
                        );

                        const backgroundColor =
                          index % 2 === 0
                            ? ["#00674F", "#06402B"]
                            : ["#D2AF26", "#BE8400"];

                        const titleColor =
                          index % 2 === 0 ? "#00674F" : "#cca918";

                        return (
                          <View
                            className="w-full flex-row items-center justify-center bg-[#e8e8e8] mb-4 rounded-3xl overflow-hidden"
                            key={rewardsHistory._id}
                          >
                            <LinearGradient
                              colors={backgroundColor}
                              className="w-[5%] h-full"
                            ></LinearGradient>
                            <View className="w-[95%] flex items-start justify-center p-4">
                              <View className="w-full flex flex-row justify-between items-start">
                                <View className="w-1/2 flex items-start justify-center">
                                  {user ? (
                                    <Text className="text-xs font-normal text-black/50 ">
                                      {`${user.personalInfo.firstName} ${user.personalInfo.lastName}`}
                                    </Text>
                                  ) : (
                                    <Text className="text-xs font-normal text-black/50">
                                      User not Found
                                    </Text>
                                  )}
                                  {reward ? (
                                    <Text
                                      className={`text-sm font-semibold uppercase text-[${titleColor}]`}
                                    >
                                      {reward.rewardName}
                                    </Text>
                                  ) : (
                                    <Text
                                      className={`text-sm font-semibold uppercase text-[${titleColor}]`}
                                    >
                                      Reward Item Not Found
                                    </Text>
                                  )}
                                </View>
                                <Text
                                  className="w-1/2 text-right text-xs font-normal text-black/50 uppercase"
                                  numberOfLines={1}
                                >
                                  {rewardsHistory._id}
                                </Text>
                              </View>
                              <View className="w-full flex flex-row justify-between items-end pt-4">
                                <Text
                                  className="w-1/3 text-left text-xs font-normal text-black/50"
                                  numberOfLines={1}
                                >
                                  {(() => {
                                    const date = new Date(
                                      rewardsHistory.dateClaimed
                                    );
                                    return isNaN(date.getTime())
                                      ? "Invalid Date"
                                      : date.toLocaleDateString("en-US"); // Format the date as needed
                                  })()}
                                </Text>

                                <View className="w-2/3 flex flex-row-reverse items-center justify-start">
                                  <Text className="text-xs font-semibold text-black pl-1">
                                    {rewardsHistory.pointsSpent}
                                    {rewardsHistory.pointsSpent > 1
                                      ? "pts."
                                      : "pt."}
                                  </Text>
                                  {reward ? (
                                    <View className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-black overflow-hidden">
                                      <Image
                                        className="w-full flex-1"
                                        source={{
                                          uri: `http://192.168.254.139:8080/api/images/${reward.image}`,
                                        }}
                                      />
                                    </View>
                                  ) : (
                                    <Text>Not reward</Text>
                                  )}
                                </View>
                              </View>
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
                    pointsHistory.map(
                      (pointsHistory: PointsHistory, index: any) => {
                        const user = users.find(
                          (user: user) => user._id === pointsHistory.userId
                        );

                        const titleColor =
                          index % 2 === 0 ? "#00674F" : "#cca918";

                        const backgroundColor =
                          index % 2 === 0
                            ? ["#00674F", "#06402B"]
                            : ["#D2AF26", "#BE8400"];

                        return (
                          <View
                            className="w-full flex-row items-center justify-center bg-[#e8e8e8] mb-4 rounded-3xl overflow-hidden"
                            key={pointsHistory._id}
                          >
                            <LinearGradient
                              colors={backgroundColor}
                              className={`h-full w-[5%]`}
                            ></LinearGradient>
                            <View className="w-[95%] flex items-start justify-center p-4">
                              <View className="w-full flex flex-row justify-between items-start">
                                <View className="w-3/4 flex items-start justify-center">
                                  <Text
                                    className="text-xs font-normal text-black/50 uppercase"
                                    numberOfLines={1}
                                  >
                                    {pointsHistory._id}
                                  </Text>

                                  {user ? (
                                    <Text
                                      className={`text-sm font-semibold uppercase text-[${titleColor}]`}
                                    >
                                      {`${user.personalInfo.firstName} ${user.personalInfo.lastName}`}
                                    </Text>
                                  ) : (
                                    <Text
                                      className={`text-sm font-semibold uppercase text-[${titleColor}]`}
                                    >
                                      User not Found
                                    </Text>
                                  )}
                                </View>
                              </View>
                              <View className="w-full flex flex-row justify-between items-end pt-4">
                                <Text
                                  className="w-1/3 text-left text-xs font-normal text-black/50"
                                  numberOfLines={1}
                                >
                                  {(() => {
                                    const date = new Date(
                                      pointsHistory.dateDisposed
                                    );
                                    return isNaN(date.getTime())
                                      ? "Invalid Date"
                                      : date.toLocaleDateString("en-US"); // Format the date as needed
                                  })()}
                                </Text>
                                <View className="w-1/2 flex flex-row items-center justify-end">
                                  <View className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-black overflow-hidden">
                                    <Image
                                      className="w-full flex-1"
                                      source={require("../../assets/images/Man.jpg")}
                                    />
                                  </View>
                                  <Text
                                    className="pl-1 text-xs font-semibold text-black"
                                    numberOfLines={1}
                                  >
                                    {`${pointsHistory.pointsAccumulated}${
                                      pointsHistory.pointsAccumulated > 1
                                        ? "pts."
                                        : "pt."
                                    }`}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        );
                      }
                    )
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
