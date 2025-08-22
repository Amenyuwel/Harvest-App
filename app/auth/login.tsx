import React, { useEffect } from "react";
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
import { LogIn, ArrowLeft, Eye, EyeOff, User, Lock } from "lucide-react-native";
import { useLogin } from "../../hooks/useLogin";

export default function LoginPage() {
  const {
    rsbsa,
    setRsbsa,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isLoading,
    handleLogin,
    handleBack,
    rsbsaParam,
  } = useLogin();

  useEffect(() => {
    if (rsbsaParam) {
      setRsbsa(rsbsaParam.toString());
    }
  }, [rsbsaParam]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center items-center p-4">
          <View className="w-full max-w-md">
            <View className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
              {/* Back Button */}
              <TouchableOpacity
                onPress={handleBack}
                className="flex-row items-center mb-6"
              >
                <ArrowLeft color="#6B7280" size={16} />
                <Text className="text-sm text-gray-600 ml-2">
                  Back to RSBSA Entry
                </Text>
              </TouchableOpacity>

              {/* Header */}
              <View className="items-center mb-8">
                <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
                  <LogIn color="#059669" size={32} />
                </View>
                <Text className="text-2xl font-bold text-gray-800 mb-2">
                  Welcome Back
                </Text>
                <Text className="text-gray-600 text-center">
                  Sign in to access your RSBSA account
                </Text>
              </View>

              {/* Login Form */}
              <View className="space-y-6">
                {/* RSBSA Field */}
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    RSBSA Code
                  </Text>
                  <View className="relative">
                    <TextInput
                      value={rsbsa}
                      onChangeText={setRsbsa}
                      placeholder="Enter your full RSBSA (e.g. 126303-007-00001)"
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
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Password
                  </Text>
                  <View className="relative">
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      onSubmitEditing={handleLogin}
                      placeholder="Enter your password"
                      secureTextEntry={!showPassword}
                      className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg bg-white"
                    />
                    <View className="absolute left-3 top-3">
                      <Lock color="#9CA3AF" size={20} />
                    </View>
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3"
                    >
                      {showPassword ? (
                        <EyeOff color="#9CA3AF" size={20} />
                      ) : (
                        <Eye color="#9CA3AF" size={20} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={isLoading || !rsbsa || !password}
                  className={`w-full py-3 px-4 rounded-lg font-medium flex-row items-center justify-center ${
                    isLoading || !rsbsa || !password
                      ? "bg-gray-400"
                      : "bg-green-600 active:bg-green-700"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <ActivityIndicator color="white" className="mr-2" />
                      <Text className="text-white font-medium">
                        Signing In...
                      </Text>
                    </>
                  ) : (
                    <>
                      <LogIn color="white" size={16} className="mr-2" />
                      <Text className="text-white font-medium">Sign In</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Help Card */}
            <View className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <Text className="text-sm font-medium text-amber-800 mb-2">
                Need Help?
              </Text>
              <Text className="text-xs text-amber-700 mb-2">
                If this is your first time logging in, your default password is
                your complete RSBSA number.
              </Text>
              <Text className="text-xs text-amber-700">
                For assistance, contact your local agricultural office.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
