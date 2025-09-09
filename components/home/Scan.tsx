import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Leaf } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useUserInfo } from "@/hooks/useUserInfo";

interface PredictionResult {
  prediction: string;
  confidence: number;
  id?: string;
}

interface ClassificationData {
  prediction: string;
  confidence: number;
  imageUri: string;
  timestamp: string;
  id?: string;
}

interface ScanProps {
  onClassificationComplete?: (data: ClassificationData) => void;
}

const Scan: React.FC<ScanProps> = ({ onClassificationComplete }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<PredictionResult | null>(null);
  const { userInfo } = useUserInfo();

  const formatPestName = (prediction: string): string => {
    const pestNames: Record<string, string> = {
      fall_armyworm: "Fall Armyworm",
      snail: "Snail",
      stem_borer: "Stem Borer",
      unknown: "Unknown Pest",
    };
    return (
      pestNames[prediction] ||
      prediction.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  const getPestDescription = (prediction: string): string => {
    const descriptions: Record<string, string> = {
      fall_armyworm:
        "A destructive caterpillar that feeds on crops, especially maize and sorghum.",
      snail: "Mollusks that can damage crops by feeding on leaves and stems.",
      stem_borer:
        "Insect larvae that bore into plant stems, causing damage to crops.",
      unknown:
        "Pest type could not be determined. Consider consulting an agricultural expert.",
    };
    return (
      descriptions[prediction] || "No description available for this pest type."
    );
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return "#22c55e"; // Green - High confidence
    if (confidence >= 0.6) return "#f59e0b"; // Orange - Medium confidence
    return "#ef4444"; // Red - Low confidence
  };

  const openCamera = async (): Promise<void> => {
    try {
      setIsLoading(true);

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

        console.log("Uploading image to server...");

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
        console.log("Prediction response:", data);

        // Validate response structure
        if (
          typeof data.prediction === "string" &&
          typeof data.confidence === "number"
        ) {
          // Store the result for display
          const resultData: PredictionResult = {
            prediction: data.prediction,
            confidence: data.confidence,
            id: data.id || `scan_${Date.now()}`,
          };
          setLastResult(resultData);

          // Prepare classification data for the Classified component
          const classificationData: ClassificationData = {
            prediction: data.prediction,
            confidence: data.confidence,
            imageUri: uri,
            timestamp: new Date().toISOString(),
            id: data.id || `scan_${Date.now()}`,
          };

          // Call the callback to navigate to Classified component
          if (onClassificationComplete) {
            onClassificationComplete(classificationData);
          } else {
            // Fallback: Show alert if no callback provided
            const pestName = formatPestName(data.prediction);
            const description = getPestDescription(data.prediction);
            const confidencePercent = (data.confidence * 100).toFixed(1);

            Alert.alert(
              `🔍 ${pestName} Detected`,
              `Confidence: ${confidencePercent}%\n\n${description}${data.id ? `\n\nScan ID: ${data.id}` : ""}`,
              [
                {
                  text: "Got it!",
                  style: "default",
                  onPress: () =>
                    console.log("Classification result acknowledged"),
                },
              ]
            );
          }
        } else {
          throw new Error("Invalid response format from server");
        }
      }
    } catch (error: any) {
      console.error("Image classification failed:", error);

      let errorMessage = "Failed to classify image. ";

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

      Alert.alert("❌ Classification Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="bg-card w-full rounded-3xl p-4">
      {/* Icon and Text */}
      <View className="flex-row items-center px-2 gap-4">
        <Leaf size={32} color="#B6EC80" />
        <View className="flex-1">
          <Text className="text-main font-heading text-xl font-semibold">
            Classify pests with HarvestAI
          </Text>
          <Text className="text-gray-500 text-sm font-description">
            Take a photo to classify pests
          </Text>
        </View>
      </View>

      {/* Last Result Display */}
      {lastResult && (
        <View className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <Text className="text-sm font-semibold text-gray-700 mb-1">
            Last Classification:
          </Text>
          <Text
            className="text-lg font-bold mb-1"
            style={{ color: getConfidenceColor(lastResult.confidence) }}
          >
            {formatPestName(lastResult.prediction)}
          </Text>
          <Text className="text-sm text-gray-600">
            Confidence: {(lastResult.confidence * 100).toFixed(1)}%
          </Text>
        </View>
      )}

      {/* Button */}
      <TouchableOpacity
        className={`mt-4 rounded-2xl py-3 items-center ${
          isLoading ? "bg-gray-300" : "bg-green"
        }`}
        onPress={openCamera}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <View className="flex-row items-center gap-2">
            <ActivityIndicator size="small" color="#666" />
            <Text className="text-gray-600 font-semibold">
              Analyzing Image...
            </Text>
          </View>
        ) : (
          <Text className="text-white font-semibold">SCAN</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Scan;
