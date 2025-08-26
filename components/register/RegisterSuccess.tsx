import React from "react";
import { View, Text, TouchableOpacity, Modal, Dimensions } from "react-native";
import { CheckCircle, X } from "lucide-react-native";

interface RegisterSuccessProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  farmerId?: string;
  buttonText?: string;
}

const { width: screenWidth } = Dimensions.get("window");

export default function RegisterSuccess({
  visible,
  onClose,
  title,
  message,
  farmerId,
  buttonText = "Continue to Login",
}: RegisterSuccessProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        {/* Dialog Container */}
        <View
          className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-lg"
          style={{ maxWidth: screenWidth * 0.9 }}
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-4 p-1"
          >
            <X size={20} color="#6b7280" />
          </TouchableOpacity>

          {/* Success Icon */}
          <View className="items-center mb-6 mt-2">
            <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
              <CheckCircle size={32} color="#16a34a" />
            </View>
            <Text className="text-xl font-heading font-bold text-gray-800 text-center mb-2">
              {title}
            </Text>
            <Text className="text-gray-600 font-body text-center leading-5">
              {message}
            </Text>
          </View>

          {/* Farmer ID Display */}
          {farmerId && (
            <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <Text className="text-sm font-body font-bold text-green-800 mb-2 text-center">
                Your Farmer ID
              </Text>
              <View className="bg-white px-4 py-3 rounded-lg border border-green-300">
                <Text className="font-mono text-lg text-center text-green-700 font-semibold tracking-wider">
                  {farmerId}
                </Text>
              </View>
              <Text className="text-xs text-green-600 mt-2 text-center">
                Please save this ID for future reference
              </Text>
            </View>
          )}

          {/* Continue Button */}
          <TouchableOpacity
            onPress={onClose}
            className="bg-green-500 py-4 px-6 rounded-lg items-center"
          >
            <Text className="text-white font-heading font-bold text-base">
              {buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
