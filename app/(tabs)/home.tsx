import Carousel from "@/components/home/Carousel";
import Scan from "@/components/home/Scan";
import Activity from "@/components/home/Activity";
import Classified from "@/components/output/Classified";
import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useClassificationHistory, ClassificationHistoryItem } from "@/hooks/useClassificationHistory";
import { useUserInfo } from "@/hooks/useUserInfo";

interface ClassificationData {
  prediction: string;
  confidence: number;
  imageUri: string;
  timestamp: string;
  id?: string;
}

export default function HomePage() {
  const insets = useSafeAreaInsets();
  const [showClassified, setShowClassified] = useState(false);
  const [classificationData, setClassificationData] =
    useState<ClassificationData | null>(null);
  const [isRetakeLoading, setIsRetakeLoading] = useState(false);

  // Get user info and history hook
  const { userInfo } = useUserInfo();
  const { addToHistory } = useClassificationHistory(userInfo?.rsbsaNumber);

  // Reset the view when the home tab is focused (clicked)
  useFocusEffect(
    React.useCallback(() => {
      setShowClassified(false);
      setClassificationData(null);
    }, [])
  );

  const handleClassificationComplete = async (data: ClassificationData) => {
    setClassificationData(data);
    setShowClassified(true);
    
    // Save to history if user is logged in
    if (userInfo?.rsbsaNumber) {
      await addToHistory({
        prediction: data.prediction,
        confidence: data.confidence,
        imageUri: data.imageUri,
        timestamp: data.timestamp,
        rsbsaNumber: userInfo.rsbsaNumber,
        serverResponse: data, // Store full response for reference
      });
    }
  };

  const handleBack = () => {
    setShowClassified(false);
    setClassificationData(null);
  };

  const handleHistoryItemClick = (item: ClassificationHistoryItem) => {
    // Convert history item to ClassificationData format
    const classificationData: ClassificationData = {
      prediction: item.prediction,
      confidence: item.confidence,
      imageUri: item.imageUri,
      timestamp: item.timestamp,
      id: item.id,
    };
    
    setClassificationData(classificationData);
    setShowClassified(true);
  };

  const openCameraForRetake = async (): Promise<void> => {
    try {
      setIsRetakeLoading(true);

      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Camera access is needed to scan pests."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        const uri = image.uri;
        const fileType = uri.split(".").pop()?.toLowerCase() || "jpg";

        const mimeType = fileType === "png" ? "image/png" : "image/jpeg";

        const formData = new FormData();
        formData.append("file", {
          uri,
          type: mimeType,
          name: `pest_image.${fileType}`,
        } as any);

        // Add RSBSA number if user is logged in
        if (userInfo?.rsbsaNumber) {
          formData.append("rsbsaNumber", userInfo.rsbsaNumber);
        }

        console.log("Uploading retaken image to server...");

        // Add timeout to the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch(`${process.env.EXPO_PUBLIC_FLASK_URL}/predict`, {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Server responded with ${response.status}: ${errorText}`
          );
        }

        const data = await response.json();
        console.log("Retake prediction response:", data);

        // Validate response structure
        if (
          typeof data.prediction === "string" &&
          typeof data.confidence === "number"
        ) {
          // Prepare new classification data
          const newClassificationData: ClassificationData = {
            prediction: data.prediction,
            confidence: data.confidence,
            imageUri: uri,
            timestamp: new Date().toISOString(),
            id: data.id || `retake_${Date.now()}`,
          };

          // Update the classification data to show new results
          setClassificationData(newClassificationData);
          
          // Save retake to history if user is logged in
          if (userInfo?.rsbsaNumber) {
            await addToHistory({
              prediction: newClassificationData.prediction,
              confidence: newClassificationData.confidence,
              imageUri: newClassificationData.imageUri,
              timestamp: newClassificationData.timestamp,
              rsbsaNumber: userInfo.rsbsaNumber,
              serverResponse: data,
            });
          }
        } else {
          throw new Error("Invalid response format from server");
        }
      }
    } catch (error: any) {
      console.error("Retake image classification failed:", error);

      let errorMessage = "Failed to classify retaken image. ";

      if (error.name === "AbortError") {
        errorMessage =
          "Request timed out. Please check your connection and try again.";
      } else if (
        error.message?.includes("Network request failed") ||
        error.message?.includes("fetch")
      ) {
        errorMessage =
          "Cannot connect to the classification server. Please check your network connection.";
      } else if (error.message?.includes("Server responded")) {
        errorMessage = `Server error: ${error.message}`;
      } else {
        errorMessage += error.message || "Unknown error occurred.";
      }

      Alert.alert("❌ Retake Classification Failed", errorMessage);
    } finally {
      setIsRetakeLoading(false);
    }
  };

  const handleRetake = () => {
    openCameraForRetake();
  };

  const handleShare = async () => {
    if (classificationData) {
      // Implement share functionality
      console.log("Sharing classification result:", classificationData);
      // You can use expo-sharing or react-native-share here
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background px-4"
      contentContainerStyle={{
        paddingBottom: 110,
      }}
    >
      <View className="flex-col gap-4 mt-6">
        {!showClassified ? (
          <>
            <Carousel />
            <Scan onClassificationComplete={handleClassificationComplete} />
            <Activity onItemClick={handleHistoryItemClick} />
          </>
        ) : (
          classificationData && (
            <Classified
              data={classificationData}
              onBack={handleBack}
              onRetake={handleRetake}
              onShare={handleShare}
              isRetakeLoading={isRetakeLoading}
            />
          )
        )}
      </View>
    </ScrollView>
  );
}
