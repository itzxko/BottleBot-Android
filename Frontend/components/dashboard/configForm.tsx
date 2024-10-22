import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Loader from "../loader";
import Modal from "../modal";
import { useUrl } from "@/context/UrlProvider";
import axios from "axios";

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

const ConfigForm = ({
  onClose,
  config,
}: {
  onClose: () => void;
  config?: config;
}) => {
  const [locationName, setLocationName] = useState("");
  const [lat, setLat] = useState<string>("");
  const [lon, setLon] = useState<string>("");
  const [baseWeight, setBaseWeight] = useState<number | null>(null);
  const [baseUnit, setBaseUnit] = useState("kg");
  const [equivalentPoints, setEquivalentPoints] = useState<number | null>(null);

  //loaders
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState(false);
  const { ipAddress, port } = useUrl();

  const getAddress = async (latitude: number, longitude: number) => {
    const apiKey = "72d5a1df72ec497ea48fbb7f2842a176"; // Replace with your OpenCage API key
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.results.length > 0) {
        setLocationName(data.results[0].formatted); // Use the formatted address
      } else {
        setLocationName("Address not found");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setLocationName("Error fetching address");
    }
  };

  const handleLatChange = (text: string) => {
    setLat(text);
    const parsedLat = parseFloat(text);
    if (!isNaN(parsedLat) && lon) {
      getAddress(parsedLat, parseFloat(lon));
    }
  };

  const handleLonChange = (text: string) => {
    setLon(text);
    const parsedLon = parseFloat(text);
    if (!isNaN(parsedLon) && lat) {
      getAddress(parseFloat(lat), parsedLon);
    }
  };

  const handleUnitToggle = () => {
    if (baseUnit === "kg") {
      setBaseUnit("g");
    } else if (baseUnit === "g") {
      setBaseUnit("lb");
    } else if (baseUnit === "lb") {
      setBaseUnit("kg");
    }
  };

  const checkConfig = async () => {
    try {
      let url = `http://${ipAddress}:${port}/api/configurations`;

      let response = await axios.get(url);

      if (
        response.data.message === "There are already existing configurations"
      ) {
        updateBotConfig();
      } else {
        addBotConfig();
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (config) {
      setLocationName(config.defaultLocation.locationName);
      setLat(config.defaultLocation.lat.toString());
      setLon(config.defaultLocation.lon.toString());
      setBaseUnit(config.bottleExchange.baseUnit);
      setBaseWeight(config.bottleExchange.baseWeight);
      setEquivalentPoints(config.bottleExchange.equivalentInPoints);
    }
  }, []);

  const addBotConfig = async () => {
    setLoading(true);
    try {
      let url = `http://${ipAddress}:${port}/api/configurations`;

      let response = await axios.post(url, {
        defaultLocation: {
          locationName: locationName,
          lat: lat,
          lon: lon,
        },
        bottleExchange: {
          baseWeight: baseWeight,
          baseUnit: baseUnit,
          equivalentInPoints: equivalentPoints,
        },
      });

      if (response.data.success === true) {
        setIsError(false);
        setModal(true);
        setMessage(response.data.message);
      }
    } catch (error: any) {
      setIsError(true);
      setModal(true);
      setMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const updateBotConfig = async () => {
    setLoading(true);
    try {
      let url = `http://${ipAddress}:${port}/api/configurations/${config?._id}`;

      let response = await axios.put(url, {
        defaultLocation: {
          locationName: locationName,
          lat: lat,
          lon: lon,
        },
        bottleExchange: {
          baseWeight: baseWeight,
          baseUnit: baseUnit,
          equivalentInPoints: equivalentPoints,
        },
      });

      if (response.data.success === true) {
        setIsError(false);
        setModal(true);
        setMessage(response.data.message);
      }
    } catch (error: any) {
      setIsError(true);
      setModal(true);
      setMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1 px-4 absolute top-0 left-0 bottom-0 right-0 bg-black/50"
      >
        <SafeAreaView className="flex-1">
          <View className="flex-1 justify-center items-center">
            {/* Use flex-1 to take full height */}
            <View className="flex p-4 justify-center items-center bg-[#F0F0F0] rounded-3xl w-4/5">
              {/* Inner View for padding */}
              <View className="flex flex-row items-start justify-between w-full pb-6">
                <View className="w-2/3 flex items-start justify-center">
                  <Text className="text-lg font-semibold" numberOfLines={1}>
                    Input Fields
                  </Text>
                  <Text
                    className="text-xs font-normal text-black/50"
                    numberOfLines={1}
                  >
                    fill out all fields to continue
                  </Text>
                </View>
                <Pressable onPress={onClose}>
                  <Feather name="x" size={16} color={"black"} />
                </Pressable>
              </View>
              <View className="w-full flex flex-col  items-center justify-center pb-6">
                <View className="w-full flex flex-row items-center justify-between">
                  <View className="w-[48%] flex items-start justify-center py-2">
                    <Text className="text-xs font-semibold pb-2">Latitude</Text>
                    <TextInput
                      className="w-full bg-[#E6E6E6] rounded-xl text-xs font-normal py-2 px-4"
                      numberOfLines={1}
                      placeholder="latitude"
                      keyboardType="numeric"
                      value={lat ? lat.toString() : ""}
                      onChangeText={handleLatChange}
                    />
                  </View>
                  <View className="w-[48%] flex items-start justify-center py-2">
                    <Text className="text-xs font-semibold pb-2">
                      Longitude
                    </Text>
                    <TextInput
                      className="w-full bg-[#E6E6E6] rounded-xl text-xs font-normal py-2 px-4"
                      numberOfLines={1}
                      keyboardType="numeric"
                      placeholder="longitude"
                      value={lon ? lon.toString() : ""}
                      onChangeText={handleLonChange}
                    />
                  </View>
                </View>
                <View className="w-full flex items-start justify-center py-2">
                  <Text className="text-xs font-semibold pb-2">Address</Text>
                  <View className="w-full flex items-center justify-center bg-[#E6E6E6] rounded-xl px-4 py-[15px]">
                    <Text
                      className="text-xs font-normal w-full text-left"
                      numberOfLines={1}
                    >
                      {locationName}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="w-full flex flex-col  items-center justify-center">
                <View className="w-full flex flex-row items-center justify-between">
                  <View className="w-[48%] flex items-start justify-center py-2">
                    <Text className="text-xs font-semibold pb-2">
                      Base Weight
                    </Text>
                    <TextInput
                      className="w-full bg-[#E6E6E6] rounded-xl text-xs font-normal py-2 px-4"
                      numberOfLines={1}
                      placeholder="base weight"
                      value={baseWeight ? baseWeight.toString() : ""}
                      onChangeText={(text) => setBaseWeight(Number(text))}
                      keyboardType="numeric"
                    />
                  </View>
                  <View className="w-[48%] flex items-start justify-center py-2">
                    <Text className="text-xs font-semibold pb-2">
                      Equivalent Points
                    </Text>
                    <TextInput
                      className="w-full bg-[#E6E6E6] rounded-xl text-xs font-normal py-2 px-4"
                      numberOfLines={1}
                      keyboardType="numeric"
                      value={
                        equivalentPoints ? equivalentPoints.toString() : ""
                      }
                      onChangeText={(text) => setEquivalentPoints(Number(text))}
                      placeholder="equivalent"
                    />
                  </View>
                </View>
                <View className="w-full flex items-start justify-center py-2">
                  <Text className="text-xs font-semibold pb-2">Address</Text>
                  <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl px-4 py-2">
                    <Text
                      className="text-xs font-normal w-1/2 text-left"
                      numberOfLines={1}
                    >
                      {baseUnit}
                    </Text>
                    <Pressable
                      onPress={handleUnitToggle}
                      className="p-2 bg-black rounded-full"
                    >
                      <Feather name="rotate-cw" size={12} color={"white"} />
                    </Pressable>
                  </View>
                </View>
              </View>
              <Pressable
                className="w-full pt-4"
                onPress={config ? updateBotConfig : addBotConfig}
              >
                <LinearGradient
                  colors={["#00674F", "#06402B"]}
                  className="flex items-center justify-center w-full px-4 py-[14px] rounded-xl"
                >
                  <Text className="text-xs font-semibold text-white">
                    Proceed
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
          <View className="w-full pb-32"></View>
        </SafeAreaView>
      </ScrollView>
      {loading && <Loader />}
      {modal && (
        <Modal
          header="location"
          message={message}
          onClose={() => {
            setModal(false);
            if (!isError) {
              onClose();
            }
          }}
          isVisible={modal}
          icon="redeem"
        />
      )}
    </>
  );
};

export default ConfigForm;
