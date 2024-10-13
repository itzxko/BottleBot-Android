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

  const togglePassword = () => {
    setHidePass(!hidePass);
  };

  const onLogin = async () => {
    try {
      let url = `http://${ipAddress}:${port}/api/auth/login`;

      let response = await axios.post(url, {
        email: email,
        password: password,
      });

      if (response) {
        console.log(response.data.message);

        if (response.data.message === "Login success!") {
          setToken(response.data.token);
          setUser(response.data.user);

          if (response.data.user.credentials.level === "citizen") {
            route.push("/(user)/dashboard");
          } else if (response.data.user.credentials.level === "admin") {
            route.push("/(admin)/dashboard");
          } else {
            route.push("/(staff)/dashboard");
          }
        }
      }
    } catch (error: any) {
      setMessage(error.response.data.message);
      setVisibleModal(true);
      setTimeout(() => {
        setVisibleModal(false);
      }, 5000);
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
                <Text className="text-xl font-semibold tracking-wider">
                  Account Login.
                </Text>
                <Text className="text-xs font-normal text-black/50">
                  Log in to your account to continue using the app
                </Text>
              </View>

              <View className="w-full flex items-start justify-center py-6">
                <Text className="font-semibold text-sm pb-2">Username:</Text>
                <TextInput
                  className="bg-[#E6E6E6]  w-full px-6 py-3 rounded-2xl text-sm"
                  placeholder="Enter your email"
                  onChangeText={setEmail}
                  value={email}
                  spellCheck={false}
                  autoCapitalize="none"
                />
              </View>

              <View className="w-full flex items-start justify-center pb-6">
                <Text className="font-semibold text-sm pb-2">Password:</Text>
                <View className="flex flex-row items-center justify-center w-full bg-[#E6E6E6]  px-8 py-3 rounded-2xl">
                  <TextInput
                    className="bg-[#E6E6E6] w-full text-sm"
                    placeholder="Enter your password"
                    textContentType={"password"}
                    secureTextEntry={hidePass ? true : false}
                    value={password}
                    onChangeText={setPassword}
                    spellCheck={false}
                    autoCapitalize="none"
                  />
                  <Feather
                    name={hidePass ? "eye-off" : "eye"}
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
                  className="w-full flex items-center justify-center rounded-2xl"
                  onPress={onLogin}
                  underlayColor={"#41917F"}
                >
                  <LinearGradient
                    colors={["#00674F", "#06402B"]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    className="w-full  rounded-2xl shadow shadow-[#050301]"
                  >
                    <Text className="flex py-[16px] bg-transparent text-center text-sm text-white font-semibold">
                      Login
                    </Text>
                  </LinearGradient>
                </TouchableHighlight>
              </View>
            </View>
            <View className="w-full flex-1 items-center justify-center ">
              <Image
                source={require("../assets/images/BottleBot-Text-Light.png")}
                className="w-[30px] h-[30px]"
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
