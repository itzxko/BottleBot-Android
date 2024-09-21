import {
  View,
  Text,
  ImageBackground,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const dashboard = () => {
  return (
    <View className="flex-1 w-full flex items-center justify-center">
      <View className="flex-1 w-full">
        <ImageBackground
          className="w-full flex-1 relative"
          source={require("../../assets/images/map.jpg")}
        >
          <View className="absolute flex items-center h-[55vh] rounded-t-3xl justify-start w-full left-0 bottom-0 bg-[#F6F6F6] px-8 py-10">
            <View className="w-full flex items-center justify-center pb-6">
              <Text className="font-bold text-lg">Dashboard.</Text>
            </View>
            <View className="w-full flex items-start justify-center py-2">
              <Text className="text-sm font-semibold text-black pb-2">
                BottleBot's Location
              </Text>
              <View className="w-full flex flex-row items-center justify-center px-6 py-2 bg-[#E1E1E1] rounded-xl">
                <TextInput className="w-full" editable={false}>
                  <Text className="text-sm font-bold text-black/50">
                    Sample Text
                  </Text>
                </TextInput>

                <Octicons name="location" size={20} />
              </View>
            </View>
            <View className="w-full flex items-start justify-center py-2">
              <Text className="text-sm font-semibold text-black pb-2">
                Your Location
              </Text>
              <View className="w-full flex flex-row items-center justify-center px-6 py-2 bg-[#E1E1E1] rounded-xl">
                <TextInput className="w-full" editable={false}>
                  <Text className="text-sm font-bold text-black/50">
                    Sample Text
                  </Text>
                </TextInput>
                <MaterialIcons name="location-history" size={20} />
              </View>
            </View>
            <View className="w-full flex items-center justify-center py-6">
              <Pressable className="w-full flex items-center justify-center">
                <LinearGradient
                  colors={["#CC6316", "#964408"]}
                  className="w-full px-4 py-3 rounded-xl flex items-center justify-center"
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text className="text-sm font-semibold text-white">
                    Start Navigation
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default dashboard;
