import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUsers } from "@/context/UsersProvider";
import { useUrl } from "@/context/UrlProvider";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from "@/components/loader";
import Modal from "@/components/modal";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import FieldsEdit from "./FieldsEdit";
import { useAdminHistory } from "@/context/AdminHistoryProvider";

interface Item {
  _id: string;
  name: string;
  category: string;
  image: string;
  pointsRequired: number;
  rewardName: string;
  stocks: number;
}

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

const PointsHistoryEdit = ({
  onClose,
  historyId,
}: {
  onClose: () => void;
  historyId: string;
}) => {
  const { getUsers, users } = useUsers();
  const [loading, setLoading] = useState(false);
  const { ipAddress, port } = useUrl();
  const [userPoints, setUserPoints] = useState<{ [key: string]: number }>({});
  const [selectedUser, setSelectedUser] = useState<user | null>(null);
  const [isError, setIsError] = useState(false);
  const [fieldsModal, setFieldsModal] = useState(false);
  const { fetchAllPointsHistory } = useAdminHistory();

  const fetchData = async () => {
    setLoading(true);
    try {
      await getUsers();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPointsForAllUsers = async () => {
    setLoading(true);
    try {
      const pointsPromises = users.map(async (user: user) => {
        try {
          const response = await axios.get(
            `http://${ipAddress}:${port}/api/history/claim/points/${user._id}`
          );
          return {
            userId: user._id,
            points: response.data.availablePoints.availablePoints,
          };
        } catch (error) {
          console.error(`Error fetching points for user ${user._id}`, error);
          return { userId: user._id, points: 0 };
        }
      });

      const results = await Promise.all(pointsPromises);

      const pointsData = results.reduce(
        (acc, { userId, points }) => ({ ...acc, [userId]: points }),
        {}
      );

      setUserPoints(pointsData);
    } catch (error) {
      console.error("Error fetching points for users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      fetchPointsForAllUsers();
    }
  }, [users]);

  const getUserPoints = (userId: string) => {
    return userPoints[userId] !== undefined ? userPoints[userId] : 0;
  };

  return (
    <>
      <SafeAreaView className="flex-1 px-4 absolute top-0 left-0 bottom-0 right-0 bg-[#F0F0F0]">
        {/* Title Bar */}
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
          <Text className="text-xl font-semibold">Choose User</Text>
        </View>
        {/* Header */}
        <View className="w-full flex items-start justify-center py-4">
          <Text className="text-lg font-semibold" numberOfLines={1}>
            Select User
          </Text>
          <Text className="text-xs font-normal text-black/50" numberOfLines={1}>
            please select a user to continue
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 w-full"
        >
          {users.map((user: user) => (
            <View
              className="w-full flex flex-row justify-between p-2 bg-[#E6E6E6] rounded-3xl mb-4"
              key={user._id}
            >
              <View className="flex flex-row items-center justify-start w-9/12 ">
                {/* Image */}
                <View className="h-[60px] w-[60px] rounded-3xl bg-black overflow-hidden">
                  <Image
                    source={require("../../../../assets/images/Man.jpg")}
                    className="w-full h-full"
                  />
                </View>
                <View className="w-2/3 flex items-start justify-center pl-2">
                  <Text
                    numberOfLines={1}
                    className="text-sm font-semibold uppercase"
                  >{`${user.personalInfo.firstName} ${user.personalInfo.lastName}`}</Text>
                  <View className="flex-row items-center justify-start">
                    <Text
                      className="text-xs font-normal text-black/50 uppercase pr-1 w-19/12"
                      numberOfLines={1}
                    >
                      {`${getUserPoints(user._id)} ${
                        getUserPoints(user._id) > 1 ? "pts." : "pt."
                      }`}
                    </Text>
                    <Text
                      className="text-xs font-normal text-black/50 uppercase w-10/12"
                      numberOfLines={1}
                    >
                      {user._id}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="w-2/12 flex items-center justify-center">
                <Pressable
                  onPress={() => {
                    setSelectedUser(user);
                    setFieldsModal(true);
                  }}
                >
                  <LinearGradient
                    className="flex p-5 rounded-3xl bg-gray-300"
                    colors={["#00674F", "#06402B"]}
                  >
                    <Ionicons
                      name="return-up-forward"
                      size={16}
                      color={"white"}
                    />
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
          ))}
          <View className="w-full pb-24"></View>
        </ScrollView>
      </SafeAreaView>
      {loading && <Loader />}
      {fieldsModal && (
        <FieldsEdit
          onClose={() => {
            setFieldsModal(false);
            onClose();
            fetchAllPointsHistory();
          }}
          historyId={historyId}
          user={selectedUser}
        />
      )}
    </>
  );
};

export default PointsHistoryEdit;
