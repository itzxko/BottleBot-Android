import { View, Text } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

const Loader = () => {
  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 flex-1 items-center justify-center bg-white/75">
      <LottieView
        source={require("../assets/json/Loader-Ball.json")}
        autoPlay
        loop
        style={{ width: 400, height: 400 }}
      />
    </View>
  );
};

export default Loader;
