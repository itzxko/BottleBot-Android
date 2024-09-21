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
import axios from "axios";
import { useRouter } from "expo-router";

export default function index() {
  const [hidePass, setHidePass] = useState(true);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const route = useRouter();

  const togglePassword = () => {
    setHidePass(!hidePass);
  };

  const onLogin = async () => {
    try {
      let url = "http://192.168.254.139:3000/api/auth/login";

      let response = await axios.post(url, {
        email: email,
        password: password,
      });
      if (response) {
        console.log(response.data.message);
        if (response.data.message === "Login success!") {
          route.push("/(tabs)/dashboard");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log(password, email);

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
            onChangeText={setEmail}
            value={email}
            spellCheck={false}
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
              value={password}
              onChangeText={setPassword}
              spellCheck={false}
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
            onPress={onLogin}
          >
            <Text className="text-white text-center text-sm font-semibold">
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
