import Carousel from "@/components/home/Carousel";
import Scan from "@/components/home/Scan";
import Activity from "@/components/home/Activity";
import React from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomePage() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-background px-4"
      contentContainerStyle={{
        paddingBottom: 110,
      }}
    >
      <View className="flex-col gap-4 mt-6">
        <Carousel />
        <Scan />
        <Activity />
      </View>
    </ScrollView>
  );
}
