import { View, Text, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const Modal = ({
  message,
  isVisible,
  onClose,
  header,
  icon,
}: {
  header: string;
  message: string;
  isVisible: boolean;
  icon: string;
  onClose: () => void;
}) => {
  return (
    <SafeAreaView className="w-full flex flex-1 items-center justify-center absolute left-0 top-0 bottom-0 right-0 bg-black/50">
      <View className="flex items-center justify-center rounded-3xl shadow-xl bg-[#F0F0F0] shadow-black min-w-[20vw] max-w-[60vw] overflow-hidden">
        <View className="w-full flex flex-row items-center justify-between bg-white px-6 py-3">
          <Text className="text-xs font-semibold text-black">{header}</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close-outline" size={16} />
          </Pressable>
        </View>
        <View className="w-full flex items-center justify-center bg-[#F0F0F0] p-6">
          <View className="w-full flex items-center justify-center pb-2">
            <LinearGradient
              className="flex p-3 bg-black rounded-full"
              colors={["#00674F", "#06402B"]}
            >
              <MaterialCommunityIcons
                name={
                  icon === "redeem"
                    ? "shopping-outline"
                    : icon === "login"
                    ? "account-alert-outline"
                    : icon === "profile"
                    ? "account-sync"
                    : "crosshairs-gps"
                }
                size={20}
                color={"white"}
              />
            </LinearGradient>
          </View>
          <Text className="text-xs font-normal text-black text-center">
            {message}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Modal;
