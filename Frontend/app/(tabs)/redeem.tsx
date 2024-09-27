import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Pressable,
  TouchableHighlight,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const redeem = () => {
  const [redeemables, setRedeemables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [navigateHistory, setNavigateHistory] = useState(false);
  const [pointsPage, setPointsPage] = useState(false);
  const [user, setUser] = useState<user | null>(null);

  interface Item {
    _id: string;
    name: string;
    category: string;
    image: string;
    pointsRequired: number;
    rewardName: string;
    stocks: number;
  }

  interface user {
    _id: string;
    personalInfo: {
      firstName: string;
      lastName: string;
    };
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await AsyncStorage.getItem("user");

      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    const fetchRewards = async () => {
      try {
        let url = "http://192.168.254.139:3000/api/rewards";

        let response = await axios.get(url);
        setRedeemables(response.data.rewards);
        setCategories(response.data.rewards.map((item: Item) => item.category));
      } catch (err) {
        console.log(err);
      }
    };

    fetchRewards();
    fetchUserData();
  }, []);

  console.log(redeemables);

  const toggleHistoryPage = () => {
    setPointsPage(!pointsPage);
  };

  const toHistory = () => {
    setNavigateHistory(true);
  };
  const toRedeem = () => {
    setNavigateHistory(false);
  };
  const redeemItem = () => {};

  return (
    <ScrollView
      className="flex-1 w-full flex  bg-[#F6F6F6] px-6 py-4"
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView className="flex-1 pb-32">
        {!navigateHistory ? (
          <>
            {/* points */}
            <LinearGradient
              colors={["#050301", "#757575"]}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              className="w-full p-6 rounded-xl flex items-center justify-center mb-1"
            >
              <View className="w-full flex flex-row items-center justify-start">
                <View className="w-[50px] h-[50px] rounded-full bg-white overflow-hidden mr-2">
                  <Image
                    source={require("../../assets/images/Man.jpg")}
                    className="w-full h-full"
                  ></Image>
                </View>
                <View className="w-full flex items-start justify-center">
                  <Text
                    className="text-sm font-semibold text-white pb-1"
                    numberOfLines={1}
                  >
                    {!user
                      ? "Loading"
                      : `${user.personalInfo.firstName} ${user.personalInfo.lastName}`}
                  </Text>
                  <View className="flex items-center justify-center px-2 py-1 bg-[#E1E1E1] rounded-md">
                    <Text
                      className="text-[10px] font-normal text-black uppercase"
                      numberOfLines={1}
                    >
                      {!user ? "Loading" : `#${user._id}`}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="w-full flex flex-row items-end justify-end pt-12">
                <View className="pr-1">
                  <MaterialCommunityIcons
                    name="currency-rub"
                    size={14}
                    color="rgba(255, 255, 255, 0.5)"
                  />
                </View>
                <Text className="text-xs font-normal text-white/50 pr-2">
                  Redeemable Points
                </Text>
                <Text className="text-sm font-semibold text-white">0.00</Text>
              </View>
            </LinearGradient>
            {/* categories */}
            <View className="w-full flex flex-row py-3 mb-1">
              <ScrollView
                horizontal={true}
                className="w-full flex flex-row"
                showsHorizontalScrollIndicator={false}
              >
                {categories.map((item, index) => (
                  <View
                    className="px-6 py-3 bg-[#E1E1E1] flex items-center justify-center mr-2 rounded-xl"
                    key={index}
                  >
                    <Text className="text-sm font-normal">{item}</Text>
                  </View>
                ))}
              </ScrollView>
              <TouchableHighlight
                underlayColor={"#41917F"}
                className="rounded-xl"
                onPress={toHistory}
              >
                <LinearGradient
                  colors={["#00674F", "#06402B"]}
                  className="p-3 bg-[#E1E1E1] rounded-xl"
                >
                  <MaterialIcons
                    name="auto-graph"
                    size={20}
                    color={"white"}
                  ></MaterialIcons>
                </LinearGradient>
              </TouchableHighlight>
            </View>
            {/* redeemable items */}
            <View className="w-full flex items-start justify-start pt-4 pb-2">
              <Text className="text-xl font-semibold">Redeemable Items</Text>
              <Text className="text-sm font-normal text-black/50">
                Choose a Reward of your choice
              </Text>
            </View>
            <View className="w-full flex flex-row flex-wrap items-center justify-between">
              {redeemables.map((item: Item, index) => (
                <View
                  className="w-[48%] h-[200px] overflow-hidden mb-3"
                  key={item._id}
                >
                  <View className="w-full h-[70%] flex items-center justify-center bg-gray-400 rounded-xl overflow-hidden">
                    <Image
                      className="w-full flex-1"
                      source={{
                        uri: `http://192.168.254.139:3000/api/images/${item.image}`,
                      }}
                      onError={(error) => {
                        console.log(
                          "Image failed to load:",
                          error.nativeEvent.error
                        );
                      }}
                    ></Image>
                  </View>
                  <View className="w-full px-1 py-3 flex flex-row items-center justify-between ">
                    <View className="max-w-[60%]">
                      <Text
                        className="text-sm font-semibold text-black capitalize"
                        numberOfLines={1}
                      >
                        {item.rewardName}
                      </Text>
                      <Text
                        className="text-xs font-normal text-black"
                        numberOfLines={1}
                      >
                        {item.pointsRequired} pt.
                      </Text>
                    </View>
                    <TouchableHighlight
                      className="flex items-center justify-center rounded-xl"
                      underlayColor={"#41917F"}
                      onPress={redeemItem}
                    >
                      <LinearGradient
                        colors={["#00674F", "#06402B"]}
                        className="p-2 rounded-xl shadow shadow-[#050301]"
                      >
                        <Ionicons
                          name="return-down-forward"
                          color={"white"}
                          size={18}
                        />
                      </LinearGradient>
                    </TouchableHighlight>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            {/* Titlebar */}
            <View className="relative w-full flex flex-row items-center justify-center py-2">
              <TouchableHighlight
                underlayColor={"#C9C9C9"}
                className="absolute left-0 rounded-full"
                onPress={toRedeem}
              >
                <View className="p-2 bg-[#E1E1E1] rounded-full flex items-center justify-center">
                  <Ionicons name="chevron-back" size={18} />
                </View>
              </TouchableHighlight>
              <Text className="text-xl font-semibold">History</Text>
            </View>
            {/* ToggleBar */}
            <View className="w-full flex items-center justify-center my-6">
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
            {!pointsPage ? (
              <>
                <View className="w-full flex items-center justify-center py-2">
                  {/* Title Section */}
                  <View className="w-full flex items-start justify-center py-2">
                    <Text className="text-xl font-semibold">
                      Rewards History
                    </Text>
                    <Text className="text-xs font-normal text-black/50">
                      your record of rewards redeemed
                    </Text>
                  </View>
                  {/* Reward Cards */}
                  <View className="w-full flex items-center justify-center py-2">
                    <View className="w-full bg-[#E1E1E1] p-6 rounded-xl mb-4">
                      <View className="w-full flex flex-row justify-between items-center pb-3">
                        <Text className="text-xs font-normal text-black/50">
                          Today, 12:00 AM
                        </Text>
                        <Text className="text-xs font-normal text-black/50">
                          #Redeem ID
                        </Text>
                      </View>
                      <View className="w-full flex flex-row items-end justify-between pt-3">
                        <Text className="text-lg text-[#00674F] font-semibold">
                          Reward Name
                        </Text>
                        <Text className="text-sm font-normal">200pts.</Text>
                      </View>
                    </View>
                    <View className="w-full bg-[#E1E1E1] p-6 rounded-xl mb-4">
                      <View className="w-full flex flex-row justify-between items-center pb-3">
                        <Text className="text-xs font-normal text-black/50">
                          Today, 12:00 AM
                        </Text>
                        <Text className="text-xs font-normal text-black/50">
                          #Redeem ID
                        </Text>
                      </View>
                      <View className="w-full flex flex-row items-end justify-between pt-3">
                        <Text className="text-lg text-[#00674F] font-semibold">
                          Reward Name
                        </Text>
                        <Text className="text-sm font-normal">200pts.</Text>
                      </View>
                    </View>
                    <View className="w-full bg-[#E1E1E1] p-6 rounded-xl mb-4">
                      <View className="w-full flex flex-row justify-between items-center pb-3">
                        <Text className="text-xs font-normal text-black/50">
                          Today, 12:00 AM
                        </Text>
                        <Text className="text-xs font-normal text-black/50">
                          #Redeem ID
                        </Text>
                      </View>
                      <View className="w-full flex flex-row items-end justify-between pt-3">
                        <Text className="text-lg text-[#00674F] font-semibold">
                          Reward Name
                        </Text>
                        <Text className="text-sm font-normal">200pts.</Text>
                      </View>
                    </View>
                    <View className="w-full bg-[#E1E1E1] p-6 rounded-xl mb-4">
                      <View className="w-full flex flex-row justify-between items-center pb-3">
                        <Text className="text-xs font-normal text-black/50">
                          Today, 12:00 AM
                        </Text>
                        <Text className="text-xs font-normal text-black/50">
                          #Redeem ID
                        </Text>
                      </View>
                      <View className="w-full flex flex-row items-end justify-between pt-3">
                        <Text className="text-lg text-[#00674F] font-semibold">
                          Reward Name
                        </Text>
                        <Text className="text-sm font-normal">200pts.</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <>
                <View className="w-full flex items-center justify-center py-2">
                  {/* Title Section */}
                  <View className="w-full flex items-start justify-center py-2">
                    <Text className="text-xl font-semibold">
                      Points History
                    </Text>
                    <Text className="text-xs font-normal text-black/50">
                      your record of accumulated points
                    </Text>
                  </View>
                  {/* Reward Cards */}
                  <View className="w-full flex items-center justify-center py-2">
                    <View className="w-full bg-[#E1E1E1] p-6 rounded-xl mb-4">
                      <View className="w-full flex flex-row justify-between items-center pb-3">
                        <Text className="text-xs font-normal text-black/50">
                          Today, 12:00 AM
                        </Text>
                        <Text className="text-xs font-normal text-black/50">
                          #Designated ID
                        </Text>
                      </View>
                      <View className="w-full flex flex-row items-end justify-start pt-3">
                        <Text className="text-lg text-[#00674F] font-semibold">
                          Number of Points
                        </Text>
                      </View>
                    </View>
                    <View className="w-full bg-[#E1E1E1] p-6 rounded-xl mb-4">
                      <View className="w-full flex flex-row justify-between items-center pb-3">
                        <Text className="text-xs font-normal text-black/50">
                          Today, 12:00 AM
                        </Text>
                        <Text className="text-xs font-normal text-black/50">
                          #Designated ID
                        </Text>
                      </View>
                      <View className="w-full flex flex-row items-end justify-start pt-3">
                        <Text className="text-lg text-[#00674F] font-semibold">
                          Number of Points
                        </Text>
                      </View>
                    </View>
                    <View className="w-full bg-[#E1E1E1] p-6 rounded-xl mb-4">
                      <View className="w-full flex flex-row justify-between items-center pb-3">
                        <Text className="text-xs font-normal text-black/50">
                          Today, 12:00 AM
                        </Text>
                        <Text className="text-xs font-normal text-black/50">
                          #Designated ID
                        </Text>
                      </View>
                      <View className="w-full flex flex-row items-end justify-start pt-3">
                        <Text className="text-lg text-[#00674F] font-semibold">
                          Number of Points
                        </Text>
                      </View>
                    </View>
                    <View className="w-full bg-[#E1E1E1] p-6 rounded-xl mb-4">
                      <View className="w-full flex flex-row justify-between items-center pb-3">
                        <Text className="text-xs font-normal text-black/50">
                          Today, 12:00 AM
                        </Text>
                        <Text className="text-xs font-normal text-black/50">
                          #Designated ID
                        </Text>
                      </View>
                      <View className="w-full flex flex-row items-end justify-start pt-3">
                        <Text className="text-lg text-[#00674F] font-semibold">
                          Number of Points
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </>
            )}
          </>
        )}
      </SafeAreaView>
      <StatusBar style="auto" />
    </ScrollView>
  );
};

export default redeem;
