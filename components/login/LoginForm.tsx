import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { User, Lock, LogIn } from "lucide-react-native";

interface LoginFormProps {
  rsbsa: string;
  setRsbsa: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  isLoading: boolean;
  handleLogin: () => void;
  handleBack: () => void; // <-- Add this line
  rsbsaParam?: string | number;
}

export default function LoginForm({
  rsbsa,
  setRsbsa,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  isLoading,
  handleLogin,
  handleBack, // <-- Add this line
  rsbsaParam,
}: LoginFormProps) {
  return (
    <View className="space-y-4">
      {/* RSBSA Field */}
      <View>
        <Text className="text-sm font-heading text-gray-700 mb-2">
          RSBSA Code
        </Text>
        <View className="relative">
          <TextInput
            value={rsbsa}
            onChangeText={setRsbsa}
            placeholder="Enter your full RSBSA (e.g. 126303-007-00001)"
            placeholderTextColor="#9ca3af"
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg font-mono tracking-wider bg-white"
            maxLength={17}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!rsbsaParam}
          />
          <View className="absolute left-3 top-3">
            <User color="#9CA3AF" size={20} />
          </View>
        </View>
      </View>

      {/* Password Field */}
      <View>
        <Text className="text-sm font-body font-bold mt-4 text-gray-700 mb-2">
          Password
        </Text>
        <View className="relative">
          <TextInput
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleLogin}
            placeholder="Enter your password"
            placeholderTextColor="#9ca3af"
            secureTextEntry={!showPassword}
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg bg-white"
          />
          <View className="absolute left-3 top-3">
            <Lock color="#9CA3AF" size={20} />
          </View>
        </View>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={isLoading || !rsbsa || !password}
        className={`w-full p-4 rounded-lg mt-4 font-medium flex-row items-center justify-center ${
          isLoading || !rsbsa || !password
            ? "bg-button | opacity-60"
            : "bg-button active:bg-button"
        }`}
      >
        {isLoading ? (
          <>
            <ActivityIndicator color="white" className="mr-2" />
            <Text className="text-white font-medium">Signing In...</Text>
          </>
        ) : (
          <>
            <LogIn color="white" size={16} style={{ marginRight: 8 }} />
            <Text className="text-white font-medium">Sign In</Text>
          </>
        )}
      </TouchableOpacity>
      {/* Back Button */}
      <TouchableOpacity
        onPress={handleBack}
        className="flex-row items-center mt-4 justify-center p-4 rounded-lg bg-back"
      >
        <Text className="text-sm text-white ml-2">Back to RSBSA Entry</Text>
      </TouchableOpacity>
    </View>
  );
}
