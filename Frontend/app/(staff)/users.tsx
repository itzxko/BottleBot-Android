import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import Loader from "@/components/loader";
import Modal from "@/components/modal";
import Usermodal from "@/components/admin/users/userModal";
import { useUsers } from "@/context/UsersProvider";
import { StatusBar } from "expo-status-bar";
import EditModal from "@/components/admin/users/editModal";
import { useUrl } from "@/context/UrlProvider";
import { ImageBackground } from "expo-image";
import { useAuth } from "@/context/AuthContext";
import { useAdminHistory } from "@/context/AdminHistoryProvider";
import RemixIcon from "react-native-remix-icon";
import ViewModal from "@/components/staff/users/viewModal";

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
  const [searchType, setSearchType] = useState("All");
  const [userSearch, setUserSearch] = useState("");
  const { user } = useAuth();
  const [isError, setIsError] = useState(false);
  const { fetchAllHistory } = useAdminHistory();
  const [viewModal, setViewModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getUsers();
      setLoading(false);
    };

    fetchData();
  }, []);

  const deleteUser = async (userId: string) => {
    setLoading(true);
    try {
      let url = `http://${ipAddress}:${port}/api/users/${userId}`;
      let response = await axios.delete(url);

      if (response.status === 200) {
        setMessage(response.data.message);
        setVisibleModal(true);
        clearSearchFilter();
      } else {
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
  };

  const clearSearchFilter = async () => {
    setUserSearch("");
    setSearchType("All");
    await getUsers();
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

  const handleSearchType = () => {
    setLoading(true);
    try {
      const newType =
        searchType === "All"
          ? "admin"
          : searchType === "admin"
          ? "staff"
          : searchType === "staff"
          ? "citizen"
          : "All";
      setSearchType(newType);

      filterUsers(newType, userSearch);
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (text: string) => {
    setUserSearch(text);
    setLoading(true);

    try {
      if (text.trim() === "") {
        setUserSearch("");
        setSearchType("All");
        await getUsers();
      } else {
        await filterUsers(searchType, text);
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

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
              <RemixIcon name="arrow-left-s-line" size={16} color="black" />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={"#C9C9C9"}
            className="absolute right-0 rounded-full"
            onPress={() => setUserModal(true)}
          >
            <View className="p-2 bg-[#E1E1E1] rounded-full flex items-center justify-center">
              <RemixIcon name="add-line" size={16} color="black" />
            </View>
          </TouchableHighlight>
          <Text className="text-sm font-semibold">Users</Text>
        </View>
        {/* Search and Filter */}
        <View className="w-full flex flex-row items-center justify-between pt-4">
          <View className="w-full flex flex-row items-center justify-between pl-6 pr-4 py-3 rounded-full bg-[#E6E6E6]">
            <View className="w-6/12 flex-row items-center justify-start">
              <RemixIcon
                name="search-2-line"
                size={16}
                color={"rgba(0, 0, 0, 0.5)"}
              />
              <TextInput
                className="w-full bg-[#E6E6E6] text-xs font-normal pl-2"
                placeholder={"search users via username"}
                value={userSearch}
                onChangeText={handleSearch}
                numberOfLines={1}
              />
            </View>
            <Pressable
              className="w-4/12 flex flex-row items-center justify-between px-4 py-2 bg-[#050301] rounded-full"
              onPress={handleSearchType}
            >
              <Text
                className="w-2/3 text-xs font-normal text-white"
                numberOfLines={1}
              >
                {searchType}
              </Text>
              <RemixIcon name="refresh-line" size={16} color="white" />
            </Pressable>
          </View>
        </View>
        {/* Header */}
        <View className="w-full flex items-center justify-center py-4">
          <View className="w-full flex items-start justify-center">
            <Text
              className="text-sm font-semibold text-black"
              numberOfLines={1}
            >
              Manage Users
            </Text>
            <Text className="text-xs font-normal text-black/50">
              Create, Update or Delete Users
            </Text>
          </View>
        </View>
        {/* Content */}
        <ScrollView
          className="flex-1 w-full py-2"
          showsVerticalScrollIndicator={false}
        >
          {users.length > 0 ? (
            users.map((mappedUser: user) => (
              <View
                className="w-full h-[240px] flex items-center rounded-[32px] overflow-hidden justify-center mb-4"
                key={mappedUser._id}
              >
                <ImageBackground
                  className="w-full h-full"
                  source={require("../../assets/images/Man.jpg")}
                >
                  <LinearGradient
                    className="w-full h-full p-6"
                    colors={[
                      "rgba(18, 18, 18, 0)",
                      "rgba(18, 18, 18, 0.4)",
                      "rgba(18, 18, 18, 1)",
                    ]}
                    start={{ x: 1, y: 0 }} // Start from the upper right corner
                    end={{ x: 0, y: 1 }}
                  >
                    <View className="w-full h-full flex flex-col justify-between items-center">
                      <View className="w-full flex flex-row items-start justify-between">
                        <Text className="text-xs font-normal text-white/50 uppercase">
                          {mappedUser.credentials.level}
                        </Text>
                      </View>
                      <View className="w-full flex items-start justify-center">
                        <View className="w-full pb-4">
                          <Text
                            className="text-sm font-semibold text-white"
                            numberOfLines={1}
                          >
                            {`${mappedUser.personalInfo.firstName} ${mappedUser.personalInfo.lastName}`}
                          </Text>

                          <Text
                            className="text-xs font-normal text-white/50 uppercase max-w-[60%]"
                            numberOfLines={1}
                          >
                            #{mappedUser._id}
                          </Text>
                        </View>
                        <View className="w-full flex items-start justify-center">
                          <Pressable
                            className=""
                            onPress={() => {
                              setViewModal(true);
                              setSelectedUser(mappedUser);
                            }}
                          >
                            <LinearGradient
                              colors={["#699900", "#466600"]}
                              className="flex flex-row justify-center items-center px-4 py-2 rounded-full"
                            >
                              <Text className="text-xs font-semibold text-white pr-1">
                                View
                              </Text>
                              <RemixIcon
                                name="edit-2-line"
                                size={16}
                                color="white"
                              />
                            </LinearGradient>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </View>
            ))
          ) : (
            <View className="w-full h-[240px] items-center justify-center">
              <View className="p-3 mb-2 rounded-full bg-[#699900]">
                <RemixIcon name="blur-off-fill" size={16} color="white" />
              </View>
              <Text className="text-xs font-normal text-black/50">
                No Users Found
              </Text>
            </View>
          )}
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
          onClose={() => {
            setVisibleModal(false);
            if (!isError) {
              fetchAllHistory();
            }
          }}
          icon="profile"
        />
      )}
      {userModal && (
        <Usermodal
          accountLevel={user ? user.credentials.level : ""}
          onClose={() => {
            setUserModal(false);
            clearSearchFilter();
          }}
        />
      )}
      {viewModal && (
        <ViewModal
          user={selectedUser}
          onClose={() => {
            setViewModal(false);
            clearSearchFilter();
          }}
        />
      )}
    </>
  );
};

export default Users;
