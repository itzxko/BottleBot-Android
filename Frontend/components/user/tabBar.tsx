import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { blue } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View className="absolute bottom-5 flex-row items-center justify-evenly mx-[100px] bg-white p-4 rounded-3xl shadow-xl shadow-black">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            className="flex-1 justify-center items-center gap-y-1"
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            key={route.name}
          >
            {isFocused ? (
              <Text
                className="text-[10px] font-extrabold text-[#00674F]"
                numberOfLines={1}
              >
                {typeof label === "string" ? label : options.title}
              </Text>
            ) : (
              <Feather
                name={
                  route.name === "dashboard"
                    ? "home"
                    : route.name === "redeem"
                    ? "shopping-bag"
                    : route.name === "history"
                    ? "calendar"
                    : "user"
                }
                size={20}
                color={"rgba(0, 0, 0, 0.2)"}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
