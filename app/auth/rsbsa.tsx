import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useRsbsa } from "../../hooks/useRsbsa";

export default function RSBSAPage() {
  const { rsbsa, setRsbsa, isValid } = useRsbsa();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!rsbsa || !isValid) {
      Alert.alert(
        "Invalid Format",
        "Please enter a valid RSBSA format: 126303-XXX-XXXXX"
      );
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/auth/check-rsbsa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rsbsaNumber: rsbsa }),
      });

      if (response.ok) {
        // RSBSA exists - navigate to login page
        router.push({ pathname: "/auth/login", params: { rsbsa } });
      } else if (response.status === 404) {
        // RSBSA not found - navigate to register page
        const parts = rsbsa.split("-");
        const barangayId = parts[1];
        const farmerCount = parts[2];
        router.push({
          pathname: "/auth/register",
          params: { rsbsa, barangay: barangayId, count: farmerCount },
        });
      } else {
        Alert.alert("Error", "Failed to verify RSBSA. Please try again.");
      }
    } catch (error) {
      Alert.alert(
        "Connection Error",
        "Failed to verify RSBSA. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center items-center p-4">
          <View className="w-full max-w-md">
            <View className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
              <Text className="text-2xl font-bold text-gray-800 mb-4">
                Enter RSBSA Number
              </Text>
              <TextInput
                value={rsbsa}
                onChangeText={setRsbsa}
                placeholder="126303-XXX-XXXXX"
                keyboardType="numeric"
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-lg"
                maxLength={16}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {!isValid && rsbsa.length > 0 && (
                <Text className="text-red-600 mb-2">
                  Invalid RSBSA format. Example: 126303-003-00001
                </Text>
              )}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!isValid || isLoading}
                className={`bg-green-600 rounded-lg py-3 items-center ${
                  (!isValid || isLoading) && "opacity-50"
                }`}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-lg">Continue</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
