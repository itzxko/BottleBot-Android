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
import { Image } from "expo-image";
import ConfigForm from "@/components/dashboard/configForm";
import { useLocation } from "@/context/LocationProvider";
import { useUrl } from "@/context/UrlProvider";
import axios from "axios";
import RemixIcon from "react-native-remix-icon";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { queue, initializeWebSocket, deleteFromQueue, addtoQueue } =
    useQueue();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [configForm, setConfigForm] = useState(false);
  const { yourLocation, defaultLocation, getUserLocation } = useLocation();
  const [config, setConfig] = useState<config | undefined>();
  const { ipAddress, port } = useUrl();
  const [mapRegion, setMapRegion] = useState({
    latitude: 14.680105493791455,
    longitude: 121.00993905398246,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  interface config {
    defaultLocation: {
      lat: number;
      lon: number;
      locationName: string;
    };
    bottleExchange: {
      baseWeight: number;
      baseUnit: string;
      equivalentInPoints: number;
    };
    _id: string;
  }

  useEffect(() => {
    const getLocation = async () => {
      setLoading(true);
      await getUserLocation();
      setLoading(false);
    };

    getLocation();
    checkConfig();
  }, []);

  const checkConfig = async () => {
    try {
      let url = `http://${ipAddress}:${port}/api/configurations`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        setConfig(response.data.config);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <View className="flex-1 w-full flex items-center justify-center">
        <View className="flex-1 w-full">
          <View className="w-full flex-1 relative">
            {/* Map Background */}
            <MapView
              style={{ width: "100%", height: "100%" }}
              region={yourLocation}
            >
              <Marker coordinate={yourLocation} title="Your Location">
                <Image
                  source={require("../../assets/images/Admin-Pin.png")}
                  className="w-[56px] h-[56px]"
                />
              </Marker>
              {config && (
                <Marker
                  coordinate={{
                    latitude: config.defaultLocation.lat,
                    longitude: config.defaultLocation.lon,
                  }}
                  title="Default Location"
                >
                  <Image
                    source={require("../../assets/images/Default-Pin.png")}
                    className="w-[56px] h-[56px]"
                  />
                </Marker>
              )}
            </MapView>

            <View className="w-full h-full absolute top-0 left-0">
              <LinearGradient
                colors={["rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 1)"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 0, y: 1 }}
                className="flex-1"
              />
            </View>

            <View className="absolute flex items-center rounded-t-3xl justify-center w-full left-0 bottom-0 bg-[#FAFAFA] ">
              <View className="w-full flex items-center justify-center px-4 py-8">
                {/* Header */}
                <View className="w-full flex items-center justify-center pb-6">
                  <Text className="font-bold text-sm">Dashboard</Text>
                  <Text className="font-normal text-xs text-black/50">
                    Allow location access to provide accurate data
                  </Text>
                </View>
                {/* BottleBot */}
                <View className="w-full flex flex-row items-center justify-between pl-2 pr-6 py-2 bg-[#E6E6E6] rounded-full mb-2">
                  <View className="max-w-[50%] flex flex-row items-center justify-start px-4 py-2.5 rounded-full bg-[#050301]">
                    <Pressable>
                      <RemixIcon
                        name="map-pin-2-line"
                        size={16}
                        color="white"
                      />
                    </Pressable>
                    <Text
                      className="text-xs font-normal text-white pl-2"
                      numberOfLines={1}
                    >
                      BottleBot Location
                    </Text>
                  </View>
                  <TextInput
                    className="text-xs font-normal max-w-[50%] text-right"
                    placeholder="single"
                    numberOfLines={1}
                    readOnly={true}
                    value={`${yourLocation.latitude.toString()}, ${yourLocation.longitude.toString()}`}
                  ></TextInput>
                </View>
                {/* User */}
                <View className="w-full flex flex-row items-center justify-between pl-2 pr-6 py-2 bg-[#E6E6E6] rounded-full mb-2">
                  <View className="max-w-[50%] flex flex-row items-center justify-start px-4 py-2.5 rounded-full bg-[#050301]">
                    <Pressable>
                      <RemixIcon
                        name="map-pin-2-line"
                        size={16}
                        color="white"
                      />
                    </Pressable>
                    <Text
                      className="text-xs font-normal text-white pl-2"
                      numberOfLines={1}
                    >
                      Your Location
                    </Text>
                  </View>
                  <TextInput
                    className="text-xs font-normal max-w-[50%] text-right"
                    placeholder="single"
                    numberOfLines={1}
                    readOnly={true}
                    value={`${yourLocation.latitude.toString()}, ${yourLocation.longitude.toString()}`}
                  />
                </View>
                <View className="w-full flex items-center justify-center py-4">
                  <TouchableHighlight
                    className="w-full flex items-center justify-center rounded-xl"
                    underlayColor={"#41917F"}
                    onPress={() =>
                      addtoQueue({
                        userId: user?._id,
                        lon: yourLocation.longitude,
                        lat: yourLocation.latitude,
                        locationName: "shitty place",
                        status: "pending",
                      })
                    }
                  >
                    <LinearGradient
                      colors={["#699900", "#466600"]}
                      className="w-full  rounded-xl shadow shadow-[#050301]"
                    >
                      <Text className="flex py-3.5 bg-transparent text-center text-sm text-white font-semibold">
                        Start Navigation
                      </Text>
                    </LinearGradient>
                  </TouchableHighlight>
                </View>
              </View>
              <View className="pb-16"></View>
            </View>
          </View>
        </View>
      </View>
      {loading && <Loader />}
      {configForm && (
        <ConfigForm
          onClose={() => {
            setConfigForm(false);
            checkConfig();
          }}
          config={config}
        />
      )}
    </>
  );
};

export default Dashboard;
