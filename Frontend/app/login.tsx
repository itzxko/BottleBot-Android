import { StatusBar } from "expo-status-bar";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Pressable,
  ImageBackground,
  TouchableHighlight,
  Image,
} from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
import Animated, {
  SharedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "../components/modal";
import { useAuth } from "@/context/AuthContext";
import { useUrl } from "@/context/UrlProvider";
import { useQueue } from "@/context/QueueProvider";
import RemixIcon from "react-native-remix-icon";

export default function Login() {
  const [hidePass, setHidePass] = useState(true);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [message, setMessage] = useState("");
  const route = useRouter();
  const { setToken, setUser } = useAuth();
  const [userLevel, setUserLevel] = useState(null);
  const { ipAddress, port } = useUrl();
  const [loading, setLoading] = useState(false);
  const { initializeWebSocket } = useQueue();

  const togglePassword = () => {
    setHidePass(!hidePass);
  };

  const onLogin = async () => {
    setLoading(true);
    try {
      let url = `http://${ipAddress}:${port}/api/auth/login`;

      let response = await axios.post(url, {
        email: email,
        password: password,
      });

      if (response.data.success === true) {
        setToken(response.data.token);
        setUser(response.data.user);
        initializeWebSocket();

        if (response.data.user.credentials.level === "citizen") {
          route.push("/(user)/dashboard");
        } else if (response.data.user.credentials.level === "admin") {
          route.push("/(admin)/dashboard");
        } else {
          route.push("/(staff)/dashboard");
        }
      } else {
        setVisibleModal(true);
        setMessage(response.data.message);
      }
    } catch (error: any) {
      setMessage(error.response.data.message);
      setVisibleModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View className="relative flex-1 w-full bg-[#102B33]">
        <ImageBackground
          className="w-full object-cover object-center"
          source={require(".././assets/images/user-auth.jpg")}
        >
          <LinearGradient
            className="w-full h-full"
            colors={["rgba(5, 3, 1, .7)", "rgba(5, 3, 1, 0.4)"]}
            start={{ x: 1, y: 1 }} // Top-left corner
            end={{ x: 1, y: 0 }} // Bottom-right corner
          >
            <View className="w-full h-[76vh] bg-[#F6F6F6] rounded-3xl items-center justify-center px-6">
              <View className="w-full flex items-center justify-center pb-6">
                <Text className="text-sm font-semibold tracking-wider">
                  Account Login.
                </Text>
                <Text className="text-xs font-normal text-black/50">
                  Log in to your account to continue using the app
                </Text>
              </View>

              <View className="w-full flex items-start justify-center py-6">
                <Text className="font-semibold text-sm pb-2">Username:</Text>
                <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl">
                  <RemixIcon name="at-line" size={16} />
                  <TextInput
                    className="text-xs font-normal w-[90%] text-left"
                    placeholder="enter username"
                    numberOfLines={1}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                  ></TextInput>
                </View>
              </View>

              <View className="w-full flex items-start justify-center pb-6">
                <Text className="font-semibold text-sm pb-2">Password:</Text>
                <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl">
                  <RemixIcon name="shield-keyhole-line" size={16} />
                  <TextInput
                    className="text-xs font-normal w-[80%] text-left"
                    numberOfLines={1}
                    placeholder="Enter your password"
                    textContentType={"password"}
                    secureTextEntry={hidePass ? true : false}
                    value={password}
                    onChangeText={setPassword}
                    spellCheck={false}
                    autoCapitalize="none"
                  />
                  <RemixIcon
                    name={hidePass ? "eye-line" : "eye-close-line"}
                    size={16}
                    onPress={togglePassword}
                  />
                </View>
              </View>

              <View className="w-full flex items-end justify-center">
                <Text className="font-semibold text-xs pb-2">
                  Forgot Password?
                </Text>
              </View>

              <View className="w-full flex items-center justify-center py-6">
                <TouchableHighlight
                  className="w-full flex items-center justify-center rounded-xl"
                  onPress={onLogin}
                  underlayColor={"#41917F"}
                >
                  <LinearGradient
                    colors={["#699900", "#466600"]}
                    className="w-full  rounded-xl shadow shadow-[#050301]"
                  >
                    <Text className="flex py-[16px] bg-transparent text-center text-xs text-white font-semibold">
                      Login
                    </Text>
                  </LinearGradient>
                </TouchableHighlight>
              </View>
            </View>
            <View className="w-full flex-1 items-center justify-center ">
              <Image
                source={require("../assets/images/Bottle-Bot.png")}
                className="w-[60px] h-[60px]"
              />
            </View>
          </LinearGradient>
        </ImageBackground>
        <StatusBar style="auto" />
      </View>

      {visibleModal && (
        <Modal
          header="Login"
          message={message}
          isVisible={visibleModal}
          onClose={() => setVisibleModal(false)}
          icon="login"
        />
      )}
    </>
  );
}
