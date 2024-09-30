import { View, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";

const Index = () => {
  const route = useRouter();

  const gotoLogin = () => {
    route.push("/login");
  };

  setTimeout(() => {
    gotoLogin();
  }, 2500);

  return (
    <View className="flex-1 items-center justify-center">
      <LottieView
        source={require("../assets/json/LogoTransparent.json")}
        autoPlay
        loop
        style={{ width: 300, height: 300 }}
      />
    </View>
  );
};

export default Index;
