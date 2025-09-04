import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Leaf } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

const Scan = () => {
  const openCamera = async () => {
    // Ask for camera permission
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Camera access is needed to scan.");
      return;
    }

    // Launch camera
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      console.log("Image captured:", imageUri);

      // Here you can send imageUri to your Flask server
    }
  };

  return (
    <View className="bg-card w-full rounded-3xl p-4">
      {/* Icon and Text */}
      <View className="flex-row items-center px-2 gap-4 border-1 border-black">
        <Leaf size={32} color="#B6EC80" />
        <View className="flex-1">
          <Text className="text-main font-heading text-xl font-semibold">
            Classify pests with HarvestAI
          </Text>
          <Text className="text-gray-500 text-sm font-description">
            Lorem ipsum lorem Lorem ipsum lorem Lorem ipsum
          </Text>
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity
        className="mt-4 rounded-2xl py-3 items-center bg-green"
        onPress={openCamera}
      >
        <Text className="text-green-600 font-semibold">Scan Now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Scan;
