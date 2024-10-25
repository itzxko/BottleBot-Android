import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useQueue } from "@/context/QueueProvider";
import RemixIcon from "react-native-remix-icon";

const monitor = () => {
  const { queue, deleteFromQueue } = useQueue();

  interface queue {
    userId: {
      personalInfo: {
        firstName: string;
        middleName: string;
        lastName: string;
      };
      _id: string;
    };
    location: {
      locationName: string;
    };
    status: string;
    _id: string;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F0F0F0]">
      {/* TitleBar */}
      <View className="relative w-full flex flex-row items-center justify-center p-4">
        <TouchableHighlight
          underlayColor={"#C9C9C9"}
          className="absolute left-4 rounded-full"
        >
          <View className="p-2 bg-[#E1E1E1] rounded-full flex items-center justify-center">
            <RemixIcon name="arrow-left-s-line" size={16} color="black" />
          </View>
        </TouchableHighlight>

        <Text className="text-sm font-semibold">Monitoring</Text>
      </View>
      <ScrollView
        className="flex-1 flex-col w-full px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full flex flex-col items-center justify-center p-6 bg-[#FAFAFA] rounded-3xl mb-4">
          <View className="w-full flex flex-col items-start justify-center pb-8">
            <Text className="text-sm font-semibold">Bot Status</Text>
            <Text className="text-xs font-normal text-black/50">
              power supply, sim module, capacity
            </Text>
          </View>
          <View className="w-full flex flex-col items-center justify-between">
            <LinearGradient
              colors={["#050301", "#3B3B3B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="w-full rounded-2xl flex flex-row items-center justify-between px-6 py-4 mb-2"
            >
              <View className="w-1/2 flex flex-row items-center justify-start gap-x-2">
                <RemixIcon name="battery-line" size={16} color="white" />
                <Text
                  className="text-xs font-normal text-white"
                  numberOfLines={1}
                >
                  Battery
                </Text>
              </View>
              <View className="w-1/2 flex flex-row items-center justify-end gap-x-2">
                <Text
                  className="text-xs font-normal text-white"
                  numberOfLines={1}
                >
                  90%
                </Text>
              </View>
            </LinearGradient>
            <LinearGradient
              colors={["#050301", "#3B3B3B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="w-full rounded-2xl flex flex-row items-center justify-between px-6 py-4 mb-2"
            >
              <View className="w-1/2 flex flex-row items-center justify-start gap-x-2">
                <RemixIcon name="sim-card-line" size={16} color="white" />
                <Text
                  className="text-xs font-normal text-white"
                  numberOfLines={1}
                >
                  SIM Module
                </Text>
              </View>
              <View className="w-1/2 flex flex-row items-center justify-end gap-x-2">
                <Text
                  className="text-xs font-normal text-white"
                  numberOfLines={1}
                >
                  90%
                </Text>
              </View>
            </LinearGradient>
            <LinearGradient
              colors={["#050301", "#3B3B3B"]}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              className="w-full rounded-2xl flex flex-row items-center justify-between px-6 py-4"
            >
              <View className="w-1/2 flex flex-row items-center justify-start gap-x-2">
                <RemixIcon name="delete-bin-4-line" size={16} color="white" />
                <Text
                  className="text-xs font-normal text-white"
                  numberOfLines={1}
                >
                  Capacity
                </Text>
              </View>
              <View className="w-1/2 flex flex-row items-center justify-end gap-x-2">
                <Text
                  className="text-xs font-normal text-white"
                  numberOfLines={1}
                >
                  90%
                </Text>
              </View>
            </LinearGradient>
          </View>
        </View>
        <View className="w-full flex flex-col items-center justify-center p-6 bg-[#FAFAFA] rounded-3xl">
          <View className="w-full flex flex-col items-start justify-center pb-8">
            <Text className="text-sm font-semibold">User Queue</Text>
            <Text className="text-xs font-normal text-black/50">
              users waiting in line for their turn
            </Text>
          </View>
          {queue.length > 0 ? (
            queue.map((request: queue) => (
              <View
                className="w-full flex flex-row items-start justify-between gap-x-4 pb-8"
                key={request._id}
              >
                <Pressable
                  className={`flex p-3 items-center justify-center rounded-full ${
                    request.status === "in progress"
                      ? "bg-[#699900]"
                      : "bg-[#EDEDED]"
                  }`}
                  onPress={() => deleteFromQueue(request._id)}
                >
                  <RemixIcon
                    name="open-arm-line"
                    size={16}
                    color={request.status === "in progress" ? "white" : "black"}
                  />
                </Pressable>
                <View className="w-full flex flex-col items-start justify-start">
                  <Text
                    className="text-sm font-semibold uppercase"
                    numberOfLines={1}
                  >
                    {`${request.userId.personalInfo.firstName} ${request.userId.personalInfo.middleName} ${request.userId.personalInfo.lastName}`}
                  </Text>
                  <Text
                    className="text-xs font-normal text-black/50 capitalize"
                    numberOfLines={1}
                  >
                    {request.location.locationName}
                  </Text>
                  <Text
                    className="text-xs font-normal uppercase"
                    numberOfLines={1}
                  >
                    {request.status}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View className="w-full flex flex-col items-center justify-center gap-y-4 pb-6">
              <View className="p-3 mb-2 rounded-full bg-[#699900]">
                <RemixIcon name="blur-off-fill" size={16} color="white" />
              </View>
              <Text className="text-xs font-normal text-black/50">
                No Rewards History Available
              </Text>
            </View>
          )}
        </View>
        <View className="pb-24"></View>

        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default monitor;
