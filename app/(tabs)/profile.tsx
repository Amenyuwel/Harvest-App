import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-6">

      {/* Name (Heading - Lato) */}
      <Text className="text-2xl font-heading text-gray-800">Amenyuwel</Text>

      {/* Bio (Body - Quicksand) */}
      <Text className="text-gray-600 text-center mt-2 mb-6 font-body">
        Computer Science Student | React Native Dev 🚀
      </Text>

      {/* Action Buttons */}
      <View className="flex-row space-x-4">
        <TouchableOpacity className="bg-blue-500 px-5 py-2 rounded-2xl shadow">
          <Text className="text-white font-body font-semibold">Follow</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-gray-300 px-5 py-2 rounded-2xl shadow">
          <Text className="text-gray-800 font-body font-semibold">Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
