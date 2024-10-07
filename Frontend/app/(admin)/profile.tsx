import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  ImageBackground,
  TextInput,
  Pressable,
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
import { useUrl } from "@/context/UrlProvider";

interface user {
  _id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    middleName: string;
    dateOfBirth: Date;
    gender: string;
    civilStatus: string;
    nationality: string;
  };
  contactInfo: {
    address: {
      houseNumber: number;
      street: string;
      barangay: string;
      city: string;
    };
    phoneNumbers: [string];
  };
  economicInfo: {
    employmentStatus: string;
    occupation: string;
  };
  credentials: {
    level: string;
    email: string;
    password: string;
  };
}
const profile = () => {
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const route = useRouter();
  const { ipAddress, port } = useUrl();
  const { user, updateUser, logout } = useAuth();
  const [isError, setIsError] = useState(false);

  //fields state of users
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [nationality, setNationality] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [brgy, setBrgy] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [occupation, setOccupation] = useState("");
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState("");

  const [edit, setEdit] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchUser();
  }, []);

  const setFieldsData = (user: user) => {
    setFirstName(user?.personalInfo.firstName);
    setMiddleName(user?.personalInfo.middleName);
    setLastName(user?.personalInfo.lastName);
    setBirthDate(formattedDate);
    setGender(user?.personalInfo.gender);
    setCivilStatus(user?.personalInfo.civilStatus);
    setNationality(user?.personalInfo.nationality);
    setHouseNumber(user?.contactInfo.address.houseNumber.toString());
    setStreet(user?.contactInfo.address.street);
    setBrgy(user?.contactInfo.address.barangay);
    setCity(user?.contactInfo.address.city);
    setPhoneNumber(user?.contactInfo.phoneNumbers[0]);
    setEmploymentStatus(user?.economicInfo.employmentStatus);
    setOccupation(user?.economicInfo.occupation);
    setEmail(user.credentials.email);
    setPassword(user?.credentials.password);
    setLevel(user?.credentials.level);
  };

  const handleLogout = () => {
    logout();
    route.push("/");
  };

  const updateProfile = async () => {
    setLoading(true);
    if (user) {
      try {
        let url = `http://${ipAddress}:${port}/api/users/${user._id}`;

        const response = await axios.put(url, {
          personalInfo: {
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            dateOfBirth: birthDate,
            gender: gender,
            civilStatus: civilStatus,
            nationality: nationality,
          },
          contactInfo: {
            address: {
              houseNumber: houseNumber,
              street: street,
              barangay: brgy,
              city: city,
            },
            phoneNumbers: [phoneNumber],
          },
          economicInfo: {
            employmentStatus: employmentStatus,
            occupation: occupation,
          },
          credentials: {
            email: email,
            password: password,
          },
        });

        if (response.status === 200) {
          setMessage(response.data.message);
          setVisibleModal(true);
          setIsError(false);
        }
      } catch (error: any) {
        setMessage(error.response.data.message);
        setVisibleModal(true);
        setIsError(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchUser = async () => {
    setLoading(true);
    if (user) {
      try {
        let url = `http://${ipAddress}:${port}/api/users/${user._id}`;

        let response = await axios.get(url);

        if (response.status === 200) {
          updateUser(response.data.user);
          setFieldsData(response.data.user);
          console.log(user);
        }
      } catch (error: any) {
        setMessage(error.response.data.message);
        setVisibleModal(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const formattedDate = (() => {
    if (!user || !user.personalInfo.dateOfBirth) {
      return "loading...";
    }

    const date = new Date(user.personalInfo.dateOfBirth);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-US"); // Format the date as needed
  })();

  return (
    <>
      <SafeAreaView className="flex-1 px-4 bg-[#F0F0F0]">
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
                  <View className="rounded-full  mr-1 max-w-[50%]">
                    <LinearGradient
                      colors={["#00674F", "#06402B"]}
                      className="flex items-center justify-center px-4 py-2 rounded-full"
                    >
                      <Text
                        className="text-xs text-white font-normal uppercase"
                        numberOfLines={1}
                      >
                        {!user ? "loading..." : `#${user._id}`}
                      </Text>
                    </LinearGradient>
                  </View>
                  <View className="bg-[#E1E1E1] rounded-xl mr-2 max-w-[30%]">
                    <LinearGradient
                      colors={["#00674F", "#06402B"]}
                      className="flex items-center justify-center px-4 py-2 rounded-full"
                    >
                      <Text
                        className="text-xs text-white font-normal"
                        numberOfLines={1}
                      >
                        {!user ? "loading..." : `${user.personalInfo.gender}`}
                      </Text>
                    </LinearGradient>
                  </View>
                  <View className="flex flex-row justify-start items-center">
                    {!edit ? (
                      <Pressable
                        className="p-2 bg-[#050301] rounded-full"
                        onPress={() => setEdit(true)}
                      >
                        <Feather name="edit-2" size={14} color={"white"} />
                      </Pressable>
                    ) : (
                      <>
                        <Pressable
                          className="p-2 bg-[#050301] rounded-full mr-2"
                          onPress={() => {
                            fetchUser();
                            setEdit(false);
                          }}
                        >
                          <Feather name="x" size={14} color={"white"} />
                        </Pressable>
                        <Pressable
                          className="p-2 bg-[#050301] rounded-full"
                          onPress={updateProfile}
                        >
                          <Feather name="check" size={14} color={"white"} />
                        </Pressable>
                      </>
                    )}
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
              <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-3 mt-2">
                <View className="w-1/2 flex flex-row items-center justify-start">
                  <View className="pr-1">
                    <Feather name="user" size={14} color={"rgba(0, 0, 0, 1)"} />
                  </View>
                  <Text
                    className="text-xs font-semibold text-black"
                    numberOfLines={1}
                  >
                    First Name
                  </Text>
                </View>
                <View className="w-1/2 flex items-end justify-center">
                  <TextInput
                    className="w-full text-xs font-normal text-right"
                    numberOfLines={1}
                    value={firstName}
                    onChangeText={(text) => setFirstName(text)}
                    placeholder="your firstname"
                    editable={edit ? true : false}
                  />
                </View>
              </View>
              <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-3 mt-2">
                <View className="w-1/2 flex flex-row items-center justify-start">
                  <View className="pr-1">
                    <Feather name="mail" size={14} color={"rgba(0, 0, 0, 1)"} />
                  </View>
                  <Text
                    className="text-xs font-semibold text-black"
                    numberOfLines={1}
                  >
                    Middle Name
                  </Text>
                </View>
                <View className="w-1/2 flex items-end justify-center">
                  <TextInput
                    className="w-full text-xs font-normal text-right"
                    numberOfLines={1}
                    value={middleName}
                    onChangeText={(text) => setMiddleName(text)}
                    placeholder="your middlename"
                    editable={edit ? true : false}
                  />
                </View>
              </View>
              <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-3 mt-2">
                <View className="w-1/2 flex flex-row items-center justify-start">
                  <View className="pr-1">
                    <Feather name="mail" size={14} color={"rgba(0, 0, 0, 1)"} />
                  </View>
                  <Text
                    className="text-xs font-semibold text-black"
                    numberOfLines={1}
                  >
                    Last Name
                  </Text>
                </View>
                <View className="w-1/2 flex items-end justify-center">
                  <TextInput
                    className="w-full text-xs font-normal text-right"
                    numberOfLines={1}
                    value={lastName}
                    onChangeText={(text) => setLastName(text)}
                    placeholder="your lastname"
                    editable={edit ? true : false}
                  />
                </View>
              </View>
              <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-3 mt-2">
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
                  <TextInput
                    className="w-full text-xs font-normal text-right"
                    numberOfLines={1}
                    value={birthDate}
                    onChangeText={(text) => setBirthDate(text)}
                    placeholder="yyyy-mm-dd"
                    editable={edit ? true : false}
                  />
                </View>
              </View>
              <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-3 mt-2">
                <View className="w-1/2 flex flex-row items-center justify-start">
                  <View className="pr-1">
                    <Feather name="map" size={14} color={"rgba(0, 0, 0, 1)"} />
                  </View>
                  <Text
                    className="text-xs font-semibold text-black"
                    numberOfLines={1}
                  >
                    Gender
                  </Text>
                </View>
                <View className="w-1/2 flex items-end justify-center">
                  <TextInput
                    className="w-full text-xs font-normal text-right"
                    numberOfLines={1}
                    value={gender}
                    onChangeText={(text) => setGender(text)}
                    placeholder="male or female"
                    editable={edit ? true : false}
                  />
                </View>
              </View>
              <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-3 mt-2">
                <View className="w-1/2 flex flex-row items-center justify-start">
                  <View className="pr-1">
                    <Feather name="map" size={14} color={"rgba(0, 0, 0, 1)"} />
                  </View>
                  <Text
                    className="text-xs font-semibold text-black"
                    numberOfLines={1}
                  >
                    Civil Status
                  </Text>
                </View>
                <View className="w-1/2 flex items-end justify-center">
                  <TextInput
                    className="w-full text-xs font-normal text-right"
                    numberOfLines={1}
                    value={civilStatus}
                    onChangeText={(text) => setCivilStatus(text)}
                    placeholder="your civil status"
                    editable={edit ? true : false}
                  />
                </View>
              </View>
              <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-3 mt-2">
                <View className="w-1/2 flex flex-row items-center justify-start">
                  <View className="pr-1">
                    <Feather name="map" size={14} color={"rgba(0, 0, 0, 1)"} />
                  </View>
                  <Text
                    className="text-xs font-semibold text-black"
                    numberOfLines={1}
                  >
                    Nationality
                  </Text>
                </View>
                <View className="w-1/2 flex items-end justify-center">
                  <TextInput
                    className="w-full text-xs font-normal text-right"
                    numberOfLines={1}
                    value={nationality}
                    onChangeText={(text) => setNationality(text)}
                    placeholder="your nationality"
                    editable={edit ? true : false}
                  />
                </View>
              </View>
            </View>
            {/* Additional Information */}
            <View className="w-full flex items-start justify-center py-4">
              <Text className="text-lg font-semibold text-black">
                Contact Information
              </Text>
              <Text className="text-xs font-normal text-black/50 pb-2">
                phone number, address etc.
              </Text>
              {/* Cards */}
              <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-3 mt-2">
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
                    House Number
                  </Text>
                </View>
                <View className="w-1/2 flex items-end justify-center">
                  <TextInput
                    className="w-full text-xs font-normal text-right"
                    numberOfLines={1}
                    value={houseNumber}
                    onChangeText={(text) => setHouseNumber(text)}
                    placeholder="house number"
                    editable={edit ? true : false}
                  />
                </View>
              </View>
              <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-3 mt-2">
                <View className="w-1/2 flex flex-row items-center justify-start">
                  <View className="pr-1">
                    <Feather name="flag" size={14} color={"rgba(0, 0, 0, 1)"} />
                  </View>
                  <Text
                    className="text-xs font-semibold text-black"
                    numberOfLines={1}
                  >
                    Street
                  </Text>
                </View>
                <View className="w-1/2 flex items-end justify-center">
                  <TextInput
                    className="w-full text-xs font-normal text-right"
                    numberOfLines={1}
                    value={street}
                    onChangeText={(text) => setStreet(text)}
                    placeholder="street"
                    editable={edit ? true : false}
                  />
                </View>
              </View>
              <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-3 mt-2">
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
                    Barangay
                  </Text>
                </View>
                <View className="w-1/2 flex items-end justify-center">
                  <TextInput
                    className="w-full text-xs font-normal text-right"
                    numberOfLines={1}
                    value={brgy}
                    onChangeText={(text) => setBrgy(text)}
                    placeholder="brgy number"
                    editable={edit ? true : false}
                  />
                </View>
              </View>
              <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-3 mt-2">
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
                    City
                  </Text>
                </View>
                <View className="w-1/2 flex items-end justify-center">
                  <TextInput
                    className="w-full text-xs font-normal text-right"
                    numberOfLines={1}
                    value={city}
                    onChangeText={(text) => setCity(text)}
                    placeholder="city/municipality"
                    editable={edit ? true : false}
                  />
                </View>
              </View>
              <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-3 mt-2">
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
                    Phone Number
                  </Text>
                </View>
                <View className="w-1/2 flex items-end justify-center">
                  <TextInput
                    className="w-full text-xs font-normal text-right"
                    numberOfLines={1}
                    value={phoneNumber}
                    onChangeText={(text) => setPhoneNumber(text)}
                    placeholder="your contact number"
                    editable={edit ? true : false}
                  />
                </View>
              </View>
            </View>
            <View className="w-full flex items-start justify-center py-4">
              <Text className="text-lg font-semibold text-black">
                Economic Information
              </Text>
              <Text className="text-xs font-normal text-black/50 pb-2">
                employment and occupation
              </Text>
              {/* Cards */}
              <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-3 mt-2">
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
                    Employment Status
                  </Text>
                </View>
                <View className="w-1/2 flex items-end justify-center">
                  <TextInput
                    className="w-full text-xs font-normal text-right"
                    numberOfLines={1}
                    value={employmentStatus}
                    onChangeText={(text) => setEmploymentStatus(text)}
                    placeholder="employed or what"
                    editable={edit ? true : false}
                  />
                </View>
              </View>
              <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-3 mt-2">
                <View className="w-1/2 flex flex-row items-center justify-start">
                  <View className="pr-1">
                    <Feather name="flag" size={14} color={"rgba(0, 0, 0, 1)"} />
                  </View>
                  <Text
                    className="text-xs font-semibold text-black"
                    numberOfLines={1}
                  >
                    Occupation
                  </Text>
                </View>
                <View className="w-1/2 flex items-end justify-center">
                  <TextInput
                    className="w-full text-xs font-normal text-right"
                    numberOfLines={1}
                    value={occupation}
                    onChangeText={(text) => setOccupation(text)}
                    placeholder="work"
                    editable={edit ? true : false}
                  />
                </View>
              </View>
            </View>
            {/* Security */}
            <View className="w-full flex items-start justify-center py-4">
              <View className="w-full flex items-center justify-center pb-2">
                <View className="w-full flex items-start justify-center py-2">
                  <Text className="text-lg font-semibold text-black">
                    Privacy and Security
                  </Text>
                  <Text className="text-xs font-normal text-black/50">
                    email, password & role
                  </Text>
                </View>
                <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-3 mt-2">
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
                      Email
                    </Text>
                  </View>
                  <View className="w-1/2 flex items-end justify-center">
                    <TextInput
                      className="w-full text-xs font-normal text-right"
                      numberOfLines={1}
                      value={email}
                      onChangeText={(text) => setEmail(text)}
                      placeholder="email address"
                      editable={edit ? true : false}
                    />
                  </View>
                </View>
                <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-3 mt-2">
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
                      Password
                    </Text>
                  </View>
                  <View className="w-1/2 flex items-end justify-center">
                    <TextInput
                      className="w-full text-xs font-normal text-right"
                      numberOfLines={1}
                      value={password}
                      onChangeText={(text) => setPassword(text)}
                      placeholder="your password"
                      editable={edit ? true : false}
                    />
                  </View>
                </View>
                <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-3 mt-2">
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
                      Level
                    </Text>
                  </View>
                  <View className="w-1/2 flex items-end justify-center">
                    <TextInput
                      className="w-full text-xs font-normal text-right"
                      numberOfLines={1}
                      value={level}
                      onChangeText={(text) => setLevel(text)}
                      editable={false}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View className="pb-24"></View>

          <StatusBar style="auto" />
        </ScrollView>
      </SafeAreaView>
      {loading && <Loader />}
      {visibleModal && (
        <Modal
          message={message}
          header="Account Update"
          isVisible={visibleModal}
          onClose={() => {
            setVisibleModal(false);
            if (!isError) {
              setEdit(false);
              fetchUser();
            }
          }}
          icon="profile"
        />
      )}
    </>
  );
};

export default profile;
