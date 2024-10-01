import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  ImageBackground,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import Loader from "@/components/loader";
import Modal from "@/components/modal";
import Usermodal from "@/components/admin/userModal";
import { useUsers } from "@/context/UsersProvider";
import { StatusBar } from "expo-status-bar";
import EditModal from "@/components/admin/editModal";

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getUsers();
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };

    fetchData();
  }, []);

  const deleteUser = async (userId: string) => {
    try {
      let url = `http://192.168.254.139:8080/api/users/${userId}`;
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
      <SafeAreaView className="flex-1 px-6 bg-[#F0F0F0]">
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
              className="flex flex-row items-center justify-center px-3 py-2 bg-[#050301] rounded-lg"
              onPress={() => setOpenFilter(!openFilter)}
            >
              <Feather name="filter" size={14} color={"white"} />
              <Text className="text-sm font-normal text-white pl-1">
                Filter
              </Text>
            </Pressable>

            {openFilter ? (
              <View className="absolute top-[100%] z-10 bg-white w-full flex items-center justify-center  rounded-lg shadow-xl shadow-black">
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
              className="w-full flex-wrap items-center justify-center rounded-xl overflow-hidden mb-4"
              key={user._id}
            >
              <View className="w-full flex flex-row items-center justify-between bg-white py-3 px-4 shadow shadow-black">
                <Text className="text-xs font-semibold text-black/50 uppercase">
                  #{user._id}
                </Text>
                <View className="flex flex-row items-center justify-center">
                  <Pressable
                    className="flex items-center justify-center p-1.5 rounded-md bg-[#00674F] mr-1"
                    onPress={() => {
                      setEditModal(true);
                      setSelectedUser(user);
                    }}
                  >
                    <Feather name="edit-2" size={12} color={"white"} />
                  </Pressable>
                  <Pressable
                    className="flex items-center justify-center p-1.5 rounded-md bg-[#B32624]"
                    onPress={() => deleteUser(user._id)}
                  >
                    <Feather name="trash" size={12} color={"white"} />
                  </Pressable>
                </View>
              </View>
              <View className="w-full flex items-center justify-center bg-[#F7F7F7] px-4 py-3">
                <View className="w-full flex flex-row items-center justify-start py-2">
                  {/* Image */}
                  <View className=" flex items-center justify-center h-[50px] w-[50px] rounded-full overflow-hidden">
                    <ImageBackground
                      className="w-full h-full"
                      source={require("../../assets/images/Man.jpg")}
                    ></ImageBackground>
                  </View>
                  {/* Username */}
                  <View className="w-3/4 flex items-start justify-center pl-3">
                    <Text
                      className="text-sm font-semibold pb-0.5 capitalize"
                      numberOfLines={1}
                    >
                      {`${user.personalInfo.firstName} ${user.personalInfo.lastName}`}
                    </Text>
                    <View className="px-2 py-1 bg-[#E1E1E1] rounded-md">
                      <Text
                        className="text-xs font-normal text-black/50"
                        numberOfLines={1}
                      >
                        {user.credentials.email}
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="w-full flex items-end justify-center pb-2">
                  <LinearGradient
                    colors={["#050301", "#474747"]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    className="flex flex-row items-center justify-center px-3 py-1.5 rounded-md"
                  >
                    <Feather name="hash" size={12} color={"white"} />
                    <Text className="text-xs font-normal pl-0.5 text-white">
                      {user.credentials.level}
                    </Text>
                  </LinearGradient>
                </View>
              </View>
            </View>
          ))}
          <View className="w-full pb-32"></View>
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
