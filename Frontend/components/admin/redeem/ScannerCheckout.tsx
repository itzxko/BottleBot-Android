import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import RemixIcon from "react-native-remix-icon";

const ScannerCheckout = ({ onClose }: { onClose: () => void }) => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission?.granted) {
    return (
      <>
        <View className="w-full flex absolute top-0 left-0 bottom-0 right-0 bg-[#050301]/50 items-center justify-center">
          <View className="flex items-center justify-center p-4 rounded-xl bg-[#FAFAFA] space-y-6 max-w-[60%]">
            <View className="w-full flex flex-row items-center justify-end">
              <Pressable onPress={onClose}>
                <RemixIcon name="close-line" size={16} />
              </Pressable>
            </View>
            <View className="w-full flex flex-col items-center justify-center space-y-2">
              <Text className="text-sm font-semibold">Allow Access</Text>
              <Text className="text-xs font-normal text-center">
                Please allow camera access to continue
              </Text>
            </View>
            <Pressable
              className="rounded-md bg-[#050301] min-w-full py-3 flex items-center justify-center"
              onPress={requestPermission}
            >
              <Text className="text-xs font-semibold text-white ">
                Allow Camera
              </Text>
            </Pressable>
          </View>
        </View>
        <StatusBar style="auto" />
      </>
    );
  }

  return (
    <>
      <View className="w-full flex-1 absolute top-0 left-0 bottom-0 right-0 bg-[#FAFAFA]">
        <CameraView
          className="flex-1"
          facing={facing}
          onBarcodeScanned={({ data }) => console.log(data)}
        ></CameraView>
      </View>
      <StatusBar style="auto" />
    </>
  );
};

export default ScannerCheckout;
