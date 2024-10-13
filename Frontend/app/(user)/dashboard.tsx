import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Feather, MaterialIcons, Octicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Loader from "@/components/loader";
import { useQueue } from "@/context/QueueProvider";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const startNavigation = () => {};
  const { addtoQueue, fetchQueue } = useQueue();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 14.680105493791455,
    longitude: 121.00993905398246,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const userLocation = async () => {
    // Request location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    // Get current location
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High, // Use high accuracy
      });

      // Set the map region to the user's current location
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01, // Adjust this for zoom level
        longitudeDelta: 0.01, // Adjust this for zoom level
      });
    } catch (error) {
      console.error("Error getting location:", error);
      alert("Unable to retrieve location. Please try again.");
    }
  };

  useEffect(() => {
    const getUserLocation = async () => {
      setLoading(true);
      await userLocation();
      await fetchQueue();
      setLoading(false);
    };

    getUserLocation();
  }, []);

  return (
    <>
      <View className="flex-1 w-full flex items-center justify-center">
        <View className="flex-1 w-full">
          <View className="w-full flex-1 relative">
            {/* Map Background */}
            <MapView
              style={{ width: "100%", height: "100%" }}
              region={mapRegion}
            >
              <Marker coordinate={mapRegion} title="Marker" />
            </MapView>

            <View className="w-full h-full absolute top-0 left-0">
              <LinearGradient
                colors={["rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 1)"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 0, y: 1 }}
                className="flex-1"
              />
            </View>

            <View className="absolute flex items-center rounded-t-3xl justify-center w-full left-0 bottom-0 bg-[#F0F0F0] ">
              <View className="w-full flex items-center justify-center px-4 py-8">
                {/* Header */}
                <View className="w-full flex items-center justify-center pb-6">
                  <Text className="font-bold text-lg">Dashboard</Text>
                  <Text className="font-normal text-xs text-black/50">
                    Allow location access to provide accurate data
                  </Text>
                </View>
                {/* BottleBot */}
                <View className="w-full flex flex-row items-center justify-between pl-2 pr-6 py-2 bg-[#E6E6E6] rounded-xl mb-2">
                  <View className="max-w-[50%] flex flex-row items-center justify-start px-4 py-2.5 rounded-lg bg-[#050301]">
                    <Pressable>
                      <Feather name="navigation-2" size={16} color={"white"} />
                    </Pressable>
                    <Text
                      className="text-xs font-semibold text-white pl-2"
                      numberOfLines={1}
                    >
                      BottleBot Location
                    </Text>
                  </View>
                  <TextInput
                    className="text-xs font-normal max-w-[50%] text-right"
                    placeholder="single"
                    numberOfLines={1}
                    value={`${mapRegion.latitude.toString()}, ${mapRegion.longitude.toString()}`}
                  ></TextInput>
                </View>
                {/* User */}
                <View className="w-full flex flex-row items-center justify-between pl-2 pr-6 py-2 bg-[#E6E6E6] rounded-xl mb-2">
                  <View className="max-w-[50%] flex flex-row items-center justify-start px-4 py-2.5 rounded-lg bg-[#050301]">
                    <Pressable>
                      <Feather name="navigation-2" size={16} color={"white"} />
                    </Pressable>
                    <Text
                      className="text-xs font-semibold text-white pl-2"
                      numberOfLines={1}
                    >
                      Your Location
                    </Text>
                  </View>
                  <TextInput
                    className="text-xs font-normal max-w-[50%] text-right"
                    placeholder="single"
                    numberOfLines={1}
                    value={`${mapRegion.latitude.toString()}, ${mapRegion.longitude.toString()}`}
                  ></TextInput>
                </View>

                <View className="w-full flex items-center justify-center py-4">
                  <TouchableHighlight
                    className="w-full flex items-center justify-center rounded-xl"
                    underlayColor={"#41917F"}
                    onPress={() =>
                      addtoQueue({
                        userId: user?._id,
                        lon: mapRegion.longitude,
                        lat: mapRegion.latitude,
                        locationName: "shitty place",
                        status: "pending",
                      })
                    }
                  >
                    <LinearGradient
                      colors={["#00674F", "#06402B"]}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 1, y: 0 }}
                      className="w-full  rounded-xl shadow shadow-[#050301]"
                    >
                      <Text className="flex py-3.5 bg-transparent text-center text-sm text-white font-semibold">
                        Start Navigation
                      </Text>
                    </LinearGradient>
                  </TouchableHighlight>
                </View>
              </View>
              <View className="pb-12"></View>
            </View>
          </View>
        </View>
      </View>
      {loading && <Loader />}
    </>
  );
};

export default Dashboard;
