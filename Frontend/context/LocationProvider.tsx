import { View, Text } from "react-native";
import React, { createContext, useContext, useState } from "react";
import * as Location from "expo-location";

const LocationContext = createContext<any>(null);

export const LocationProvider = ({ children }: any) => {
  const [defaultLocation, setDefaultLocation] = useState();
  const [yourLocation, setYourLocation] = useState({
    latitude: 14.680105493791455,
    longitude: 121.00993905398246,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setYourLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error("Error getting location:", error);
      alert("Unable to retrieve location. Please try again.");
    }
  };

  const getDefaultLocation = async () => {
    try {
      let url;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <LocationContext.Provider
      value={{ yourLocation, defaultLocation, getUserLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
