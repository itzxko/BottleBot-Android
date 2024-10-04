import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import Loader from "@/components/loader";
import Modal from "@/components/modal";
import Usermodal from "@/components/admin/userModal";
import { useUsers } from "@/context/UsersProvider";
import { StatusBar } from "expo-status-bar";
import EditModal from "@/components/admin/editModal";
import { useUrl } from "@/context/UrlProvider";
import { ImageBackground } from "expo-image";

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [filter, setFilter] = useState("All");
  const [userModal, setUserModal] = useState(false);
  const [message, setMessage] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const { getUsers, users, roles, filterUsers } = useUsers();
  const [editModal, setEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<user | null>(null);
  const { ipAddress, port } = useUrl();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getUsers();
      setLoading(false);
    };

    fetchData();
  }, []);

  const deleteUser = async (userId: string) => {
    try {
      let url = `http://${ipAddress}:${port}/api/users/${userId}`;
      let response = await axios.delete(url);

      if (response.status === 200) {
        setMessage(response.data.message);
        setVisibleModal(true);
        getUsers();
      } else {
        setMessage(response.data.message);
        setVisibleModal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilter = async (role: string) => {
    if (role === filter) {
      setFilter("All");

      await filterUsers("All");
    } else {
      setFilter(role);

      await filterUsers(role);
    }
    setOpenFilter(false);
  };

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

  return (
    <>
      <SafeAreaView className="flex-1 px-4 bg-[#F0F0F0]">
        {/* TitleBar */}
        <View className="relative w-full flex flex-row items-center justify-center py-4">
          <TouchableHighlight
            underlayColor={"#C9C9C9"}
            className="absolute left-0 rounded-full"
            onPress={() => console.log()}
          >
            <View className="p-2 bg-[#E1E1E1] rounded-full flex items-center justify-center">
              <Ionicons name="chevron-back" size={18} />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={"#C9C9C9"}
            className="absolute right-0 rounded-full"
            onPress={() => setUserModal(true)}
          >
            <View className="p-2 bg-[#E1E1E1] rounded-full flex items-center justify-center">
              <Feather name="plus" size={20} />
            </View>
          </TouchableHighlight>
          <Text className="text-xl font-semibold">Users</Text>
        </View>
        {/* Header */}
        <View className="w-full flex flex-row items-center justify-between py-4">
          <View className="w-1/2 flex items-start justify-center">
            <Text
              className="text-lg font-semibold text-black"
              numberOfLines={1}
            >
              Manage Users
            </Text>
            <Text className="text-xs font-normal text-black/50">
              Create, Update or Delete Users
            </Text>
          </View>
          {/* Filter */}
          <View className="relative flex items-end justify-end">
            <Pressable
              className="flex  rounded-full"
              onPress={() => setOpenFilter(!openFilter)}
            >
              <LinearGradient
                className="flex-row-reverse items-center justify-center p-2 rounded-full"
                colors={["#757575", "#050301"]}
              >
                <View className="flex items-center justify-center p-2 rounded-full bg-white">
                  <MaterialCommunityIcons
                    name="arrow-right-top"
                    size={14}
                    color={"black"}
                  />
                </View>
                <Text className="text-sm font-semibold text-white px-2">
                  Filter
                </Text>
              </LinearGradient>
            </Pressable>

            {openFilter ? (
              <View className="absolute top-[120%] z-10 bg-white w-full flex items-center justify-center  rounded-2xl shadow-xl shadow-black">
                {roles.map((role: string) => (
                  <Pressable
                    className="w-full px-3 py-2 flex items-center justify-center"
                    onPress={() => handleFilter(role)}
                    key={role}
                  >
                    <Text
                      className="text-xs font-normal text-black"
                      numberOfLines={1}
                    >
                      {role}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        </View>
        {/* Content */}
        <ScrollView
          className="flex-1 w-full py-2"
          showsVerticalScrollIndicator={false}
        >
          {users.map((user: user) => (
            <View
              className="w-full h-[240px] flex items-center rounded-[32px] overflow-hidden justify-center mb-4"
              key={user._id}
            >
              <ImageBackground
                className="w-full h-full"
                source={require("../../assets/images/Man.jpg")}
              >
                <LinearGradient
                  className="w-full h-full p-6"
                  colors={[
                    "rgba(18, 18, 18, 0.2)",
                    "rgba(18, 18, 18, 0.6)",
                    "rgba(18, 18, 18, 1)",
                  ]}
                  start={{ x: 1, y: 0 }} // Start from the upper right corner
                  end={{ x: 0, y: 1 }}
                >
                  <View className="w-full h-full flex flex-col justify-between items-center">
                    <View className="w-full flex flex-row items-start justify-between">
                      <Text className="text-xs font-normal text-white/50 uppercase">
                        {user.credentials.level}
                      </Text>
                      <Pressable onPress={() => deleteUser(user._id)}>
                        <LinearGradient
                          colors={["#FF0000", "#780606"]}
                          className="p-2 rounded-full"
                        >
                          <Text className="hidden text-sm font-semibold text-white pr-1">
                            Delete
                          </Text>
                          <Feather name="trash" size={16} color={"white"} />
                        </LinearGradient>
                      </Pressable>
                    </View>
                    <View className="w-full flex items-start justify-center">
                      <View className="w-full pb-4">
                        <Text
                          className="text-xl font-semibold text-white"
                          numberOfLines={1}
                        >
                          {`${user.personalInfo.firstName} ${user.personalInfo.lastName}`}
                        </Text>

                        <Text
                          className="text-xs font-normal text-white/50 uppercase max-w-[60%]"
                          numberOfLines={1}
                        >
                          #{user._id}
                        </Text>
                      </View>
                      <View className="w-full flex items-start justify-center">
                        <Pressable
                          className=""
                          onPress={() => {
                            setEditModal(true);
                            setSelectedUser(user);
                          }}
                        >
                          <LinearGradient
                            colors={["#D2AF26", "#BE8400"]}
                            className="flex flex-row justify-center items-center px-4 py-2 rounded-full"
                          >
                            <Text className="text-sm font-semibold text-white pr-1">
                              Edit
                            </Text>
                            <MaterialCommunityIcons
                              name="arrow-up-right"
                              color={"white"}
                              size={16}
                            />
                          </LinearGradient>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </View>
          ))}
          <View className="w-full pb-24"></View>
        </ScrollView>
      </SafeAreaView>
      <StatusBar style="auto" />
      {loading && <Loader />}
      {visibleModal && (
        <Modal
          header="Users"
          message={message}
          isVisible={visibleModal}
          onClose={() => setVisibleModal(false)}
          icon="profile"
        />
      )}
      {userModal && (
        <Usermodal
          onClose={() => {
            setUserModal(false);
            getUsers();
          }}
        />
      )}
      {editModal && (
        <EditModal
          user={selectedUser}
          onClose={() => {
            setEditModal(false);
            getUsers();
          }}
        />
      )}
    </>
  );
};

export default Users;
