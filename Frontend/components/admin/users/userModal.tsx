import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  TextInput,
  Keyboard,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import Modal from "../../modal";
import { useUrl } from "@/context/UrlProvider";
import Loader from "../../loader";
import DateTimePicker from "@react-native-community/datetimepicker";

const Usermodal = ({
  onClose,
  accountLevel,
}: {
  onClose: () => void;
  accountLevel: string;
}) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [message, setMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [gender, setGender] = useState("Male");
  const [civilStatus, setCivilStatus] = useState("Single");
  const [nationality, setNationality] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [brgy, setBrgy] = useState("");
  const [city, setCity] = useState("");
  const [number, setNumber] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [occupation, setOccupation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState("citizen");
  const { ipAddress, port } = useUrl();
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [changeLevel, setChangeLevel] = useState(true);

  //datepicker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formattedBirthDate, setFormattedBirthDate] = useState("");

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(false);
    setBirthDate(currentDate);
    setFormattedBirthDate(formatDate(currentDate));
  };

  const registerUser = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      let url = `http://${ipAddress}:${port}/api/users/register`;

      let response = await axios.post(url, {
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
          phoneNumbers: [number],
        },
        economicInfo: {
          employmentStatus: employmentStatus,
          occupation: occupation,
        },
        credentials: {
          email: email,
          password: password,
          level: level,
        },
      });

      if (response.status === 200) {
        setVisibleModal(true);
        setMessage(response.data.message);
        setIsError(false);
      }
    } catch (error: any) {
      setVisibleModal(true);
      setMessage(error.response.data.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLevelToggle = () => {
    setChangeLevel(!changeLevel);

    if (level === "citizen") {
      setLevel("staff");
    } else if (level === "staff") {
      setLevel("admin");
    } else {
      setLevel("citizen");
    }
  };

  const handleGenderToggle = () => {
    if (gender === "Male") {
      setGender("Female");
    } else if (gender === "Female") {
      setGender("Other");
    } else if (gender === "Other") {
      setGender("Male");
    }
  };

  const handleStatusToggle = () => {
    if (civilStatus === "Single") {
      setCivilStatus("Married");
    } else if (civilStatus === "Married") {
      setCivilStatus("Widowed");
    } else if (civilStatus === "Widowed") {
      setCivilStatus("Single");
    }
  };

  return (
    <>
      <SafeAreaView className="flex-1 px-6 absolute top-0 left-0 bottom-0 right-0 bg-[#F0F0F0]">
        {/* TitleBar */}
        <View className="relative w-full flex flex-row items-center justify-center py-4">
          <TouchableHighlight
            underlayColor={"#C9C9C9"}
            className="absolute left-0 rounded-full"
            onPress={onClose}
          >
            <View className="p-2 bg-[#E1E1E1] rounded-full flex items-center justify-center">
              <Ionicons name="chevron-back" size={18} />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={"#C9C9C9"}
            className="absolute right-0 rounded-full"
            onPress={registerUser}
          >
            <View className="p-2 bg-[#E1E1E1] rounded-full flex items-center justify-center">
              <Feather name="check" size={18} />
            </View>
          </TouchableHighlight>
          <Text className="text-xl font-semibold">New User</Text>
        </View>
        <ScrollView
          className="flex-1 w-full"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full flex items-center justify-center py-2">
            {/* Personal Information */}
            <View className="w-full py-4">
              {/* Title */}
              <View className="w-full flex items-start justify-center pb-4">
                <Text className="text-lg font-semibold">
                  Personal Information
                </Text>
                <Text className="text-xs font-normal text-black/50">
                  name, birthday, nationality etc.
                </Text>
              </View>
              {/* First Name */}
              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">First Name</Text>
                <TextInput
                  className="text-xs font-normal max-w-[50%] text-right"
                  placeholder="enter first name"
                  numberOfLines={1}
                  value={firstName}
                  onChangeText={setFirstName}
                ></TextInput>
              </View>
              {/* Middle Name */}
              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">Middle Name</Text>
                <TextInput
                  className="text-xs font-normal max-w-[50%] text-right"
                  placeholder="enter middle name"
                  numberOfLines={1}
                  value={middleName}
                  onChangeText={setMiddleName}
                ></TextInput>
              </View>
              {/* Last Name */}
              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">Last Name</Text>
                <TextInput
                  className="text-xs font-normal max-w-[50%] text-right"
                  placeholder="enter last name"
                  numberOfLines={1}
                  value={lastName}
                  onChangeText={setLastName}
                ></TextInput>
              </View>
              {/* Birth Date */}
              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">Birth Date</Text>
                <View className="w-1/2 flex flex-row items-center justify-end ">
                  <Text className="text-xs font-normal pr-1" numberOfLines={1}>
                    {formattedBirthDate || "Select a date"}
                  </Text>
                  <Pressable
                    onPress={() => setShowDatePicker(true)}
                    className="p-2 bg-black rounded-full"
                  >
                    <Feather name="calendar" size={12} color={"white"} />
                  </Pressable>
                </View>
              </View>
              {showDatePicker && (
                <DateTimePicker
                  value={birthDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
              {/* Gender */}
              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">Gender</Text>
                <View className="w-1/2 flex flex-row items-center justify-end ">
                  <Text className="text-xs font-normal pr-1" numberOfLines={1}>
                    {gender}
                  </Text>
                  <Pressable
                    onPress={handleGenderToggle}
                    className="p-2 bg-black rounded-full"
                  >
                    <Feather name="rotate-cw" size={12} color={"white"} />
                  </Pressable>
                </View>
              </View>
              {/* Civil Status */}
              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">Civil Status</Text>
                <View className="w-1/2 flex flex-row items-center justify-end ">
                  <Text className="text-xs font-normal pr-1" numberOfLines={1}>
                    {civilStatus}
                  </Text>
                  <Pressable
                    onPress={handleStatusToggle}
                    className="p-2 bg-black rounded-full"
                  >
                    <Feather name="rotate-cw" size={12} color={"white"} />
                  </Pressable>
                </View>
              </View>
              {/* Nationality */}
              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">Nationality</Text>
                <TextInput
                  className="text-xs font-normal max-w-[50%] text-right"
                  placeholder="your nationality"
                  numberOfLines={1}
                  value={nationality}
                  onChangeText={setNationality}
                ></TextInput>
              </View>
            </View>
            {/* Contact Information */}
            <View className="w-full py-4">
              {/* Title */}
              <View className="w-full flex items-start justify-center pb-4">
                <Text className="text-lg font-semibold">
                  Contact Information
                </Text>
                <Text className="text-xs font-normal text-black/50">
                  phone number, address etc.
                </Text>
              </View>
              {/* House Number */}
              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">House Number</Text>
                <TextInput
                  className="text-xs font-normal max-w-[50%] text-right"
                  placeholder="enter house number"
                  numberOfLines={1}
                  value={houseNumber}
                  onChangeText={setHouseNumber}
                ></TextInput>
              </View>
              {/* Street */}
              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">Street</Text>
                <TextInput
                  className="text-xs font-normal max-w-[50%] text-right"
                  placeholder="house street"
                  numberOfLines={1}
                  value={street}
                  onChangeText={setStreet}
                ></TextInput>
              </View>
              {/* Barangay */}
              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">Barangay</Text>
                <TextInput
                  className="text-xs font-normal max-w-[50%] text-right"
                  placeholder="brgy no."
                  numberOfLines={1}
                  value={brgy}
                  onChangeText={setBrgy}
                ></TextInput>
              </View>
              {/* City */}
              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">City</Text>
                <TextInput
                  className="text-xs font-normal max-w-[50%] text-right"
                  placeholder="city/municipality"
                  numberOfLines={1}
                  value={city}
                  onChangeText={setCity}
                ></TextInput>
              </View>
              {/* Phone Number */}
              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">Phone Number</Text>
                <TextInput
                  className="text-xs font-normal max-w-[50%] text-right"
                  keyboardType="numeric"
                  placeholder="contact number"
                  numberOfLines={1}
                  value={number}
                  onChangeText={(text) => {
                    const numericText = text.replace(/[^0-9]/g, "");
                    if (numericText.length <= 11) {
                      setNumber(numericText);
                    }
                  }}
                />
              </View>
            </View>
            {/* Economic Info */}
            <View className="w-full py-4">
              {/* Title */}
              <View className="w-full flex items-start justify-center pb-4">
                <Text className="text-lg font-semibold">
                  Economic Information
                </Text>
                <Text className="text-xs font-normal text-black/50">
                  employment status & occupation
                </Text>
              </View>
              {/* Employment Status */}
              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">Employment Status</Text>
                <TextInput
                  className="text-xs font-normal max-w-[50%] text-right"
                  placeholder="status"
                  numberOfLines={1}
                  value={employmentStatus}
                  onChangeText={setEmploymentStatus}
                ></TextInput>
              </View>
              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">Occupation</Text>
                <TextInput
                  className="text-xs font-normal max-w-[50%] text-right"
                  placeholder="work"
                  numberOfLines={1}
                  value={occupation}
                  onChangeText={setOccupation}
                ></TextInput>
              </View>
            </View>
            {/* Credentials */}
            <View className="w-full py-4">
              {/* Title */}
              <View className="w-full flex items-start justify-center pb-4">
                <Text className="text-lg font-semibold">Credentials</Text>
                <Text className="text-xs font-normal text-black/50">
                  email, password & role
                </Text>
              </View>
              {/* First Name */}
              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">Email</Text>
                <TextInput
                  className="text-xs font-normal max-w-[50%] text-right"
                  placeholder="@example.com"
                  numberOfLines={1}
                  value={email}
                  onChangeText={setEmail}
                ></TextInput>
              </View>
              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">Password</Text>
                <TextInput
                  className="text-xs font-normal max-w-[50%] text-right"
                  placeholder="********"
                  numberOfLines={1}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                ></TextInput>
              </View>
              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">Role</Text>
                {accountLevel === "admin" ? (
                  <View className="w-1/2 flex flex-row items-center justify-end ">
                    <Text
                      className="text-xs font-normal pr-1"
                      numberOfLines={1}
                    >
                      {level}
                    </Text>
                    <Pressable
                      onPress={handleLevelToggle}
                      className="p-2 bg-black rounded-full"
                    >
                      <Feather name="rotate-cw" size={12} color={"white"} />
                    </Pressable>
                  </View>
                ) : (
                  <TextInput
                    className="text-xs font-normal max-w-[50%]"
                    placeholder="user"
                    numberOfLines={1}
                    value={level}
                    editable={false}
                  ></TextInput>
                )}
              </View>
            </View>
          </View>
          <View className="w-full pb-24"></View>
        </ScrollView>
      </SafeAreaView>
      <StatusBar style="auto" />
      {loading && <Loader />}

      {visibleModal && (
        <Modal
          isVisible={visibleModal}
          header="users"
          icon="profile"
          message={message}
          onClose={() => {
            setVisibleModal(false);

            if (!isError) {
              onClose();
            }
          }}
        />
      )}
    </>
  );
};

export default Usermodal;
