import {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  Pressable,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/loader";
import { LinearGradient } from "expo-linear-gradient";
import { useAdminHistory } from "@/context/AdminHistoryProvider";
import { useUsers } from "@/context/UsersProvider";
import { Image, ImageBackground } from "expo-image";
import { useUrl } from "@/context/UrlProvider";
import RewardHistoryAdd from "@/components/admin/history/rewards/RewardHistoryAdd";
import RewardHistoryEdit from "@/components/admin/history/rewards/RewardHistoryEdit";
import Modal from "@/components/modal";
import PointsHistoryAdd from "@/components/admin/history/points/PointsHistoryAdd";
import PointsHistoryEdit from "@/components/admin/history/points/PointsHistoryEdit";
import { useRewards } from "@/context/RewardsProvider";
import RemixIcon from "react-native-remix-icon";
import { usePagination } from "@/context/PaginationProvider";
import { Point } from "react-native-maps";
import ArchiveDateEdit from "@/components/admin/history/points/ArchiveDateEdit";
import ArchiveDateForm from "@/components/admin/history/rewards/ArchiveDateForm";

const History = () => {
  const { user } = useAuth();
  const { getRewards, rewards } = useRewards();
  const [pointsPage, setPointsPage] = useState(false);
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const [redeemables, setRedeemables] = useState<RedeemableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    getRewardsHistory,
    rewardsHistory,
    searchActiveRewardHistory,
    searchArchivedRewardHistory,
    getArchivedRewardHistory,
    rewardTotalPages,
    getPointsHistory,
    pointsHistory,
    searchActivePointHistory,
    getArchivedPointHistory,
    searchArchivedPointHistory,
    pointTotalPages,
  } = useAdminHistory();
  const { historyLimit } = usePagination();
  const { users, getUsers } = useUsers();
  const { ipAddress, port } = useUrl();
  const [rewardSearch, setRewardSearch] = useState("");
  const [pointSearch, setPointSearch] = useState("");
  const [rewardAdd, setRewardAdd] = useState(false);
  const [rewardEdit, setRewardEdit] = useState(false);
  const [pointsAdd, setPointsAdd] = useState(false);
  const [pointsEdit, setPointsEdit] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [rewardHistoryId, setRewardHistoryId] = useState("");
  const [pointHistoryId, setPointHistoryId] = useState("");
  const [rewardsFilterStatus, setRewardsFilterStatus] = useState("active");
  const [pointsFilterStatus, setPointsFilterStatus] = useState("active");
  const [rewardCurrentPage, setRewardCurrentPage] = useState(1);
  const [pointCurrentPage, setPointCurrentPage] = useState(1);
  const [isError, setIsError] = useState(false);
  const [pointsArchiveForm, setPointsArchiveForm] = useState(false);
  const [rewardsArchiveForm, setRewardsArchiveForm] = useState(false);
  const [historyData, setHistoryData] = useState("");

  interface user {
    _id: string;
    personalInfo: {
      firstName: string;
      lastName: string;
    };
  }

  interface RewardsHistory {
    dateClaimed: Date;
    _id: string;
    archiveDate: Date;
    pointsSpent: number;
    userId: string;
    rewardId: string;
    userInfo: {
      personalInfo: {
        firstName: string;
        lastName: string;
        middleName: string;
      };
    };
  }

  interface PointsHistory {
    _id: string;
    userId: string;
    dateDisposed: Date;
    pointsAccumulated: number;
    bottleCount: number;
    archiveDate: Date;
    userInfo: {
      personalInfo: {
        firstName: string;
        lastName: string;
        middleName: string;
      };
    };
  }

  interface RedeemableItem {
    _id: string;
    rewardName: string;
    image: string;
  }

  interface Item {
    _id: string;
  }

  const deleteRewardHistory = async (historyId: string) => {
    setLoading(true);
    try {
      let url = `http://${ipAddress}:${port}/api/history/claim/${historyId}`;

      let response = await axios.delete(url);

      if (response.status === 200) {
        setMessage(response.data.message);
        setVisibleModal(true);
        clearRewardFilters();
        fetchRewardHistoryData();
      }
    } catch (error: any) {
      setMessage(error.response.data.message);
      setVisibleModal(true);
    } finally {
      setLoading(false);
    }
  };

  const archivePointHistory = async (historyId: string) => {
    setLoading(true);

    try {
      let url = `http://${ipAddress}:${port}/api/history/dispose/${historyId}`;

      let response = await axios.delete(url);

      if (response.status === 200) {
        setMessage(response.data.message);
        setVisibleModal(true);
        setIsError(false);
        fetchPointHistoryData();
      }
    } catch (error: any) {
      setMessage(error.response.data.message);
      setVisibleModal(true);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const unarchivePointHistory = async (history: PointsHistory) => {
    setLoading(true);
    console.log(history);

    try {
      let url = `http://${ipAddress}:${port}/api/history/dispose/${history._id}`;

      let response = await axios.put(url, {
        userId: history.userId,
        bottleCount: history.bottleCount,
        pointsAccumulated: history.pointsAccumulated,
        archiveDate: null,
      });

      if (response.status === 200) {
        setMessage(response.data.message);
        setVisibleModal(true);
        setIsError(false);
        fetchPointHistoryData();
      }
    } catch (error: any) {
      setMessage(error.response.data.message);
      setVisibleModal(true);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const archiveRewardHistory = async (historyId: string) => {
    setLoading(true);

    try {
      let url = `http://${ipAddress}:${port}/api/history/claim/${historyId}`;

      let response = await axios.delete(url);

      if (response.data.success === true) {
        setMessage(response.data.message);
        setIsError(false);
        setVisibleModal(true);
        fetchRewardHistoryData();
      }
    } catch (error: any) {
      setVisibleModal(true);
      setIsError(true);
      setMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const unarchiveRewardHistory = async (history: RewardsHistory) => {
    setLoading(true);

    try {
      let url = `http://${ipAddress}:${port}/api/history/claim/${history._id}`;

      let response = await axios.put(url, {
        archiveDate: null,
        userId: history.userId,
        rewardId: history.rewardId,
        pointsSpent: history.pointsSpent,
      });

      if (response.data.success === true) {
        setMessage(response.data.message);
        setIsError(false);
        setVisibleModal(true);
        fetchRewardHistoryData();
      }
    } catch (error: any) {
      setVisibleModal(true);
      setIsError(true);
      setMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRewardHistoryData = async () => {
    setLoading(true);
    getRewards();

    try {
      if (rewardSearch.trim()) {
        if (rewardsFilterStatus === "active") {
          await searchActiveRewardHistory(
            rewardSearch,
            rewardCurrentPage,
            historyLimit
          );
        } else {
          await searchArchivedRewardHistory(
            rewardSearch,
            rewardCurrentPage,
            historyLimit
          );
        }
      } else {
        if (rewardsFilterStatus === "active") {
          await getRewardsHistory(rewardCurrentPage, historyLimit);
        } else {
          await getArchivedRewardHistory(rewardCurrentPage, historyLimit);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewardHistoryData();
  }, [rewardsFilterStatus, rewardCurrentPage]);

  const handleRewardFilterStatus = async () => {
    setRewardsFilterStatus((prevStatus) =>
      prevStatus === "active" ? "archive" : "active"
    );
    setRewardSearch("");
    setRewardCurrentPage(1);
  };

  const handleRewardSearch = async (reward: string) => {
    setRewardSearch(reward);
    setLoading(true);
    setRewardCurrentPage(1);

    try {
      if (reward.trim() === "") {
        setRewardSearch("");

        if (rewardsFilterStatus === "active") {
          await getRewardsHistory(1, historyLimit);
        } else {
          await getArchivedRewardHistory(1, historyLimit);
        }
      } else {
        if (rewardsFilterStatus === "active") {
          await searchActiveRewardHistory(reward, 1, historyLimit);
        } else {
          await searchArchivedRewardHistory(reward, 1, historyLimit);
        }
      }
    } catch (error: any) {
      console.log(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRewardPageChange = async (newPage: number) => {
    if (newPage >= 1 && newPage <= rewardTotalPages) {
      setRewardCurrentPage(newPage);
      setLoading(true);

      try {
        if (rewardSearch.trim() !== "") {
          // Apply search or filter on page change
          if (rewardsFilterStatus === "active") {
            await searchActiveRewardHistory(
              rewardSearch,
              newPage,
              historyLimit
            );
          } else {
            await searchArchivedRewardHistory(
              rewardSearch,
              newPage,
              historyLimit
            );
          }
        } else {
          // Default pagination without search or filter
          if (rewardsFilterStatus === "active") {
            await getRewardsHistory(newPage, historyLimit);
          } else if (rewardsFilterStatus === "archive") {
            await getArchivedRewardHistory(newPage, historyLimit);
          }
        }
      } catch (error) {
        console.error("Error fetching rewards:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const clearRewardFilters = () => {
    setRewardSearch("");
    setRewardsFilterStatus("active");
  };

  //points
  const fetchPointHistoryData = async () => {
    setLoading(true);

    try {
      if (pointSearch.trim()) {
        if (pointsFilterStatus === "active") {
          await searchActivePointHistory(
            pointSearch,
            pointCurrentPage,
            historyLimit
          );
        } else {
          await searchArchivedPointHistory(
            pointSearch,
            pointCurrentPage,
            historyLimit
          );
        }
      } else {
        if (pointsFilterStatus === "active") {
          await getPointsHistory(pointCurrentPage, historyLimit);
        } else {
          await getArchivedPointHistory(pointCurrentPage, historyLimit);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPointHistoryData();
  }, [pointsFilterStatus, pointCurrentPage]);

  const handlePointFilterStatus = async () => {
    setPointsFilterStatus((prevStatus) =>
      prevStatus === "active" ? "archive" : "active"
    );
    setPointSearch("");
    setPointCurrentPage(1);
  };

  const handlePointSearch = async (point: string) => {
    setPointSearch(point);
    setLoading(true);
    setPointCurrentPage(1);

    try {
      if (point.trim() === "") {
        setPointSearch("");

        if (pointsFilterStatus === "active") {
          await getPointsHistory(1, historyLimit);
        } else {
          await getArchivedPointHistory(1, historyLimit);
        }
      } else {
        if (pointsFilterStatus === "active") {
          await searchActivePointHistory(point, 1, historyLimit);
        } else {
          await searchArchivedPointHistory(point, 1, historyLimit);
        }
      }
    } catch (error: any) {
      console.log(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePointPageChange = async (newPage: number) => {
    if (newPage >= 1 && newPage <= pointTotalPages) {
      setPointCurrentPage(newPage);
      setLoading(true);

      try {
        if (rewardSearch.trim() !== "") {
          // Apply search or filter on page change
          if (pointsFilterStatus === "active") {
            await searchActivePointHistory(pointSearch, newPage, historyLimit);
          } else {
            await searchActivePointHistory(pointSearch, newPage, historyLimit);
          }
        } else {
          // Default pagination without search or filter
          if (pointsFilterStatus === "active") {
            await getPointsHistory(newPage, historyLimit);
          } else if (pointsFilterStatus === "archive") {
            await getArchivedPointHistory(newPage, historyLimit);
          }
        }
      } catch (error) {
        console.error("Error fetching rewards:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const clearPointFilters = () => {
    setPointSearch("");
    setPointsFilterStatus("active");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F0F0F0]">
      <>
        <View className="relative w-full flex flex-row items-center justify-center p-4">
          <TouchableHighlight
            underlayColor={"#C9C9C9"}
            className="absolute left-4 rounded-full"
            onPress={() => navigation.goBack()}
          >
            <View className="p-2 bg-[#E1E1E1] rounded-full flex items-center justify-center">
              <RemixIcon name="arrow-left-s-line" size={16} color="black" />
            </View>
          </TouchableHighlight>
          <Text className="text-sm font-semibold">History</Text>
        </View>

        <ScrollView
          className="flex-1 w-full"
          showsVerticalScrollIndicator={false}
        >
          {/* Titlebar */}
          <View className="w-full flex flex-row items-center justify-between px-4 py-4">
            <View className="w-full flex flex-row items-center justify-between pl-6 pr-4 py-3 rounded-full bg-[#E6E6E6]">
              <View className="w-6/12 flex-row items-center justify-start">
                <RemixIcon
                  name="search-2-line"
                  size={16}
                  color={"rgba(0, 0, 0, 0.5)"}
                />
                <TextInput
                  value={rewardSearch}
                  className="w-full bg-[#E6E6E6] text-xs font-normal pl-2"
                  placeholder="search rewards history"
                  onChangeText={handleRewardSearch}
                />
              </View>
              <Pressable
                className="w-4/12 px-4 py-2 flex flex-row items-center justify-between rounded-full bg-[#050301]"
                onPress={handleRewardFilterStatus}
              >
                <Text
                  className="text-xs font-normal text-white"
                  numberOfLines={1}
                >
                  {rewardsFilterStatus}
                </Text>
                <RemixIcon name="refresh-line" size={16} color="white" />
              </Pressable>
            </View>
          </View>
          <View className="w-full flex items-center justify-center pt-4">
            <View className="w-full flex flex-row items-start justify-between px-4 pb-4">
              <View className="w-full flex flex-row items-center justify-start space-x-2">
                <Pressable
                  className="p-2 bg-[#050301] rounded-full"
                  onPress={() => setRewardAdd(true)}
                >
                  <RemixIcon name="add-line" size={16} color="white" />
                </Pressable>
                <View className="w-3/4 flex flex-col items-start justify-center">
                  <Text className="text-sm font-semibold" numberOfLines={1}>
                    Rewards History
                  </Text>
                  <Text
                    className="text-xs font-normal text-black/50"
                    numberOfLines={1}
                  >
                    all records of redeemed rewards
                  </Text>
                </View>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex w-full"
            >
              {rewardsHistory.length > 0 ? (
                rewardsHistory.map(
                  (rewardHistory: RewardsHistory, index: number) => {
                    const reward = rewards.find(
                      (reward: RedeemableItem) =>
                        reward._id === rewardHistory.rewardId
                    );

                    const firstItem = index === 0;
                    const lastItem = index === pointsHistory.length - 1;

                    const margin = firstItem
                      ? "mx-4"
                      : lastItem
                      ? "mr-4"
                      : "mr-4";

                    return (
                      <View
                        className={`bg-slate-500 rounded-[32px] w-[320px] h-[240px] overflow-hidden ${margin}`}
                        key={rewardHistory._id}
                      >
                        <ImageBackground
                          className="w-full h-full "
                          source={
                            reward
                              ? {
                                  uri: `http://${ipAddress}:${port}/api/images/${reward.image}`,
                                }
                              : require("../../assets/images/borgar.jpg")
                          }
                        >
                          <LinearGradient
                            className="w-full h-full p-5"
                            colors={[
                              "rgba(18, 18, 18, 0)",
                              "rgba(18, 18, 18, 1)",
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                          >
                            <View className="flex flex-col h-full justify-between">
                              <View className="w-full flex flex-row items-start justify-between">
                                <Text
                                  className="text-xs font-normal text-white/50 uppercase max-w-[50%]"
                                  numberOfLines={1}
                                >
                                  #{rewardHistory._id}
                                </Text>
                                <View className="max-w-[40%] flex flex-row items-center justify-end">
                                  <View className="py-3 px-4 rounded-full flex flex-row bg-[#050301]/50">
                                    {rewardHistory.archiveDate === null ? (
                                      <>
                                        <Pressable
                                          className="mr-4"
                                          onPress={() => {
                                            setRewardEdit(true);
                                            setRewardHistoryId(
                                              rewardHistory._id
                                            );
                                          }}
                                        >
                                          <RemixIcon
                                            name="edit-2-line"
                                            size={16}
                                            color="white"
                                          />
                                        </Pressable>
                                        <Pressable
                                          onPress={() =>
                                            archiveRewardHistory(
                                              rewardHistory._id
                                            )
                                          }
                                        >
                                          <RemixIcon
                                            name="archive-line"
                                            size={16}
                                            color="white"
                                          />
                                        </Pressable>
                                      </>
                                    ) : (
                                      <>
                                        <Pressable
                                          className="mr-4"
                                          onPress={() => {
                                            setHistoryData(rewardHistory._id);
                                            setRewardsArchiveForm(true);
                                          }}
                                        >
                                          <RemixIcon
                                            name="edit-2-line"
                                            size={16}
                                            color="white"
                                          />
                                        </Pressable>
                                        <Pressable
                                          onPress={() =>
                                            unarchiveRewardHistory(
                                              rewardHistory
                                            )
                                          }
                                        >
                                          <RemixIcon
                                            name="inbox-unarchive-line"
                                            size={16}
                                            color="white"
                                          />
                                        </Pressable>
                                      </>
                                    )}
                                  </View>
                                </View>
                              </View>
                              <View className="w-full flex items-start justify-center">
                                <View className="w-full flex flex-row items-center justify-start pb-2">
                                  <Text
                                    className="text-sm font-semibold text-white capitalize max-w-[60%]"
                                    numberOfLines={1}
                                  >
                                    {reward?.rewardName}
                                  </Text>
                                  <Text className="text-xs font-normal text-white/50 uppercase max-w-[30%] pl-2">
                                    {`${rewardHistory.pointsSpent} ${
                                      rewardHistory.pointsSpent > 1
                                        ? "pts."
                                        : "pt."
                                    }`}
                                  </Text>
                                </View>
                                <View className="w-full overflow-hidden flex flex-row justify-start items-center">
                                  <LinearGradient
                                    className="flex items-center justify-center px-4 py-2 rounded-full mr-1 max-w-[50%]"
                                    colors={["#699900", "#466600"]}
                                  >
                                    <Text
                                      className="text-xs font-normal text-white"
                                      numberOfLines={1}
                                    >
                                      {`${rewardHistory.userInfo.personalInfo.firstName} ${rewardHistory.userInfo.personalInfo.lastName}`}
                                    </Text>
                                  </LinearGradient>
                                  <LinearGradient
                                    className="flex items-center justify-center px-4 py-2 rounded-full max-w-[40%]"
                                    colors={["#699900", "#466600"]}
                                  >
                                    <Text
                                      className="text-xs font-normal text-white"
                                      numberOfLines={1}
                                    >
                                      {(() => {
                                        const date = new Date(
                                          rewardHistory.dateClaimed
                                        );
                                        return isNaN(date.getTime())
                                          ? "Invalid Date"
                                          : date.toLocaleDateString("en-US");
                                      })()}
                                    </Text>
                                  </LinearGradient>
                                </View>
                              </View>
                            </View>
                          </LinearGradient>
                        </ImageBackground>
                      </View>
                    );
                  }
                )
              ) : (
                <View className="flex w-[100vw] h-[240px] items-center justify-center">
                  <View className="p-3 mb-2 rounded-full bg-[#699900]">
                    <RemixIcon name="blur-off-fill" size={16} color="white" />
                  </View>
                  <Text className="text-xs font-normal text-black/50">
                    No Rewards History Available
                  </Text>
                </View>
              )}
            </ScrollView>
            {rewardTotalPages ? (
              <View className="flex flex-row space-x-2 items-center justify-center py-4">
                <Pressable
                  disabled={rewardCurrentPage === 1}
                  onPress={() => handleRewardPageChange(rewardCurrentPage - 1)}
                >
                  <RemixIcon name="arrow-left-s-line" size={16} color="black" />
                </Pressable>

                {Array.from(
                  {
                    length: Math.min(5, rewardTotalPages),
                  },
                  (_, index) => {
                    const startPage = Math.max(1, rewardCurrentPage - 2);
                    const page = startPage + index;
                    return page <= rewardTotalPages ? page : null;
                  }
                ).map(
                  (page) =>
                    page && ( // Only render valid pages
                      <Pressable
                        key={page}
                        onPress={() => handleRewardPageChange(page)}
                        className="p-2"
                      >
                        <Text
                          className={
                            rewardCurrentPage === page
                              ? "text-lg font-semibold text-[#466600]"
                              : "text-xs font-semibold text-black"
                          }
                        >
                          {page}
                        </Text>
                      </Pressable>
                    )
                )}

                <Pressable
                  disabled={rewardCurrentPage === rewardTotalPages}
                  onPress={() => handleRewardPageChange(rewardCurrentPage + 1)}
                >
                  <RemixIcon
                    name="arrow-right-s-line"
                    size={16}
                    color="black"
                  />
                </Pressable>
              </View>
            ) : null}
          </View>
          <View className="w-full flex flex-row items-center justify-between px-4 py-4">
            <View className="w-full flex flex-row items-center justify-between pl-6 pr-4 py-3 rounded-full bg-[#E6E6E6]">
              <View className="w-6/12 flex-row items-center justify-start">
                <RemixIcon
                  name="search-2-line"
                  size={16}
                  color={"rgba(0, 0, 0, 0.5)"}
                />
                <TextInput
                  className="w-full bg-[#E6E6E6] text-xs font-normal pl-2"
                  placeholder="search points history"
                  value={pointSearch}
                  onChangeText={handlePointSearch}
                  numberOfLines={1}
                />
              </View>
              <Pressable
                className="w-4/12 px-4 py-2 flex flex-row items-center justify-between rounded-full bg-[#050301]"
                onPress={handlePointFilterStatus}
              >
                <Text
                  className="text-xs font-normal text-white"
                  numberOfLines={1}
                >
                  {pointsFilterStatus}
                </Text>
                <RemixIcon name="refresh-line" size={16} color="white" />
              </Pressable>
            </View>
          </View>
          <View className="w-full flex items-center justify-center pt-4">
            <View className="w-full flex flex-row items-start justify-between px-4 pb-4">
              <View className="w-full flex flex-row items-center justify-start space-x-2">
                <Pressable
                  className="p-2 bg-[#050301] rounded-full"
                  onPress={() => setPointsAdd(true)}
                >
                  <RemixIcon name="add-line" size={16} color="white" />
                </Pressable>
                <View className="w-3/4 flex flex-col items-start justify-center">
                  <Text className="text-sm font-semibold" numberOfLines={1}>
                    Points History
                  </Text>
                  <Text
                    className="text-xs font-normal text-black/50"
                    numberOfLines={1}
                  >
                    all records of collected points
                  </Text>
                </View>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex w-full"
            >
              {pointsHistory.length > 0 ? (
                pointsHistory.map(
                  (pointHistory: PointsHistory, index: number) => {
                    const reward = redeemables.find(
                      (reward: RedeemableItem) => reward._id === "hehe"
                    );

                    const firstItem = index === 0;
                    const lastItem = index === pointsHistory.length - 1;

                    const margin = firstItem
                      ? "mx-4"
                      : lastItem
                      ? "mr-4"
                      : "mr-4";

                    return (
                      <View
                        className={`bg-slate-500 rounded-[32px] w-[320px] h-[240px] overflow-hidden mr-4 ${margin}`}
                        key={pointHistory._id}
                      >
                        <ImageBackground
                          className="w-full h-full "
                          source={
                            reward
                              ? {
                                  uri: `http://192.168.254.139:8080/api/images/${reward.image}`,
                                }
                              : require("../../assets/images/Man.jpg")
                          }
                        >
                          <LinearGradient
                            className="w-full h-full p-5"
                            colors={[
                              "rgba(18, 18, 18, 0)",
                              "rgba(18, 18, 18, 0.6)",
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                          >
                            <View className="flex flex-col h-full justify-between">
                              <View className="w-full flex flex-row items-start justify-between">
                                <Text
                                  className="text-xs font-normal text-white/50 uppercase max-w-[50%]"
                                  numberOfLines={1}
                                >
                                  #{pointHistory._id}
                                </Text>
                                <View className="max-w-[40%] flex flex-row items-center justify-end">
                                  <View className="py-3 px-4 rounded-full flex flex-row bg-[#050301]/50">
                                    {pointHistory.archiveDate === null ? (
                                      <>
                                        <Pressable
                                          className="pr-4"
                                          onPress={() => {
                                            setPointsEdit(true);
                                            setPointHistoryId(pointHistory._id);
                                          }}
                                        >
                                          <RemixIcon
                                            name="edit-2-line"
                                            size={16}
                                            color="white"
                                          />
                                        </Pressable>
                                        <Pressable
                                          onPress={() =>
                                            archivePointHistory(
                                              pointHistory._id
                                            )
                                          }
                                        >
                                          <RemixIcon
                                            name="archive-line"
                                            size={16}
                                            color="white"
                                          />
                                        </Pressable>
                                      </>
                                    ) : (
                                      <>
                                        <Pressable
                                          className="pr-4"
                                          onPress={() => {
                                            setPointsArchiveForm(true);
                                            setPointHistoryId(pointHistory._id);
                                          }}
                                        >
                                          <RemixIcon
                                            name="folder-history-line"
                                            size={16}
                                            color="white"
                                          />
                                        </Pressable>
                                        <Pressable
                                          onPress={() =>
                                            unarchivePointHistory(pointHistory)
                                          }
                                        >
                                          <RemixIcon
                                            name="inbox-unarchive-line"
                                            size={16}
                                            color="white"
                                          />
                                        </Pressable>
                                      </>
                                    )}
                                  </View>
                                </View>
                              </View>
                              <View className="w-full flex items-start justify-center">
                                <View className="w-full flex items-start justify-center pb-4">
                                  <Text
                                    className="text-sm font-semibold text-white capitalize"
                                    numberOfLines={1}
                                  >
                                    {`${pointHistory.userInfo.personalInfo.firstName} ${pointHistory.userInfo.personalInfo.lastName}`}
                                  </Text>
                                </View>
                                <View className="w-full overflow-hidden flex flex-row justify-start items-center">
                                  <LinearGradient
                                    className="flex items-center justify-center px-4 py-2 rounded-full mr-1 max-w-[50%]"
                                    colors={["#699900", "#466600"]}
                                  >
                                    <Text
                                      className="text-xs font-normal text-white"
                                      numberOfLines={1}
                                    >
                                      {`${pointHistory.bottleCount} ${
                                        pointHistory.bottleCount > 1
                                          ? "bottles"
                                          : "bottle"
                                      }`}
                                    </Text>
                                  </LinearGradient>
                                  <LinearGradient
                                    className="flex items-center justify-center px-4 py-2 rounded-full max-w-[40%]"
                                    colors={["#699900", "#466600"]}
                                  >
                                    <Text
                                      className="text-xs font-normal text-white"
                                      numberOfLines={1}
                                    >
                                      {(() => {
                                        const date = new Date(
                                          pointHistory.dateDisposed
                                        );
                                        return isNaN(date.getTime())
                                          ? "Invalid Date"
                                          : date.toLocaleDateString("en-US");
                                      })()}
                                    </Text>
                                  </LinearGradient>
                                </View>
                              </View>
                            </View>
                          </LinearGradient>
                        </ImageBackground>
                      </View>
                    );
                  }
                )
              ) : (
                <View className="flex w-[100vw] h-[240px] items-center justify-center">
                  <View className="p-3 mb-2 rounded-full bg-[#699900]">
                    <RemixIcon name="blur-off-fill" size={16} color="white" />
                  </View>
                  <Text className="text-xs font-normal text-black/50">
                    No Points History Available
                  </Text>
                </View>
              )}
            </ScrollView>
            {pointTotalPages ? (
              <View className="flex flex-row space-x-2 items-center justify-center py-4">
                <Pressable
                  disabled={pointCurrentPage === 1}
                  onPress={() => handlePointPageChange(pointCurrentPage - 1)}
                >
                  <RemixIcon name="arrow-left-s-line" size={16} color="black" />
                </Pressable>

                {Array.from(
                  {
                    length: Math.min(5, pointTotalPages),
                  },
                  (_, index) => {
                    const startPage = Math.max(1, pointCurrentPage - 2);
                    const page = startPage + index;
                    return page <= pointTotalPages ? page : null;
                  }
                ).map(
                  (page) =>
                    page && ( // Only render valid pages
                      <Pressable
                        key={page}
                        onPress={() => handlePointPageChange(page)}
                        className="p-2"
                      >
                        <Text
                          className={
                            pointCurrentPage === page
                              ? "text-lg font-semibold text-[#466600]"
                              : "text-xs font-semibold text-black"
                          }
                        >
                          {page}
                        </Text>
                      </Pressable>
                    )
                )}

                <Pressable
                  disabled={pointCurrentPage === pointTotalPages}
                  onPress={() => handlePointPageChange(pointCurrentPage + 1)}
                >
                  <RemixIcon
                    name="arrow-right-s-line"
                    size={16}
                    color="black"
                  />
                </Pressable>
              </View>
            ) : null}
          </View>
          <View className="pb-32"></View>
        </ScrollView>
      </>
      {loading && <Loader />}
      {rewardAdd && (
        <RewardHistoryAdd
          onClose={() => {
            setRewardAdd(false);
            clearRewardFilters();
            fetchRewardHistoryData();
          }}
        />
      )}
      {pointsAdd && (
        <PointsHistoryAdd
          onClose={() => {
            setPointsAdd(false);
            clearRewardFilters();
            fetchPointHistoryData();
          }}
        />
      )}
      {rewardEdit && (
        <RewardHistoryEdit
          onClose={() => {
            setRewardEdit(false);
            clearRewardFilters();
            fetchRewardHistoryData();
          }}
          historyId={rewardHistoryId}
        />
      )}
      {pointsEdit && (
        <PointsHistoryEdit
          onClose={() => {
            setPointsEdit(false);
            clearRewardFilters();
            fetchPointHistoryData();
          }}
          historyId={pointHistoryId}
        />
      )}
      {visibleModal && (
        <Modal
          header="History"
          icon="history"
          message={message}
          isVisible={visibleModal}
          onClose={() => setVisibleModal(false)}
        />
      )}
      {pointsArchiveForm && (
        <ArchiveDateEdit
          data={pointHistoryId}
          onClose={() => setPointsArchiveForm(false)}
        />
      )}
      {rewardsArchiveForm && (
        <ArchiveDateForm
          data={historyData}
          onClose={() => setRewardsArchiveForm(false)}
        />
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default History;
