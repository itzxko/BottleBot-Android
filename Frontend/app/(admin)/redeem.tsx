import {
  View,
  Text,
  TouchableHighlight,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRewards } from "@/context/RewardsProvider";
import { StatusBar } from "expo-status-bar";
import Loader from "@/components/loader";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image, ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Modal from "@/components/modal";
import { useUrl } from "@/context/UrlProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import CheckoutModal from "@/components/admin/redeem/checkoutModal";
import { useAdminHistory } from "@/context/AdminHistoryProvider";
import RewardsForm from "@/components/admin/redeem/rewardsForm";
import axios from "axios";
import RemixIcon from "react-native-remix-icon";
import { usePagination } from "@/context/PaginationProvider";

const redeem = () => {
  const {
    getRewards,
    filterRewards,
    rewards,
    searchRewards,
    totalPages,
    getArchivedRewards,
    getCategories,
    searchArchivedRewards,
  } = useRewards();
  const { rewardLimit } = usePagination();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [filtered, setFiltered] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [message, setMessage] = useState("");
  const { ipAddress, port } = useUrl();
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [rewardsForm, setRewardsForm] = useState(false);
  const [rewardId, setRewardId] = useState("");
  const [selectedReward, setSelectedReward] = useState<Item | null>(null);
  const { fetchAllHistory } = useAdminHistory();
  const [clickedReward, setClickedReward] = useState<string | null>(null);
  const [type, setType] = useState("add");
  const [isError, setIsError] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("active");
  const categories = ["Goods", "Clothing", "Beverage", "Other"];

  interface Item {
    _id: string;
    archiveDate: Date;
    validFrom: Date;
    validUntil: Date;
    rewardDescription: string;
    name: string;
    category: string;
    image: string;
    pointsRequired: number;
    rewardName: string;
    stocks: number;
  }

  const fetchData = async () => {
    setLoading(true);
    await getCategories();

    try {
      if (userSearch.trim()) {
        // Check if there's an active search
        if (filterStatus === "active") {
          await searchRewards(userSearch, filter, currentPage, rewardLimit);
        } else {
          await searchArchivedRewards(
            userSearch,
            filter,
            currentPage,
            rewardLimit
          );
        }
      } else {
        // No search; just fetch based on filter status
        if (filterStatus === "active") {
          await getRewards(currentPage, rewardLimit);
        } else {
          await getArchivedRewards(currentPage, rewardLimit);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterStatus, currentPage]);

  const handleFilterStatus = async () => {
    setFilterStatus((prevStatus) =>
      prevStatus === "active" ? "archive" : "active"
    );
    setUserSearch("");
    setCurrentPage(1);
  };

  const handleFilter = async (category: string) => {
    setLoading(true);

    try {
      // Check if the selected category is already applied
      if (category === filter) {
        setFilter("All");
        setFiltered(false);

        // Fetch rewards based on the current filterStatus (active or archived)
        if (filterStatus === "active") {
          await searchRewards(userSearch, "All", 1, rewardLimit);
        } else {
          await searchArchivedRewards(userSearch, "All", 1, rewardLimit);
        }
      } else {
        setFilter(category);
        setFiltered(true);

        // Fetch rewards with the selected category based on filterStatus
        if (filterStatus === "active") {
          await searchRewards(userSearch, category, 1, rewardLimit);
        } else {
          await searchArchivedRewards(userSearch, category, 1, rewardLimit);
        }
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (reward: string) => {
    setUserSearch(reward);
    setLoading(true);
    setCurrentPage(1);

    try {
      if (reward.trim() === "") {
        setUserSearch("");
        setFilter("All");

        if (filterStatus === "active") {
          await getRewards(1, rewardLimit);
        } else {
          await getArchivedRewards(1, rewardLimit);
        }
      } else {
        if (filterStatus === "active") {
          await searchRewards(reward, filter, 1, rewardLimit);
        } else {
          await searchArchivedRewards(reward, filter, 1, rewardLimit);
        }
      }
    } catch (error: any) {
      console.log(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setLoading(true);

      try {
        if (userSearch.trim() !== "" || filter !== "All") {
          // Apply search or filter on page change
          if (filterStatus === "active") {
            await searchRewards(userSearch, filter, newPage, rewardLimit);
          } else {
            await searchArchivedRewards(
              userSearch,
              filter,
              newPage,
              rewardLimit
            );
          }
        } else {
          // Default pagination without search or filter
          if (filterStatus === "active") {
            await getRewards(newPage, rewardLimit);
          } else if (filterStatus === "archive") {
            await getArchivedRewards(newPage, rewardLimit);
          }
        }
      } catch (error) {
        console.error("Error fetching rewards:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const archiveReward = async (rewardId: string) => {
    setLoading(true);

    try {
      let url = `http://${ipAddress}:${port}/api/rewards/${rewardId}`;

      let response = await axios.delete(url);

      if (response.data.success === true) {
        setVisibleModal(true);
        setMessage(response.data.message);
        setIsError(false);
        setFilterStatus("archive");
        clearFilters();
      }
    } catch (error: any) {
      setVisibleModal(true);
      setMessage(error.response.data.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const unarchiveReward = async (reward: Item) => {
    setLoading(true);

    //dates
    const validFromDate = new Date(reward.validFrom);
    const validFromString = validFromDate.toISOString();
    const validUntilDate = new Date(reward.validUntil);
    const validUntilString = validUntilDate.toISOString();

    const formData = new FormData();
    formData.append("rewardName", reward.rewardName);
    formData.append("archiveDate", "");
    formData.append("validFrom", validFromString);
    formData.append("validUntil", validUntilString);
    formData.append("rewardDescription", reward.rewardDescription);
    formData.append("pointsRequired", reward.pointsRequired.toString());
    formData.append("stocks", reward.stocks.toString());
    formData.append("category", reward.category);
    formData.append("image", reward.image);

    try {
      let url = `http://${ipAddress}:${port}/api/rewards/${reward._id}`;

      let response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success === true) {
        setVisibleModal(true);
        setMessage(response.data.message);
        setFilterStatus("active");
        clearFilters();
      }
    } catch (error: any) {
      setVisibleModal(true);
      setMessage(error.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setUserSearch("");
    setFilter("All");
    setFilterStatus("active");
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#F0F0F0]">
        <View className="relative w-full flex flex-row items-center justify-center p-4">
          <TouchableHighlight
            underlayColor={"#C9C9C9"}
            className="absolute left-4 rounded-full"
          >
            <View className="p-2 bg-[#E1E1E1] rounded-full flex items-center justify-center">
              <RemixIcon name="arrow-left-s-line" size={16} color="black" />
            </View>
          </TouchableHighlight>
          <Text className="text-sm font-semibold">Redeem</Text>
          <TouchableHighlight
            underlayColor={"#C9C9C9"}
            className="absolute right-4 rounded-full"
            onPress={() => {
              setType("add");
              setRewardsForm(true);
            }}
          >
            <View className="p-2 bg-[#E1E1E1] rounded-full flex items-center justify-center">
              <RemixIcon name="add-line" size={16} color="black" />
            </View>
          </TouchableHighlight>
        </View>
        <View className="w-full flex flex-row items-center justify-between pt-4 px-4">
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
                numberOfLines={1}
                value={userSearch}
                onChangeText={handleSearch}
              />
            </View>
            <Pressable
              className="w-4/12 flex flex-row items-center justify-between px-4 py-2 bg-[#050301] rounded-full"
              onPress={handleFilterStatus}
            >
              <Text
                className="w-2/3 text-xs font-normal text-white capitalize"
                numberOfLines={1}
              >
                {filterStatus}
              </Text>
              <RemixIcon name="refresh-line" size={16} color="white" />
            </Pressable>
          </View>
        </View>
        <View className="w-full flex items-start justify-start pt-4 pb-2 px-4">
          <Text className="text-sm font-semibold">Redeemable Items</Text>
          <Text className="text-sm font-normal text-black/50">
            Choose a Reward of your choice
          </Text>
        </View>

        <View className="w-full flex flex-row py-1.5 mb-1">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category: string, index: number) => {
              const firstItem = index === 0;
              const lastItem = index === categories.length - 1;

              const margin = firstItem
                ? "ml-4 mr-2"
                : lastItem
                ? "mr-4"
                : "mr-2";
              return (
                <Pressable
                  className={`rounded-xl ${margin}`}
                  key={category}
                  onPress={() => handleFilter(category)}
                >
                  <LinearGradient
                    colors={
                      filter !== category
                        ? ["#E1E1E1", "#d9d9d9"]
                        : ["#699900", "#466600"]
                    }
                    className="px-8 py-3 flex items-center justify-center rounded-full"
                  >
                    <Text
                      className={
                        filter === category
                          ? "text-xs font-semibold text-white"
                          : "text-xs font-normal text-black"
                      }
                    >
                      {category}
                    </Text>
                  </LinearGradient>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <ScrollView
          className="flex-1 w-full"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full flex flex-row flex-wrap items-center justify-between px-4">
            {rewards.length > 0 ? (
              rewards.map((item: Item) => (
                <View
                  className="w-[48%] h-[200px] overflow-hidden mb-4"
                  key={item._id}
                >
                  <View className="w-full h-[70%] flex items-center justify-center bg-gray-400 rounded-3xl overflow-hidden">
                    <ImageBackground
                      className="w-full flex-1"
                      source={{
                        uri: `http://${ipAddress}:${port}/api/images/${item.image}`,
                      }}
                    >
                      <Pressable
                        className="flex-1 w-full items-center justify-center"
                        onPress={() =>
                          setClickedReward((prevReward) =>
                            prevReward === item._id ? null : item._id
                          )
                        }
                      >
                        {clickedReward === item._id ? (
                          <LinearGradient
                            colors={[
                              "rgba(31, 31, 31, 0.2)",
                              "rgba(31, 31, 31, 0.8)",
                            ]}
                            className="w-full flex-1 flex-row items-center justify-center"
                          >
                            <View className="flex flex-row px-4 py-2 bg-[#050301]/50 rounded-3xl">
                              <Pressable
                                className="p-2"
                                onPress={() => {
                                  setRewardId(item._id);
                                  setRewardsForm(true);
                                  setType("edit");
                                }}
                              >
                                <RemixIcon
                                  name="edit-2-line"
                                  size={16}
                                  color="white"
                                />
                              </Pressable>
                              {item.archiveDate === null ? (
                                <Pressable
                                  className="p-2"
                                  onPress={() => archiveReward(item._id)}
                                >
                                  <RemixIcon
                                    name="archive-line"
                                    size={16}
                                    color="white"
                                  />
                                </Pressable>
                              ) : (
                                <Pressable
                                  className="p-2"
                                  onPress={() => unarchiveReward(item)}
                                >
                                  <RemixIcon
                                    name="price-tag-line"
                                    size={16}
                                    color="white"
                                  />
                                </Pressable>
                              )}
                            </View>
                          </LinearGradient>
                        ) : null}
                      </Pressable>
                    </ImageBackground>
                  </View>
                  <View className="w-full px-1 py-3 flex flex-row items-center justify-between ">
                    <View className="max-w-[60%]">
                      <Text
                        className="text-sm font-semibold text-black capitalize"
                        numberOfLines={1}
                      >
                        {item.rewardName}
                      </Text>
                      <Text
                        className="text-xs font-normal text-black"
                        numberOfLines={1}
                      >
                        {item.pointsRequired} pt., {item.stocks} avail.
                      </Text>
                    </View>
                    {item.archiveDate === null ? (
                      <TouchableHighlight
                        className="flex items-center justify-center rounded-full"
                        underlayColor={"#41917F"}
                        onPress={() => {
                          setCheckoutModal(true);
                          setSelectedReward(item);
                        }}
                      >
                        <LinearGradient
                          colors={["#699900", "#466600"]}
                          className="p-2 rounded-full shadow shadow-black"
                        >
                          <RemixIcon
                            name="arrow-right-s-line"
                            size={16}
                            color="white"
                          />
                        </LinearGradient>
                      </TouchableHighlight>
                    ) : (
                      <TouchableHighlight
                        className="flex items-center justify-center rounded-full"
                        underlayColor={"#41917F"}
                      >
                        <LinearGradient
                          colors={["#699900", "#466600"]}
                          className="p-2 rounded-full shadow shadow-black"
                        >
                          <RemixIcon
                            name="error-warning-line"
                            size={16}
                            color="white"
                          />
                        </LinearGradient>
                      </TouchableHighlight>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <View className="w-full h-[240px] items-center justify-center">
                <View className="p-3 mb-2 rounded-full bg-[#699900]">
                  <RemixIcon name="blur-off-fill" size={16} color="white" />
                </View>
                <Text className="text-xs font-normal text-black/50">
                  No Rewards Found
                </Text>
              </View>
            )}
          </View>
          {totalPages ? (
            <View className="flex flex-row space-x-2 items-center justify-center">
              <Pressable
                disabled={currentPage === 1}
                onPress={() => handlePageChange(currentPage - 1)}
              >
                <RemixIcon name="arrow-left-s-line" size={16} color="black" />
              </Pressable>

              {Array.from(
                {
                  length: Math.min(5, totalPages),
                },
                (_, index) => {
                  const startPage = Math.max(1, currentPage - 2);
                  const page = startPage + index;
                  return page <= totalPages ? page : null;
                }
              ).map(
                (page) =>
                  page && ( // Only render valid pages
                    <Pressable
                      key={page}
                      onPress={() => handlePageChange(page)}
                      className="p-2"
                    >
                      <Text
                        className={
                          currentPage === page
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
                disabled={currentPage === totalPages}
                onPress={() => handlePageChange(currentPage + 1)}
              >
                <RemixIcon name="arrow-right-s-line" size={16} color="black" />
              </Pressable>
            </View>
          ) : null}

          <View className="w-full pb-24"></View>
        </ScrollView>
      </SafeAreaView>

      <StatusBar style="auto" />
      {loading && <Loader />}
      {rewardsForm && (
        <RewardsForm
          onClose={() => {
            setRewardsForm(false);
            setSelectedReward(null);
            clearFilters();
            fetchData();
          }}
          rewardId={rewardId}
          type={type}
        />
      )}
      {checkoutModal && (
        <CheckoutModal
          onClose={() => {
            setCheckoutModal(false);
            clearFilters();
            fetchData;
            fetchAllHistory();
          }}
          reward={selectedReward}
        />
      )}
      {visibleModal && (
        <Modal
          header="Checkout"
          message={message}
          isVisible={visibleModal}
          onClose={() => {
            setVisibleModal(false);
            if (!isError) {
              clearFilters();
              fetchData();
            }
          }}
          icon="redeem"
        />
      )}
    </>
  );
};

export default redeem;
