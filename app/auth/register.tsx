import "@/global.css";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Register() {
  const [usernameInput, setUsernameInput] = useState("");

  const handleUsernameChange = (text: string) => {
    // Check if input is all numbers (RSBSA)
    if (/^\d+$/.test(text)) {
      // If numbers, limit to 3 digits
      if (text.length <= 5) {
        setUsernameInput(text);
      }
    } else {
      // If string/mixed, limit to 20 characters
      if (text.length <= 20) {
        setUsernameInput(text);
      }
    }
  };

  const handleRegister = () => {
    // Save the username/code for login
    // After registration, go to login to set password
    router.push({
      pathname: "/auth/login",
      params: { username: usernameInput, fromRegister: "true" }
    });
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-8">
      <Text className="text-3xl font-heading text-gray-800 mb-8 text-center">
        Welcome to Harvest Assistant!
      </Text>
      <Text className="text-2xl font-body text-gray-800 mb-4">
        Create an account
      </Text>
      <TextInput
        className="w-full p-4 border border-gray-300 rounded-2xl mb-4"
        placeholder="Username/RSBSA (5 digits)"
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
        value={usernameInput}
        onChangeText={handleUsernameChange}
      />
      <TouchableOpacity
        className="w-full bg-blue-500 p-4 rounded-3xl mb-4"
        onPress={handleRegister}
      >
        <Text className="text-white text-center font-body text-lg">Next</Text>
      </TouchableOpacity>
    </View>
  );
}