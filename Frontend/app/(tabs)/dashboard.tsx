import {
  View,
  Text,
  ImageBackground,
  TextInput,
  Pressable,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import React from "react";
import { MaterialIcons, Octicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const dashboard = () => {
  const startNavigation = () => {};

  return (
    <View className="flex-1 w-full flex items-center justify-center">
      <View className="flex-1 w-full">
        <ImageBackground
          className="w-full flex-1 relative"
          source={require("../../assets/images/Map.jpg")}
        >
          <View className="absolute flex items-center h-[50vh] rounded-t-3xl justify-start w-full left-0 bottom-0 bg-[#F6F6F6] px-6 py-10">
            <View className="w-full flex items-center justify-center pb-6">
              <Text className="font-bold text-lg">Dashboard</Text>
              <Text className="font-normal text-xs text-black/50">
                Allow location access to provide accurate data
              </Text>
            </View>

            <View className="w-full flex flex-row items-center justify-between bg-[#E1E1E1] rounded-xl p-5 mt-2">
              <View className="w-1/3 flex flex-row items-center justify-start">
                <View className="pr-2">
                  <Octicons name="location" size={16} />
                </View>
                <Text
                  className="text-xs font-semibold text-black"
                  numberOfLines={1}
                >
                  BottleBot
                </Text>
              </View>
              <View className="w-2/3 flex items-end justify-center">
                <Text
                  className="text-xs font-normal text-black/50"
                  numberOfLines={1}
                >
                  #00 Sample St. 0ave., Sample City
                </Text>
              </View>
            </View>

            <View className="w-full flex flex-row items-center justify-between bg-[#E1E1E1] rounded-xl p-5 mt-2">
              <View className="w-1/3 flex flex-row items-center justify-start">
                <View className="pr-2">
                  <MaterialIcons name="location-history" size={16} />
                </View>
                <Text
                  className="text-xs font-semibold text-black"
                  numberOfLines={1}
                >
                  User (You)
                </Text>
              </View>
              <View className="w-2/3 flex items-end justify-center">
                <Text
                  className="text-xs font-normal text-black/50"
                  numberOfLines={1}
                >
                  #00 Sample St. 0ave., Sample City
                </Text>
              </View>
            </View>

            <View className="w-full flex items-center justify-center py-4">
              <TouchableHighlight
                className="w-full flex items-center justify-center rounded-xl"
                underlayColor={"#41917F"}
                onPress={startNavigation}
              >
                <LinearGradient
                  colors={["#00674F", "#06402B"]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  className="w-full  rounded-xl shadow shadow-[#050301]"
                >
                  <Text className="flex py-4 bg-transparent text-center text-sm text-white font-semibold">
                    Start Navigation
                  </Text>
                </LinearGradient>
              </TouchableHighlight>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default dashboard;
