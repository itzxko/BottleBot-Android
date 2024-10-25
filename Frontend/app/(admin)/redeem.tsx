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

const redeem = () => {
  const { fetchRewards, filterRewards, rewards, categories } = useRewards();
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

  interface Item {
    _id: string;
    name: string;
    category: string;
    image: string;
    pointsRequired: number;
    rewardName: string;
    stocks: number;
  }
  const fetchData = async () => {
    setLoading(true);
    try {
      await fetchRewards();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      await fetchRewards();
      await fetchAllHistory();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (category: string) => {
    if (category === filter) {
      setFilter("All");
      setFiltered(false);
      await filterRewards("All");
    } else {
      setFilter(category);
      setFiltered(true);
      await filterRewards(category);
    }
  };

  const deleteReward = async (rewardId: string) => {
    setLoading(true);

    try {
      let url = `http://${ipAddress}:${port}/api/rewards/${rewardId}`;

      let response = await axios.delete(url);

      if (response.status === 200) {
        setVisibleModal(true);
        setIsError(false);
        setMessage(response.data.message);
      }
    } catch (error: any) {
      setVisibleModal(true);
      setMessage(error.response.data.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
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
                    className="px-6 py-3 flex items-center justify-center rounded-full"
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
            {rewards.map((item: Item) => (
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
                            <Pressable
                              className="p-2"
                              onPress={() => deleteReward(item._id)}
                            >
                              <RemixIcon
                                name="delete-bin-4-line"
                                size={16}
                                color="white"
                              />
                            </Pressable>
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
                </View>
              </View>
            ))}
          </View>
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
          }}
          rewardId={rewardId}
          type={type}
        />
      )}
      {checkoutModal && (
        <CheckoutModal
          onClose={() => {
            setCheckoutModal(false);
            fetchRewards();
            fetchAllHistory();
            setFilter("All");
            setFiltered(false);
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
              fetchHistory();
            }
          }}
          icon="redeem"
        />
      )}
    </>
  );
};

export default redeem;
