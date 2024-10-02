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
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Loader from "@/components/loader";

const Dashboard = () => {
  const startNavigation = () => {};
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
    if (status !== 'granted') {
      alert('Permission to access location was denied');
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
        longitudeDelta: 0.01  // Adjust this for zoom level
      });
      console.log(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error("Error getting location:", error);
      alert("Unable to retrieve location. Please try again.");
    }
  };

  useEffect(() => {
    userLocation(); // Fetch user location on component mount
  }, []);

  return (
    <>
      <View className="flex-1 w-full flex items-center justify-center">
        <View className="flex-1 w-full">
          <View className="w-full flex-1 relative">
            {/* Map Background */}
            <MapView style={{ width: "100%", height: "100%" }} region={mapRegion}>
              <Marker coordinate={mapRegion} title="Marker" />
            </MapView>

            <View className="absolute flex items-center rounded-t-2xl justify-center w-full left-0 bottom-0 bg-[#F0F0F0] ">
              <View className="w-full flex items-center justify-center px-6 py-10">
                <View className="w-full flex items-start justify-center pb-6">
                  <Text className="font-bold text-lg">Dashboard</Text>
                  <Text className="font-normal text-xs text-black/50">
                    Allow location access to provide accurate data
                  </Text>
                </View>

                <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl p-5 mt-2">
                  <View className="w-1/3 flex flex-row items-center justify-start">
                    <View className="pr-2">
                      <Octicons name="location" size={14} />
                    </View>
                    <Text
                      className="text-xs font-semibold text-black"
                      numberOfLines={1}
                    >
                      BottleBot
                    </Text>
                  </View>
                  <View className="w-2/3 flex items-end justify-center">
                    <Text
                      className="text-xs font-normal text-black/50"
                      numberOfLines={1}
                    >
                      #00 Sample St. 0ave., Sample City
                    </Text>
                  </View>
                </View>

                <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl p-5 mt-2">
                  <View className="w-1/3 flex flex-row items-center justify-start">
                    <View className="pr-2">
                      <MaterialIcons name="location-history" size={16} />
                    </View>
                    <Text
                      className="text-xs font-semibold text-black"
                      numberOfLines={1}
                    >
                      User (You)
                    </Text>
                  </View>
                  <View className="w-2/3 flex items-end justify-center">
                    <Text
                      className="text-xs font-normal text-black/50"
                      numberOfLines={1}
                    >
                      #00 Sample St. 0ave., Sample City
                    </Text>
                  </View>
                </View>

                <View className="w-full flex items-center justify-center py-4">
                  <TouchableHighlight
                    className="w-full flex items-center justify-center rounded-xl"
                    underlayColor={"#41917F"}
                    onPress={startNavigation}
                  >
                    <LinearGradient
                      colors={["#00674F", "#06402B"]}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 1, y: 0 }}
                      className="w-full  rounded-xl shadow shadow-[#050301]"
                    >
                      <Text className="flex py-4 bg-transparent text-center text-sm text-white font-semibold">
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
