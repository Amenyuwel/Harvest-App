import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LogIn } from "lucide-react-native";
import { useLogin } from "../../hooks/useLogin";
import LoginForm from "../../components/login/LoginForm";

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
        <View className="flex-1 justify-center items-center p-4 bg-background">
          <View className="w-full max-w-md">
            <View className="bg-card rounded-2xl p-8 shadow-xl">
              {/* Header */}
              <View className="items-center mb-8 bg-card">
                <View className="w-16 h-16 bg-card rounded-full items-center justify-center mb-4">
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
              <LoginForm
                rsbsa={rsbsa}
                setRsbsa={setRsbsa}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                isLoading={isLoading}
                handleLogin={handleLogin}
                handleBack={handleBack}
                rsbsaParam={
                  Array.isArray(rsbsaParam) ? rsbsaParam[0] : rsbsaParam
                }
              />
            </View>

            {/* Help Card */}
            <View className="mt-4 mb-14 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Text className="text-sm font-medium text-blue-700 mb-2">
                Need Help?
              </Text>
              <Text className="text-xs text-blue-700">
                For assistance, contact your local agricultural office.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
