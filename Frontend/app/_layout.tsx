import { View, Text } from "react-native";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { UrlProvider } from "@/context/UrlProvider";
import { QueueProvider } from "@/context/QueueProvider";
import { LocationProvider } from "@/context/LocationProvider";

const _layout = () => {
  return (
    <UrlProvider>
      <AuthProvider>
        <QueueProvider>
          <LocationProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="(user)" options={{ headerShown: false }} />
              <Stack.Screen name="(staff)" options={{ headerShown: false }} />
              <Stack.Screen name="(admin)" options={{ headerShown: false }} />
            </Stack>
          </LocationProvider>
        </QueueProvider>
      </AuthProvider>
    </UrlProvider>
  );
};

export default _layout;
