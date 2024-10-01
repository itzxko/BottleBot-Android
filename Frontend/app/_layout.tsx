import { View, Text } from "react-native";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <AuthProvider>
      <Stack>
        {/* <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(user)" options={{ headerShown: false }} /> */}
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
};

export default _layout;
