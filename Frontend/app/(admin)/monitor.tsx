import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useQueue } from "@/context/QueueProvider";
import RemixIcon from "react-native-remix-icon";
import axios from "axios";
import Loader from "@/components/loader";
import WeatherForm from "@/components/admin/monitor/WeatherForm";
import AlertModal from "@/components/admin/monitor/AlertModal";

const monitor = () => {
  const { queue, deleteFromQueue } = useQueue();
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [rainyHours, setRainyHours] = useState<any[]>([]);
  const [todayRain, setTodayRain] = useState("");
  const [showWeatherForm, setShowWeatherForm] = useState(false);
  const [alertModal, setAlertModal] = useState(false);

  interface queue {
    userId: {
      personalInfo: {
        firstName: string;
        middleName: string;
        lastName: string;
      };
      _id: string;
    };
    location: {
      locationName: string;
    };
    status: string;
    _id: string;
  }

  const fetchAndFilterRainyHours = async () => {
    const apiKey = "PQSRXB9VVDCDL87R3T6ZHPE83";
    const city = "Caloocan";
    setLoading(true);

    try {
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`;
      const response = await axios.get(url);

      // const todayDate = new Date().toISOString().split("T")[0];
      const todayDate = new Date().toISOString().split("T")[0];
      console.log(todayDate);

      const todayForecast = response.data.days.find(
        (day: any) => day.datetime === todayDate
      );
      setTodayRain(todayForecast.precipprob);

      if (todayForecast && todayForecast.hours) {
        const filteredRainyHours = todayForecast.hours.filter(
          (hour: any) => hour.precipprob > 30
        );
        setRainyHours(filteredRainyHours);
      }
    } catch (error: any) {
      setIsError(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const convertToTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));

    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date.toLocaleTimeString([], options);
  };

  useEffect(() => {
    fetchAndFilterRainyHours();
  }, []);

  const convertToHour = (timeString: string) => {
    const hour = parseInt(timeString.split(":")[0], 10); // Extract the hour part
    if (isNaN(hour)) {
      console.error("Invalid time:", timeString);
      return NaN;
    }
    return hour; // Return the hour
  };

  const checkCurrentTime = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    const matchFound = rainyHours.some((rainyHour) => {
      const rainyHourValue = convertToHour(rainyHour.datetime);

      if (currentHour === rainyHourValue) {
        return currentMinute >= 0 && currentMinute < 60;
      }
      return false;
    });

    if (matchFound) {
      setAlertModal(true);
    }
  };

  useEffect(() => {
    checkCurrentTime();
  }, [rainyHours]);

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#F0F0F0]">
        {/* TitleBar */}
        <View className="relative w-full flex flex-row items-center justify-center p-4">
          <TouchableHighlight
            underlayColor={"#C9C9C9"}
            className="absolute left-4 rounded-full"
          >
            <View className="p-2 bg-[#E1E1E1] rounded-full flex items-center justify-center">
              <RemixIcon name="arrow-left-s-line" size={16} color="black" />
            </View>
          </TouchableHighlight>

          <Text className="text-sm font-semibold">Monitoring</Text>
        </View>
        <ScrollView
          className="flex-1 flex-col w-full px-4 py-4"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full flex flex-col items-center justify-center p-6 bg-[#FAFAFA] rounded-3xl mb-4">
            <View className="w-full flex flex-col items-start justify-center pb-8">
              <Text className="text-sm font-semibold">Bot Status</Text>
              <Text className="text-xs font-normal text-black/50">
                power supply, sim module, capacity
              </Text>
            </View>
            <View className="w-full flex flex-col items-center justify-center space-y-2">
              {/* battery */}
              {/* <LinearGradient
              colors={["#050301", "#3B3B3B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="w-full rounded-2xl flex flex-row items-center justify-between px-6 py-4 mb-2"
            >
              <View className="w-1/2 flex flex-row items-center justify-start gap-x-2">
                <RemixIcon name="battery-line" size={16} color="white" />
                <Text
                  className="text-xs font-normal text-white"
                  numberOfLines={1}
                >
                  Battery
                </Text>
              </View>
              <View className="w-1/2 flex flex-row items-center justify-end gap-x-2">
                <Text
                  className="text-xs font-normal text-white"
                  numberOfLines={1}
                >
                  90%
                </Text>
              </View>
            </LinearGradient> */}
              {/* sim module */}
              {/* <LinearGradient
              colors={["#050301", "#3B3B3B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="w-full rounded-2xl flex flex-row items-center justify-between px-6 py-4 mb-2"
            >
              <View className="w-1/2 flex flex-row items-center justify-start gap-x-2">
                <RemixIcon name="sim-card-line" size={16} color="white" />
                <Text
                  className="text-xs font-normal text-white"
                  numberOfLines={1}
                >
                  SIM Module
                </Text>
              </View>
              <View className="w-1/2 flex flex-row items-center justify-end gap-x-2">
                <Text
                  className="text-xs font-normal text-white"
                  numberOfLines={1}
                >
                  90%
                </Text>
              </View>
            </LinearGradient> */}
              {/* overflow */}
              <LinearGradient
                colors={["#050301", "#3B3B3B"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                className="w-full rounded-2xl flex flex-row items-center justify-between px-6 py-4"
              >
                <View className="w-1/2 flex flex-row items-center justify-start gap-x-2">
                  <RemixIcon name="compass-2-line" size={16} color="white" />
                  <Text
                    className="text-xs font-normal text-white"
                    numberOfLines={1}
                  >
                    Overflow
                  </Text>
                </View>
                <View className="w-1/2 flex flex-row items-center justify-end gap-x-2">
                  <Text
                    className="text-xs font-normal text-white"
                    numberOfLines={1}
                  >
                    90%
                  </Text>
                </View>
              </LinearGradient>
              {/* water-level */}
              <LinearGradient
                colors={["#050301", "#3B3B3B"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                className="w-full rounded-2xl flex flex-row items-center justify-between px-6 py-4"
              >
                <View className="w-1/2 flex flex-row items-center justify-start gap-x-2">
                  <RemixIcon name="drop-line" size={16} color="white" />
                  <Text
                    className="text-xs font-normal text-white"
                    numberOfLines={1}
                  >
                    Water Level
                  </Text>
                </View>
                <View className="w-1/2 flex flex-row items-center justify-end gap-x-2">
                  <Text
                    className="text-xs font-normal text-white"
                    numberOfLines={1}
                  >
                    90%
                  </Text>
                </View>
              </LinearGradient>
              {/* orientation */}
              <LinearGradient
                colors={["#050301", "#3B3B3B"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                className="w-full rounded-2xl flex flex-row items-center justify-between px-6 py-4"
              >
                <View className="w-1/2 flex flex-row items-center justify-start gap-x-2">
                  <RemixIcon name="pulse-line" size={16} color="white" />
                  <Text
                    className="text-xs font-normal text-white"
                    numberOfLines={1}
                  >
                    Orientation
                  </Text>
                </View>
                <View className="w-1/2 flex flex-row items-center justify-end gap-x-2">
                  <Text
                    className="text-xs font-normal text-white"
                    numberOfLines={1}
                  >
                    90%
                  </Text>
                </View>
              </LinearGradient>
              {/* rainfall */}
              <LinearGradient
                colors={["#050301", "#3B3B3B"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                className="w-full rounded-2xl flex flex-row items-center justify-between px-6 py-4"
              >
                <View className="w-1/2 flex flex-row items-center justify-start gap-x-2">
                  <RemixIcon name="rainy-line" size={16} color="white" />
                  <Text
                    className="text-xs font-normal text-white"
                    numberOfLines={1}
                  >
                    Rainfall Probability
                  </Text>
                </View>
                <View className="w-1/2 flex flex-row items-center justify-end gap-x-1">
                  <Text
                    className="text-xs font-normal text-white"
                    numberOfLines={1}
                  >
                    {todayRain !== null ? `${todayRain}%` : "No Data"}
                  </Text>
                  <Pressable onPress={() => setShowWeatherForm(true)}>
                    <RemixIcon
                      name="arrow-right-down-line"
                      color="white"
                      size={16}
                    />
                  </Pressable>
                </View>
              </LinearGradient>
            </View>
          </View>
          <View className="w-full flex flex-col items-center justify-center p-6 bg-[#FAFAFA] rounded-3xl">
            <View className="w-full flex flex-col items-start justify-center pb-8">
              <Text className="text-sm font-semibold">User Queue</Text>
              <Text className="text-xs font-normal text-black/50">
                users waiting in line for their turn
              </Text>
            </View>
            {queue.length > 0 ? (
              queue.map((request: queue) => (
                <View
                  className="w-full flex flex-row items-start justify-between gap-x-4 pb-8"
                  key={request._id}
                >
                  <Pressable
                    className={`flex p-3 items-center justify-center rounded-full ${
                      request.status === "in progress"
                        ? "bg-[#699900]"
                        : "bg-[#EDEDED]"
                    }`}
                    onPress={() => deleteFromQueue(request._id)}
                  >
                    <RemixIcon
                      name="open-arm-line"
                      size={16}
                      color={
                        request.status === "in progress" ? "white" : "black"
                      }
                    />
                  </Pressable>
                  <View className="w-full flex flex-col items-start justify-start">
                    <Text
                      className="text-sm font-semibold uppercase"
                      numberOfLines={1}
                    >
                      {`${request.userId.personalInfo.firstName} ${request.userId.personalInfo.middleName} ${request.userId.personalInfo.lastName}`}
                    </Text>
                    <Text
                      className="text-xs font-normal text-black/50 capitalize"
                      numberOfLines={1}
                    >
                      {request.location.locationName}
                    </Text>
                    <Text
                      className="text-xs font-normal uppercase"
                      numberOfLines={1}
                    >
                      {request.status}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View className="w-full flex flex-col items-center justify-center gap-y-4 pb-6">
                <View className="p-3 mb-2 rounded-full bg-[#699900]">
                  <RemixIcon name="blur-off-fill" size={16} color="white" />
                </View>
                <Text className="text-xs font-normal text-black/50">
                  No Rewards History Available
                </Text>
              </View>
            )}
          </View>
          <View className="pb-24"></View>

          <StatusBar style="auto" />
        </ScrollView>
      </SafeAreaView>
      {loading && <Loader />}
      {showWeatherForm && (
        <WeatherForm
          data={rainyHours}
          onClose={() => setShowWeatherForm(false)}
        />
      )}
      {alertModal && <AlertModal onClose={() => setAlertModal(false)} />}
    </>
  );
};

export default monitor;
