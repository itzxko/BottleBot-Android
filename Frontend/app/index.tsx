import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";

export default function index() {
  const [hidePass, setHidePass] = useState(true);

  const togglePassword = () => {
    setHidePass(!hidePass);
  };

  return (
    <View className="flex-1 w-full bg-black">
      <View className="w-full h-[80vh] bg-white rounded-b-[40px] items-center justify-center px-8">
        <View className="w-full flex items-center justify-center pb-6">
          <Text className="text-xl font-semibold tracking-wider">
            Account Login.
          </Text>
          <Text className="text-xs font-normal text-gray-500">
            Log in to your account to continue using the app
          </Text>
        </View>

        <View className="w-full flex items-start justify-center py-6">
          <Text className="font-semibold text-sm pb-2">Username:</Text>
          <TextInput
            className="bg-white w-full border border-black px-4 py-2 rounded-md text-sm"
            placeholder="Enter your email"
          />
        </View>
        <View className="w-full flex items-start justify-center pb-6">
          <Text className="font-semibold text-sm pb-2">Password:</Text>
          <View className="flex flex-row items-center justify-center w-full border border-black px-6 py-2 rounded-md">
            <TextInput
              className="bg-white w-full text-sm"
              placeholder="Enter your password"
              textContentType={"password"}
              secureTextEntry={hidePass ? true : false}
            />
            <Feather
              name={hidePass ? "eye-off" : "eye"}
              size={20}
              onPress={togglePassword}
            />
          </View>
        </View>

        <View className="w-full flex items-end justify-center">
          <Text className="font-semibold text-xs pb-2">Forgot Password?</Text>
        </View>
        <View className="w-full flex items-center justify-center py-6">
          <TouchableOpacity
            className="bg-black w-full px-4 py-3 rounded-md"
            activeOpacity={0.8}
          >
            <Link
              href="/dashboard"
              className="text-white text-center text-sm font-semibold"
            >
              Login
            </Link>
          </TouchableOpacity>
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
