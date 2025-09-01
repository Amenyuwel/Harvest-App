import React from "react";
import { View, ScrollView, Text } from "react-native";
import { useRegister } from "../../hooks/useRegister";
import RegisterForm from "../../components/register/RegisterForm";
export default function RegisterScreen() {
  const registerProps = useRegister();

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <View className="max-w-2xl w-full self-center">
        {/* Form */}
        <RegisterForm
          {...registerProps}
          showSuccessDialog={registerProps.showRegisterSuccess}
          handleSuccessDialogClose={registerProps.handleRegisterSuccessClose}
        />

        {/* Info Card */}
        <View className="mt-4 mb-14 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <Text className="text-sm font-heading text-blue-800 mb-2">
            Registration Information
          </Text>
          <Text className="text-xs text-blue-700 mb-2">
            Your farmer ID follows the format: 126303-[Barangay ID]-[Your RSBSA]
          </Text>
          <Text className="text-xs text-blue-700">
            After registration, you can log in using your generated Farmer ID
            and your chosen password.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
