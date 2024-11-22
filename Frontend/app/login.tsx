import { StatusBar } from "expo-status-bar";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Pressable,
  ImageBackground,
  TouchableHighlight,
  Keyboard,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Modal from "../components/modal";
import { useAuth } from "@/context/AuthContext";
import { useUrl } from "@/context/UrlProvider";
import { useQueue } from "@/context/QueueProvider";
import RemixIcon from "react-native-remix-icon";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Loader from "@/components/loader";
import { useLocation } from "@/context/LocationProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const { queueWebSocket } = useQueue();
  const { botLocationWebSocket } = useLocation();

  const togglePassword = () => {
    setHidePass(!hidePass);
  };

  const onLogin = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      let url = `http://${ipAddress}:${port}/api/auth/login`;

      let response = await axios.post(url, {
        email: email,
        password: password,
      });

      if (response.data.success === true) {
        queueWebSocket();
        botLocationWebSocket();

        if (response.data.user.credentials.level === "citizen") {
          route.push("/(user)/dashboard");
          setUser(response.data.user);
          setToken(response.data.token);
          AsyncStorage.setItem("user", JSON.stringify(response.data.user));
          AsyncStorage.setItem("token", response.data.token);
        } else if (response.data.user.credentials.level === "admin") {
          route.push("/(admin)/dashboard");
          setUser(response.data.user);
          setToken(response.data.token);
          AsyncStorage.setItem("user", JSON.stringify(response.data.user));
          AsyncStorage.setItem("token", response.data.token);
        } else {
          route.push("/(staff)/dashboard");
          setUser(response.data.user);
          setToken(response.data.token);
          AsyncStorage.setItem("user", JSON.stringify(response.data.user));
          AsyncStorage.setItem("token", response.data.token);
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

  // const onLogin = () => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 2000);
  // };

  return (
    <>
      <View className="relative flex-1 w-full bg-[#102B33]">
        <ImageBackground
          className="w-full object-cover object-center"
          source={require(".././assets/images/Leaves.jpg")}
        >
          <LinearGradient
            className="w-full h-full"
            colors={["rgba(33, 33, 33, .8)", "rgba(33, 33, 33, 0.1)"]}
            start={{ x: 0, y: 1 }} // Bottom-left corner
            end={{ x: 1, y: 0 }} // Top-right corner
          >
            <SafeAreaView className="w-full flex bg-[#F6F6F6] rounded-3xl items-center justify-center py-16 px-6">
              <View className="w-full flex items-center justify-center pb-4">
                <Image
                  source={require("../assets/images/Bottle_Bot.png")}
                  className="w-[100px] h-[100px]"
                />
              </View>
              <View className="w-full flex items-center justify-center pb-6">
                <Text className="text-sm font-semibold tracking-wider">
                  Account Login.
                </Text>
                <Text className="text-xs font-normal text-black/50">
                  Log in to your account to continue using the app
                </Text>
              </View>

              <View className="w-full flex items-start justify-center py-6">
                <Text className="font-semibold text-xs pb-2">Username:</Text>
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
                <Text className="font-semibold text-xs pb-2">Password:</Text>
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
                <Text className="font-semibold text-xs pb-2 px-2">
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
            </SafeAreaView>
          </LinearGradient>
        </ImageBackground>
        <StatusBar style="auto" />
      </View>
      {loading && <Loader />}

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
