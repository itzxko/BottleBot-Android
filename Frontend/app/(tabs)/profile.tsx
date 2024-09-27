import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  ImageBackground,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const profile = () => {
  interface user {
    _id: string;
    personalInfo: {
      firstName: string;
      lastName: string;
      gender: string;
      nationality: string;
      dateOfBirth: Date;
    };
    contactInfo: {
      address: {
        houseNumber: string;
        brgy: string;
        street: string;
        city: string;
      };
      phoneNumbers: [string];
    };
    economicInfo: {
      occupation: string;
    };
    credentials: {
      email: string;
      password: string;
    };
  }

  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState<user | null>(null);
  const navigation = useNavigation();

  const onLogout = () => {};

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await AsyncStorage.getItem("user");

      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    fetchUserData();
  }, []);
  console.log(user);

  return (
    <SafeAreaView className="flex-1 px-6">
      {/* TitleBar */}
      <View className="relative w-full flex flex-row items-center justify-center py-4">
        <TouchableHighlight
          underlayColor={"#C9C9C9"}
          className="absolute left-0 rounded-full"
          onPress={() => navigation.goBack()}
        >
          <View className="p-2 bg-[#E1E1E1] rounded-full flex items-center justify-center">
            <Ionicons name="chevron-back" size={18} />
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={"#C9C9C9"}
          className="absolute right-0 rounded-full"
          onPress={onLogout}
        >
          <View className="p-2.5 bg-[#E1E1E1] rounded-full flex items-center justify-center">
            <Feather name="user-x" size={14} />
          </View>
        </TouchableHighlight>
        <Text className="text-xl font-semibold">Profile</Text>
      </View>
      <ScrollView
        className="flex-1 w-full"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Pic and Name */}
        <View className="w-full flex items-center justify-center py-4">
          <View className="w-full flex items-start justify-center py-2">
            <View className="w-[120px] h-[120px] rounded-full overflow-hidden">
              <ImageBackground
                className="w-full h-full"
                source={require("../../assets/images/Man.jpg")}
              ></ImageBackground>
            </View>
            <View className="w-3/4 flex items-start justify-center py-2">
              <Text className="text-lg font-semibold py-1">
                {!user
                  ? "loading..."
                  : `${user.personalInfo.firstName} ${user.personalInfo.lastName}`}
              </Text>
              <View className="w-full flex flex-row justify-start items-center">
                <View className="flex items-center justify-center bg-[#E1E1E1] rounded-xl px-4 py-2 mr-2">
                  <Text className="text-xs font-normal uppercase">
                    {!user ? "loading..." : `#${user._id}`}
                  </Text>
                </View>
                <View className="flex items-center justify-center bg-[#E1E1E1] rounded-xl px-4 py-2 mr-2">
                  <Text className="text-xs font-normal">
                    {!user ? "loading..." : `${user.personalInfo.gender}`}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* Details */}
        <View className="w-full flex items-center justify-center">
          {/* Basic Information */}
          <View className="w-full flex items-start justify-center py-4">
            <Text className="text-lg font-semibold text-black">
              Basic Informations
            </Text>
            {/* Cards */}
            <View className="w-full flex flex-row items-center justify-between bg-[#E1E1E1] rounded-xl p-5 mt-2">
              <View className="w-1/2 flex flex-row items-center justify-start">
                <View className="pr-2">
                  <Feather name="user" size={16} />
                </View>
                <Text
                  className="text-xs font-semibold text-black"
                  numberOfLines={1}
                >
                  User Name
                </Text>
              </View>
              <View className="w-1/2 flex items-end justify-center">
                <Text
                  className="text-xs font-normal text-black"
                  numberOfLines={1}
                >
                  {!user
                    ? "loading..."
                    : `${user.personalInfo.firstName} ${user.personalInfo.lastName}`}
                </Text>
              </View>
            </View>
            <View className="w-full flex flex-row items-center justify-between bg-[#E1E1E1] rounded-xl p-5 mt-2">
              <View className="w-1/2 flex flex-row items-center justify-start">
                <View className="pr-2">
                  <Feather name="mail" size={16} />
                </View>
                <Text
                  className="text-xs font-semibold text-black"
                  numberOfLines={1}
                >
                  E-mail
                </Text>
              </View>
              <View className="w-1/2 flex items-end justify-center">
                <Text
                  className="text-xs font-normal text-black"
                  numberOfLines={1}
                >
                  {!user ? "loading..." : `${user.credentials.email}`}
                </Text>
              </View>
            </View>
            <View className="w-full flex flex-row items-center justify-between bg-[#E1E1E1] rounded-xl p-5 mt-2">
              <View className="w-1/2 flex flex-row items-center justify-start">
                <View className="pr-2">
                  <Feather name="calendar" size={16} />
                </View>
                <Text
                  className="text-xs font-semibold text-black"
                  numberOfLines={1}
                >
                  Birth Date
                </Text>
              </View>
              <View className="w-1/2 flex items-end justify-center">
                <Text
                  className="text-xs font-normal text-black"
                  numberOfLines={1}
                >
                  {!user || !user.personalInfo.dateOfBirth
                    ? "loading..."
                    : (() => {
                        const date = new Date(user.personalInfo.dateOfBirth);
                        return isNaN(date.getTime())
                          ? "Invalid Date"
                          : date.toLocaleDateString("en-US"); // Format the date as needed
                      })()}
                </Text>
              </View>
            </View>
            <View className="w-full flex flex-row items-center justify-between bg-[#E1E1E1] rounded-xl p-5 mt-2">
              <View className="w-1/2 flex flex-row items-center justify-start">
                <View className="pr-2">
                  <Feather name="map" size={16} />
                </View>
                <Text
                  className="text-xs font-semibold text-black"
                  numberOfLines={1}
                >
                  Address
                </Text>
              </View>
              <View className="w-1/2 flex items-end justify-center">
                <Text
                  className="text-xs font-normal text-black capitalize"
                  numberOfLines={1}
                >
                  {!user
                    ? "loading..."
                    : `${user.contactInfo.address.houseNumber} ${user.contactInfo.address.street} ${user.contactInfo.address.brgy}, ${user.contactInfo.address.city}`}
                </Text>
              </View>
            </View>
          </View>
          {/* Additional Information */}
          <View className="w-full flex items-start justify-center py-4">
            <Text className="text-lg font-semibold text-black">
              Additional Information
            </Text>
            {/* Cards */}
            <View className="w-full flex flex-row items-center justify-between bg-[#E1E1E1] rounded-xl p-5 mt-2">
              <View className="w-1/2 flex flex-row items-center justify-start">
                <View className="pr-2">
                  <Feather name="smartphone" size={16} />
                </View>
                <Text
                  className="text-xs font-semibold text-black"
                  numberOfLines={1}
                >
                  Phone Number
                </Text>
              </View>
              <View className="w-1/2 flex items-end justify-center">
                <Text
                  className="text-xs font-normal text-black"
                  numberOfLines={1}
                >
                  {!user ? "loading..." : `${user.contactInfo.phoneNumbers}`}
                </Text>
              </View>
            </View>
            <View className="w-full flex flex-row items-center justify-between bg-[#E1E1E1] rounded-xl p-5 mt-2">
              <View className="w-1/2 flex flex-row items-center justify-start">
                <View className="pr-2">
                  <Feather name="flag" size={16} />
                </View>
                <Text
                  className="text-xs font-semibold text-black"
                  numberOfLines={1}
                >
                  Nationality
                </Text>
              </View>
              <View className="w-1/2 flex items-end justify-center">
                <Text
                  className="text-xs font-normal text-black"
                  numberOfLines={1}
                >
                  {!user ? "loading..." : `${user.personalInfo.nationality}`}
                </Text>
              </View>
            </View>
            <View className="w-full flex flex-row items-center justify-between bg-[#E1E1E1] rounded-xl p-5 mt-2">
              <View className="w-1/2 flex flex-row items-center justify-start">
                <View className="pr-2">
                  <MaterialIcons name="work-outline" size={16} />
                </View>
                <Text
                  className="text-xs font-semibold text-black"
                  numberOfLines={1}
                >
                  Occupation
                </Text>
              </View>
              <View className="w-1/2 flex items-end justify-center">
                <Text
                  className="text-xs font-normal text-black"
                  numberOfLines={1}
                >
                  {!user ? "loading..." : `${user.economicInfo.occupation}`}
                </Text>
              </View>
            </View>
          </View>
          {/* Security */}
          <View className="w-full flex items-start justify-center py-4">
            <View className="w-full flex flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-black">
                Privacy and Security
              </Text>
              {edit ? (
                <TouchableHighlight
                  className="flex rounded-lg"
                  underlayColor={"#41917F"}
                  onPress={() => setEdit(false)}
                >
                  <View className="px-3 py-1.5 bg-[#00674F] rounded-lg">
                    <Text className="text-xs font-semibold text-white">
                      Save
                    </Text>
                  </View>
                </TouchableHighlight>
              ) : (
                <TouchableHighlight
                  className="flex rounded-lg"
                  underlayColor={"#41917F"}
                  onPress={() => setEdit(true)}
                >
                  <View className="px-3 py-1.5 bg-[#00674F] rounded-lg">
                    <Text className="text-xs font-semibold text-white">
                      Edit
                    </Text>
                  </View>
                </TouchableHighlight>
              )}
            </View>
            {/* Cards */}
            <View className="w-full flex flex-row items-center justify-between bg-[#E1E1E1] rounded-xl p-5 mt-2">
              <View className="w-1/2 flex flex-row items-center justify-start">
                <View className="pr-2">
                  <Feather name="key" size={16} />
                </View>
                <Text
                  className="text-xs font-semibold text-black"
                  numberOfLines={1}
                >
                  Password
                </Text>
              </View>
              <View className="w-1/2 flex items-end justify-center">
                {edit ? (
                  <TextInput
                    className="text-xs font-normal text-black"
                    placeholder="enter new password"
                    autoCapitalize="none"
                  ></TextInput>
                ) : (
                  <Text
                    className="text-xs font-normal text-black"
                    numberOfLines={1}
                  >
                    ***********
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
        <View className="pb-32"></View>

        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default profile;
