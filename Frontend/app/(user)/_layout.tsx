import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { TabBar } from "@/components/user/tabBar";
import { RewardsProvider } from "@/context/RewardsProvider";

const _layout = () => {
  return (
    <RewardsProvider>
      <Tabs tabBar={(props) => <TabBar {...props} />}>
        <Tabs.Screen
          name="dashboard"
          options={{
            headerShown: false,
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="redeem"
          options={{
            headerShown: false,
            title: "Redeem",
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            headerShown: false,
            title: "History",
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            title: "Profile",
          }}
        />
      </Tabs>
    </RewardsProvider>
  );
};

export default _layout;