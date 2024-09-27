import { StatusBar } from "expo-status-bar";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Pressable,
  ImageBackground,
  TouchableHighlight,
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

export default function Index() {
  const [hidePass, setHidePass] = useState(true);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const route = useRouter();
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(40);

  const togglePassword = () => {
    setHidePass(!hidePass);
  };

  useEffect(() => {
    if (modalVisible) {
      opacity.value = withTiming(1, { duration: 300 });
      translateX.value = withTiming(0, { duration: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 300 });
      translateX.value = withTiming(40, { duration: 300 });
    }
  }, [modalVisible]);

  const onLogin = async () => {
    try {
      let url = "http://192.168.254.139:3000/api/auth/login";

      let response = await axios.post(url, {
        email: email,
        password: password,
      });

      // if (response) {
      //   route.push("/(tabs)/dashboard");
      // }

      if (response) {
        console.log(response.data.message);

        if (response.data.message === "Login success!") {
          await AsyncStorage.setItem("token", response.data.token);
          await AsyncStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
          );

          route.push("/(tabs)/dashboard");
        } else {
          setMessage(response.data.message);
          setModalVisible(true);
          setTimeout(() => {
            setModalVisible(false);
          }, 5000);
        }
      }
    } catch (err: any) {
      console.log(err);
      setMessage(err.response.data.message);
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
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
            className="w-full h-full "
            colors={["rgba(5, 3, 1, .9)", "rgba(5, 3, 1, 0.5)"]}
            start={{ x: 1, y: 1 }} // Top-left corner
            end={{ x: 1, y: 0 }} // Bottom-right corner
          >
            <View className="w-full h-[80vh] bg-[#F6F6F6] rounded-b-3xl items-center justify-center px-8">
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
                  className="bg-[#E1E1E1]  w-full px-6 py-3 rounded-xl text-sm"
                  placeholder="Enter your email"
                  onChangeText={setEmail}
                  value={email}
                  spellCheck={false}
                  autoCapitalize="none"
                />
              </View>

              <View className="w-full flex items-start justify-center pb-6">
                <Text className="font-semibold text-sm pb-2">Password:</Text>
                <View className="flex flex-row items-center justify-center w-full bg-[#E1E1E1]  px-8 py-3 rounded-xl">
                  <TextInput
                    className="bg-[#E1E1E1] w-full text-sm"
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
                    size={20}
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
                    colors={["#00674F", "#06402B"]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    className="w-full  rounded-xl shadow shadow-[#050301]"
                  >
                    <Text className="flex py-4 bg-transparent text-center text-sm text-white font-semibold">
                      Login
                    </Text>
                  </LinearGradient>
                </TouchableHighlight>
              </View>
            </View>
            {modalVisible && (
              <Pressable
                className="h-full w-full absolute top-0 left-0 bg-black/50 z-10 flex items-center justify-center"
                onPress={() => setModalVisible(false)}
              >
                <Animated.View
                  className="bg-white px-6 py-4 rounded-xl flex items-center w-3/5 justify-center animate-bounce"
                  style={{
                    opacity: opacity,
                    transform: [{ translateX: translateX }],
                  }}
                >
                  <View className="w-full flex items-end justify-start">
                    <Pressable onPress={() => setModalVisible(false)}>
                      <Ionicons name="close" size={20} />
                    </Pressable>
                  </View>
                  <View className="w-full flex items-center justify-center pb-4">
                    <View className="p-4 bg-[#102B33] rounded-full">
                      <MaterialCommunityIcons
                        name="shield-alert-outline"
                        size={30}
                        color={"white"}
                      />
                    </View>
                  </View>
                  <Text className="text-sm font-semibold pb-2">{message}!</Text>
                </Animated.View>
              </Pressable>
            )}
          </LinearGradient>
        </ImageBackground>
        <StatusBar style="auto" />
      </View>
    </>
  );
}
