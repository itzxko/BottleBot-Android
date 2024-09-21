import {
  View,
  Text,
  ImageBackground,
  TextInput,
  Pressable,
} from "react-native";
import React from "react";
import { MaterialIcons, Octicons } from "@expo/vector-icons";

const dashboard = () => {
  return (
    <View className="flex-1 w-full flex items-center justify-center">
      <View className="flex-1 w-full">
        <ImageBackground
          className="w-full flex-1 relative"
          source={require("../../assets/images/map.jpg")}
        >
          <View className="absolute flex items-center h-[55vh] rounded-t-[40px] justify-start w-full left-0 bottom-0 bg-white px-8 py-10">
            <View className="w-full flex items-center justify-center pb-6">
              <Text className="font-bold text-lg">Dashboard.</Text>
            </View>
            <View className="w-full flex items-start justify-center py-2">
              <Text className="text-sm font-semibold text-black pb-2">
                BottleBot's Location
              </Text>
              <View className="w-full flex flex-row items-center justify-center px-6 py-2 bg-white border border-black rounded-md">
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
              <View className="w-full flex flex-row items-center justify-center px-6 py-2 bg-white border border-black rounded-md">
                <TextInput className="w-full" editable={false}>
                  <Text className="text-sm font-bold text-black/50">
                    Sample Text
                  </Text>
                </TextInput>
                <MaterialIcons name="location-history" size={20} />
              </View>
            </View>
            <View className="w-full flex items-center justify-center py-6">
              <Pressable className="w-full flex items-center justify-center py-3 bg-black rounded-md ">
                <Text className="text-sm font-semibold text-white">
                  Start Navigation
                </Text>
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default dashboard;
