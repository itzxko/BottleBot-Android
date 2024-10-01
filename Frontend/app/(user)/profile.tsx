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
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/loader";
import axios from "axios";
import Modal from "@/components/modal";
import { useRouter } from "expo-router";

const profile = () => {
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const route = useRouter();

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

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const [edit, setEdit] = useState(false);
  const { user, updateUser, logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    logout();
    route.push("/");
  };

  const updatePassword = async () => {
    if (user) {
      try {
        let url = `http://192.168.254.139:8080/api/users/${user._id}`;

        const response = await axios.put(url, {
          personalInfo: {
            firstName: `${user.personalInfo.firstName}`,
            middleName: `${user.personalInfo.middleName}`,
            lastName: `${user.personalInfo.lastName}`,
            dateOfBirth: `${user.personalInfo.dateOfBirth}`,
            gender: `${user.personalInfo.gender}`,
            civilStatus: `${user.personalInfo.civilStatus}`,
            nationality: `${user.personalInfo.nationality}`,
          },
          contactInfo: {
            address: {
              houseNumber: `${user.contactInfo.address.houseNumber}`,
              street: `${user.contactInfo.address.street}`,
              barangay: `${user.contactInfo.address.barangay}`,
              city: `${user.contactInfo.address.city}`,
            },
            phoneNumbers: `${user.contactInfo.phoneNumbers}`,
          },
          economicInfo: {
            employmentStatus: `${user.economicInfo.employmentStatus}`,
            occupation: `${user.economicInfo.occupation}`,
          },
          credentials: {
            email: `${user.credentials.email}`,
            password: newPassword,
          },
        });

        if (response.status === 200) {
          setMessage(response.data.message);
          setVisibleModal(true);
          setNewPassword("");

          updateUser({
            ...user,
            credentials: {
              ...user.credentials,
              password: newPassword, // Update password
            },
          });
        } else {
          setMessage(response.data.message);
          setVisibleModal(true);
          setNewPassword("");
        }
      } catch (error) {
        const errorMessage =
          (error as Error)?.message || "An unknown error occurred";

        setMessage(errorMessage);
        setVisibleModal(true);
        setNewPassword("");
      }
    }
  };

  return (
    <>
      <SafeAreaView className="flex-1 px-6 bg-[#F0F0F0]">
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
            onPress={handleLogout}
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
          <View className="w-full flex items-center justify-center pt-4">
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
                  <View className="rounded-xl  mr-2">
                    <LinearGradient
                      colors={["#00674F", "#06402B"]}
                      className="flex items-center justify-center px-4 py-2 rounded-xl"
                    >
                      <Text className="text-xs text-white font-normal uppercase">
                        {!user ? "loading..." : `#${user._id}`}
                      </Text>
                    </LinearGradient>
                  </View>
                  <View className="bg-[#E1E1E1] rounded-xl mr-2">
                    <LinearGradient
                      colors={["#00674F", "#06402B"]}
                      className="flex items-center justify-center px-4 py-2 rounded-xl"
                    >
                      <Text className="text-xs text-white font-normal">
                        {!user ? "loading..." : `${user.personalInfo.gender}`}
                      </Text>
                    </LinearGradient>
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
              <Text className="text-xs font-normal text-black/50 pb-2">
                name, birthday, nationality etc.
              </Text>
              {/* Cards */}
              <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl p-5 mt-2">
                <View className="w-1/2 flex flex-row items-center justify-start">
                  <View className="pr-1">
                    <Feather name="user" size={14} color={"rgba(0, 0, 0, 1)"} />
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
              <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl p-5 mt-2">
                <View className="w-1/2 flex flex-row items-center justify-start">
                  <View className="pr-1">
                    <Feather name="mail" size={14} color={"rgba(0, 0, 0, 1)"} />
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
              <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl p-5 mt-2">
                <View className="w-1/2 flex flex-row items-center justify-start">
                  <View className="pr-1">
                    <Feather
                      name="calendar"
                      size={14}
                      color={"rgba(0, 0, 0, 1)"}
                    />
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
              <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl p-5 mt-2">
                <View className="w-1/2 flex flex-row items-center justify-start">
                  <View className="pr-1">
                    <Feather name="map" size={14} color={"rgba(0, 0, 0, 1)"} />
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
                      : `${user.contactInfo.address.houseNumber} ${user.contactInfo.address.street} ${user.contactInfo.address.barangay}, ${user.contactInfo.address.city}`}
                  </Text>
                </View>
              </View>
            </View>
            {/* Additional Information */}
            <View className="w-full flex items-start justify-center py-4">
              <Text className="text-lg font-semibold text-black">
                Additional Information
              </Text>
              <Text className="text-xs font-normal text-black/50 pb-2">
                phone number, address etc.
              </Text>
              {/* Cards */}
              <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl p-5 mt-2">
                <View className="w-1/2 flex flex-row items-center justify-start">
                  <View className="pr-1">
                    <Feather
                      name="smartphone"
                      size={14}
                      color={"rgba(0, 0, 0, 1)"}
                    />
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
              <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl p-5 mt-2">
                <View className="w-1/2 flex flex-row items-center justify-start">
                  <View className="pr-1">
                    <Feather name="flag" size={14} color={"rgba(0, 0, 0, 1)"} />
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
              <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl p-5 mt-2">
                <View className="w-1/2 flex flex-row items-center justify-start">
                  <View className="pr-1">
                    <MaterialIcons
                      name="work-outline"
                      size={14}
                      color={"rgba(0, 0, 0, 1)"}
                    />
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
              <View className="w-full flex flex-row items-center justify-between pb-2">
                <View className="w-1/2 flex items-start justify-center">
                  <Text className="text-lg font-semibold text-black">
                    Privacy and Security
                  </Text>
                  <Text className="text-xs font-normal text-black/50">
                    email, password & role
                  </Text>
                </View>
                {edit ? (
                  <TouchableHighlight
                    className="flex rounded-lg"
                    underlayColor={"#41917F"}
                    onPress={() => {
                      setEdit(false);
                      updatePassword();
                    }}
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
              <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl p-5 mt-2">
                <View className="w-1/2 flex flex-row items-center justify-start">
                  <View className="pr-1">
                    <Feather name="key" size={14} color={"rgba(0, 0, 0, 1)"} />
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
                      onChangeText={setNewPassword}
                      value={newPassword}
                    ></TextInput>
                  ) : (
                    <Text
                      className="text-xs font-normal text-black"
                      numberOfLines={1}
                    >
                      {user?.credentials.password}
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
      {loading && <Loader />}
      {visibleModal && (
        <Modal
          message={message}
          header="Account Update"
          isVisible={visibleModal}
          onClose={() => setVisibleModal(false)}
          icon="profile"
        />
      )}
    </>
  );
};

export default profile;
