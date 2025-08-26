import React, { useState, useEffect } from "react";
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
  const [barangayIds, setBarangayIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch barangay list from your API
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/barangays`)
      .then((res) => res.json())
      .then((data) => {
        // Assuming data is an array of barangay objects
        setBarangayIds(data.map((b: any) => b.barangayId));
        setLoading(false);
      });
  }, []);

  const { rsbsa, setRsbsa, isValid, error } = useRsbsa("", false, barangayIds);
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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-background"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center items-center p-6 min-h-screen">
          <View className="w-full max-w-sm">
            {/* Logo Section */}
            <View className="items-center mb-12">
              <View className="w-24 h-24 rounded-full border-4 border-emerald-400 bg-white shadow-lg mb-6 items-center justify-center">
                {/* Placeholder logo - you can replace with actual logo */}
                <View className="w-12 h-12 rounded-full bg-emerald-100 items-center justify-center">
                  <Text className="text-emerald-600 text-xl font-bold">🌾</Text>
                </View>
              </View>

              <Text className="text-center text-4xl font-heading font-bold text-black text-balance leading-tight">
                Harvest Assistant
              </Text>
              <Text className="text-center text-black mt-2 text-base font-medium">
                A Smart Pest Management and Enhanced Grain Production
              </Text>
            </View>

            {/* Main Card */}
            <View className="bg-card rounded-3xl shadow-2xl p-8">
              <Text className="text-2xl font-heading font-bold text-black mb-2 text-center">
                Welcome Back
              </Text>
              <Text className="text-gray-500 text-center mb-8 text-base">
                Enter your RSBSA number to continue
              </Text>

              {/* Input Section */}
              <View className="mb-6">
                <Text className="text-gray-700 font-semibold mb-3 text-base">
                  RSBSA Number
                </Text>
                <TextInput
                  value={rsbsa}
                  onChangeText={setRsbsa}
                  placeholder="126303-003-00001"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  className="border-2 border-gray-200 rounded-xl px-4 py-4 text-lg"
                  maxLength={16}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {/* Input helper text */}
                <Text className="text-gray-400 text-sm mt-2">
                  Format: 126303-[Barangay]-[Farmer count]
                </Text>
              </View>

              {/* Error Messages */}
              {error && (
                <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <Text className="text-red-600 text-sm font-medium">
                    {error}
                  </Text>
                </View>
              )}

              {!isValid && !error && rsbsa.length === 16 && (
                <View className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                  <Text className="text-orange-600 text-sm font-medium">
                    Invalid RSBSA format. Please check your input.
                  </Text>
                </View>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!isValid || isLoading}
                className={`bg-button rounded-xl py-4 items-center shadow-lg ${
                  (!isValid || isLoading) && "opacity-60"
                }`}
                style={{
                  elevation: 4,
                  shadowColor: "#10b981",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                }}
              >
                {isLoading ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator color="#fff" size="small" />
                    <Text className="text-white font-bold text-lg ml-2">
                      Verifying...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white font-bold text-lg">Continue</Text>
                )}
              </TouchableOpacity>

              {/* Additional Info */}
              <View className="mt-6 pt-6 border-t border-gray-300">
                <Text className="text-gray-500 text-center text-sm">
                  Need help? Contact your local agriculture office
                </Text>
              </View>
            </View>

            {/* Bottom spacing for keyboard */}
            <View className="h-8" />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
