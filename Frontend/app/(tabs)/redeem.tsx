import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableHighlight,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Image } from "expo-image";
import Modal from "../../components/modal";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/loader";

const Redeem = () => {
  const [redeemables, setRedeemables] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const { user } = useAuth();
  const [filter, setFilter] = useState("All");
  const [visibleModal, setVisibleModal] = useState(false);
  const [message, setMessage] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(false);

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
    };
  }

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const redeemItem = async ({
    itemId,
    pointsSpent,
  }: {
    itemId: string;
    pointsSpent: number;
  }) => {
    if (user) {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://192.168.254.139:8080/api/history/claim",
          {
            userId: user._id,
            rewardId: itemId,
            pointsSpent: pointsSpent,
          }
        );

        if (response.status === 200) {
          setMessage(response.data.message);
          setLoading(false);
        } else {
          setMessage(response.data.message);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        setMessage("An error occurred!");
      }
    }
  };

  useEffect(() => {
    const fetchUserPoints = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `http://192.168.254.139:8080/api/history/claim/points/${user._id}`
          );
          setTotalPoints(response.data.availablePoints.availablePoints);
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("not user");
      }
    };
    fetchUserPoints();
  }, [redeemItem]);

  useEffect(() => {
    const fetchRewards = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://192.168.254.139:8080/api/rewards"
        );
        setRedeemables(response.data.rewards);
        setCategories(
          Array.from(
            new Set(response.data.rewards.map((item: Item) => item.category))
          )
        );
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchRewards();
  }, []);

  const filteredRedeemables = useMemo(() => {
    return redeemables.filter(
      (item: Item) => filter === "All" || item.category === filter
    );
  }, [redeemables, filter]);

  const toggleFilter = (category: string) => {
    category !== filter ? setFilter(category) : setFilter("All");
  };

  return (
    <>
      <SafeAreaView className="flex-1 px-6 pt-4">
        <LinearGradient
          colors={["#050301", "#757575"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          className="w-full p-6 rounded-xl flex items-center justify-center mb-1"
        >
          <View className="w-full flex flex-row items-center justify-start">
            <View className="w-[50px] h-[50px] rounded-full bg-white overflow-hidden mr-2">
              <Image
                source={require("../../assets/images/Man.jpg")}
                className="w-full h-full"
              />
            </View>
            <View className="w-full flex items-start justify-center">
              <Text
                className="text-sm font-semibold text-white pb-1"
                numberOfLines={1}
              >
                {!user
                  ? "Loading"
                  : `${user.personalInfo.firstName} ${user.personalInfo.lastName}`}
              </Text>
              <View className="flex items-center justify-center px-2 py-1 bg-[#E1E1E1] rounded-md">
                <Text
                  className="text-[10px] font-normal text-black uppercase"
                  numberOfLines={1}
                >
                  {!user ? "Loading" : `#${user._id}`}
                </Text>
              </View>
            </View>
          </View>
          <View className="w-full flex flex-row items-end justify-end pt-12">
            <View className="pr-1">
              <MaterialCommunityIcons
                name="currency-rub"
                size={14}
                color="rgba(255, 255, 255, 0.5)"
              />
            </View>
            <Text className="text-xs font-normal text-white/50 pr-2">
              Redeemable Points
            </Text>
            <Text className="text-sm font-semibold text-white">
              {totalPoints}
            </Text>
          </View>
        </LinearGradient>

        <View className="w-full flex flex-row py-3 mb-1">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category, index) => (
              <Pressable
                className="mr-2 rounded-xl"
                key={index}
                onPress={() => toggleFilter(category)}
              >
                <LinearGradient
                  colors={
                    filter !== category
                      ? ["#E1E1E1", "#C9C9C9"]
                      : ["#00674F", "#06402B"]
                  }
                  className="px-6 py-3 flex items-center justify-center rounded-xl"
                >
                  <Text
                    className={
                      filter === category
                        ? "text-sm font-normal text-white"
                        : "text-sm font-normal text-black"
                    }
                  >
                    {category}
                  </Text>
                </LinearGradient>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <ScrollView
          className="flex-1 w-full"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full flex items-start justify-start pt-4 pb-2">
            <Text className="text-xl font-semibold">Redeemable Items</Text>
            <Text className="text-sm font-normal text-black/50">
              Choose a Reward of your choice
            </Text>
          </View>
          <View className="w-full flex flex-row flex-wrap items-center justify-between">
            {filteredRedeemables.map((item: Item) => (
              <View
                className="w-[48%] h-[200px] overflow-hidden mb-3"
                key={item._id}
              >
                <View className="w-full h-[70%] flex items-center justify-center bg-gray-400 rounded-xl overflow-hidden">
                  <Image
                    className="w-full flex-1"
                    source={{
                      uri: `http://192.168.254.139:8080/api/images/${item.image}`,
                    }}
                    contentFit="cover"
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
                    className="flex items-center justify-center rounded-xl"
                    underlayColor={"#41917F"}
                    onPress={() => {
                      setVisibleModal(true);
                      redeemItem({
                        itemId: item._id,
                        pointsSpent: item.pointsRequired,
                      });
                    }}
                  >
                    <LinearGradient
                      colors={["#00674F", "#06402B"]}
                      className="p-2 rounded-xl shadow shadow-black"
                    >
                      <Ionicons
                        name="return-down-forward"
                        size={20}
                        color="white"
                      />
                    </LinearGradient>
                  </TouchableHighlight>
                </View>
              </View>
            ))}
          </View>
          <View className="w-full pb-32"></View>
        </ScrollView>
      </SafeAreaView>

      <StatusBar style="auto" />
      {loading && <Loader />}
      {visibleModal && (
        <Modal
          header="Checkout"
          message={message}
          isVisible={visibleModal}
          onClose={() => setVisibleModal(false)}
          icon="redeem"
        />
      )}
    </>
  );
};

export default Redeem;
