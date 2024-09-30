import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { TabBar } from "@/components/admin/tabBar";
import { UsersProvider } from "@/context/UsersProvider";

const _layout = () => {
  return (
    <UsersProvider>
      <Tabs tabBar={(props) => <TabBar {...props} />}>
        <Tabs.Screen
          name="dashboard"
          options={{
            headerShown: false,
            title: "Home",
          }}
        />

        <Tabs.Screen
          name="rewards"
          options={{
            headerShown: false,
            title: "Rewards",
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
          name="users"
          options={{
            headerShown: false,
            title: "Users",
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
    </UsersProvider>
  );
};

export default _layout;
