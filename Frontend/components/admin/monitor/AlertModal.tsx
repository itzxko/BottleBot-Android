import { View, Text, Pressable } from "react-native";
import React from "react";
import RemixIcon from "react-native-remix-icon";
import { LinearGradient } from "expo-linear-gradient";

const AlertModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <View className="flex-1 absolute top-0 left-0 bottom-0 right-0 bg-[#050301]/50 flex items-center justify-center">
      <View className="w-3/4 flex flex-col bg-[#FAFAFA] p-6 rounded-xl space-y-6">
        <View className="w-full flex flex-row items-start justify-between">
          <View className="w-4/5 flex flex-col justify-center items-start">
            <Text className="text-xs font-semibold">Rainfall Alert!</Text>
            <Text
              className="text-xs font-normal text-[#6E6E6E]"
              numberOfLines={1}
            >
              high precipitation probability detected!
            </Text>
          </View>
          <Pressable onPress={onClose}>
            <RemixIcon name="close-line" size={16} />
          </Pressable>
        </View>
        <View className="w-full flex flex-col items-center justify-center space-y-2">
          <View className="p-3 rounded-full bg-[#699900]">
            <RemixIcon name="cloud-windy-fill" size={20} color="white" />
          </View>
          <Text className="text-xs font-normal text-[#6E6E6E]">
            High Precipitation Probability
          </Text>
          <Pressable className="w-full">
            <LinearGradient
              className="w-full py-3 rounded-xl flex items-center justify-center"
              colors={["#699900", "#466600"]}
            >
              <Text className="text-xs font-semibold text-white">
                Return to Default
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default AlertModal;
