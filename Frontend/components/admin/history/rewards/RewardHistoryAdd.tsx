import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRewards } from "@/context/RewardsProvider";
import { useUrl } from "@/context/UrlProvider";
import { useAdminHistory } from "@/context/AdminHistoryProvider";
import { Image } from "expo-image";
import Modal from "@/components/modal";
import { LinearGradient } from "expo-linear-gradient";
import Loader from "@/components/loader";
import ChooseUserAdd from "./ChooseUserAdd";

const RewardHistoryAdd = ({ onClose }: { onClose: () => void }) => {
  const { fetchRewards, filterRewards, rewards, categories } = useRewards();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [filtered, setFiltered] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [message, setMessage] = useState("");
  const { ipAddress, port } = useUrl();
  const [chooseModal, setChooseModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Item | null>(null);
  const { fetchAllRewardsHistory } = useAdminHistory();

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

  return (
    <>
      <SafeAreaView className="flex-1 w-full bg-[#F0F0F0] absolute top-0 left-0 right-0 bottom-0">
        <View className="relative w-full flex flex-row items-center justify-center p-4">
          <TouchableHighlight
            underlayColor={"#C9C9C9"}
            className="absolute left-4 rounded-full"
            onPress={onClose}
          >
            <View className="p-2 bg-[#E1E1E1] rounded-full flex items-center justify-center">
              <Ionicons name="chevron-back" size={18} />
            </View>
          </TouchableHighlight>
          <Text className="text-xl font-semibold">Add Reward History</Text>
        </View>
        <View className="w-full flex items-start justify-start pt-4 pb-2 px-4">
          <Text className="text-xl font-semibold">Choose Items</Text>
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
                        : ["#00674F", "#06402B"]
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
                  <Image
                    className="w-full flex-1"
                    source={{
                      uri: `http://192.168.254.139:8080/api/images/${item.image}`,
                    }}
                  />
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
                      setChooseModal(true);
                      setSelectedReward(item);
                    }}
                  >
                    <LinearGradient
                      colors={["#00674F", "#06402B"]}
                      className="p-2 rounded-full shadow shadow-black"
                    >
                      <Ionicons
                        name="return-down-forward"
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
      {chooseModal && (
        <ChooseUserAdd
          onClose={() => {
            setChooseModal(false);
            onClose();
            fetchAllRewardsHistory();
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
          }}
          icon="redeem"
        />
      )}
    </>
  );
};

export default RewardHistoryAdd;
