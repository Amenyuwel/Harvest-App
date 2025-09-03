import { View, Text, Image, TouchableOpacity, StatusBar } from "react-native";
import React from "react";
import Avatar from "@/assets/images/Pulay.jpg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Header = () => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ECEBE2" />
      <View
        className="w-full bg-background px-4 flex-row items-center justify-between shadow-xl"
        style={{
          paddingTop: insets.top + 10,
          paddingBottom: 15,
        }}
      >
        {/* Left side: Avatar + Username */}
        <View className="flex-row items-center px-4">
          <Image
            source={Avatar} // ✅ use imported image
            className="w-12 h-12 rounded-full mr-3"
          />
          <Text className="text-gray-600 text-2xl">Username</Text>
        </View>

        {/* Right side: Notification bell */}
        <TouchableOpacity className="p-2">
          <Text className="text-xl px-4">🔔</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Header;
