import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import axios from "axios";

// ! install expo-image if not yet installed
import { Image } from "expo-image";

const redeem = () => {
  // ! DON'T FORGET TO MODIFY THIS UR OWN IP AND PORT
  const URL = "http://192.168.121.149:8080/api/";

  interface Reward {
    _id: string;
    rewardName: string;
    rewardDescription: string;
    image: string;
    pointsRequired: string;
    stocks: string;
    category: string;
  }

  const [data, setData] = useState<Reward[]>([
    {
      _id: "",
      rewardName: "",
      rewardDescription: "",
      image: "",
      pointsRequired: "",
      stocks: "",
      category: "",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(URL + "rewards");
        setData(response.data.rewards);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <ScrollView className="flex-1 w-full flex  bg-[#F6F6F6] px-8 p-6">
      <SafeAreaView className="flex-1 pb-32">
        <LinearGradient
          colors={["#050301", "#383838"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          className="relative w-full px-6 py-4 rounded-xl flex items-center justify-center mb-1"
        >
          <View className="w-full pb-12">
            <Text className="text-sm font-normal text-white">
              Available Points
            </Text>
          </View>
          <View className="w-full">
            <Text className="font-bold text-white text-3xl">1,200 pts.</Text>
          </View>
          <View
            className="absolute bottom-[-20px] right-0"
            style={{ opacity: 0.2 }}
          >
            <MaterialIcons name="currency-ruble" size={120} color={"white"} />
          </View>
        </LinearGradient>

        <View className="w-full flex flex-row py-3 mb-1">
          <ScrollView
            horizontal={true}
            className="w-full flex flex-row"
            showsHorizontalScrollIndicator={false}
          >
            <View className="px-6 py-3 bg-[#E1E1E1] flex items-center justify-center mr-2 rounded-xl">
              <Text className="text-sm font-normal">Sample</Text>
            </View>
            <View className="px-6 py-3 bg-[#E1E1E1] flex items-center justify-center mr-2 rounded-xl">
              <Text className="text-sm font-normal">Sample</Text>
            </View>
            <View className="px-6 py-3 bg-[#E1E1E1] flex items-center justify-center mr-2 rounded-xl">
              <Text className="text-sm font-normal">Sample</Text>
            </View>
            <View className="px-6 py-3 bg-[#E1E1E1] flex items-center justify-center mr-2 rounded-xl">
              <Text className="text-sm font-normal">Sample</Text>
            </View>
            <View className="px-6 py-3 bg-[#E1E1E1] flex items-center justify-center mr-2 rounded-xl">
              <Text className="text-sm font-normal">Sample</Text>
            </View>
          </ScrollView>
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
        </View>

        <View className="w-full flex items-start justify-start pt-4 pb-2">
          <Text className="text-xl font-semibold">Redeemable Items</Text>
          <Text className="text-sm font-normal text-black/50">
            Choose a Reward of your choice
          </Text>
        </View>

        <View className="w-full flex flex-row flex-wrap items-center justify-between">
          {data !== null && data.length !== 0
            ? data.map((item) => (
                <View
                  className="w-[48%] h-[200px] overflow-hidden mb-3"
                  key={item._id}
                >
                  <View className="w-full h-[70%] flex items-center justify-center bg-gray-400 rounded-xl overflow-hidden">
                    <Image
                      source={{
                        uri: URL + "images/" + item.image,
                      }}
                      className="w-full flex-1"
                    />
                  </View>
                  <View className="w-full px-1 py-3 flex flex-row items-center justify-between ">
                    <View className="max-w-[60%]">
                      <Text
                        className="text-sm font-semibold text-black"
                        numberOfLines={1}
                      >
                        {item.rewardName}
                      </Text>
                      <Text
                        className="text-xs font-normal text-black"
                        numberOfLines={1}
                      >
                        {item.pointsRequired}
                      </Text>
                    </View>
                    <TouchableOpacity className="flex items-center justify-center">
                      <LinearGradient
                        colors={["#00674F", "#06402B"]}
                        className="p-3 rounded-full shadow shadow-[#050301]"
                      >
                        <MaterialCommunityIcons
                          name="basket-check-outline"
                          color={"white"}
                          size={16}
                        />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            : null}
        </View>
      </SafeAreaView>
      <StatusBar style="auto" />
    </ScrollView>
  );
};

export default redeem;
