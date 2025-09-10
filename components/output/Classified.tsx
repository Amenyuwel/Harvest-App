import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowLeft,
  MapPin,
} from "lucide-react-native";

interface ClassificationData {
  prediction: string;
  confidence: number;
  imageUri: string;
  timestamp?: string;
  id?: string;
  location_info?: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  };
}

interface ClassifiedProps {
  data: ClassificationData;
  onBack?: () => void;
  onSave?: () => void;
}

const Classified: React.FC<ClassifiedProps> = ({ data, onBack, onSave }) => {
  const screenWidth = Dimensions.get("window").width;
  const imageSize = screenWidth * 0.6;

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
        "A destructive caterpillar that feeds on crops, especially maize and sorghum. Monitor closely and consider treatment options.",
      snail:
        "Mollusks that can damage crops by feeding on leaves and stems. Control measures may include baits or barriers.",
      stem_borer:
        "Insect larvae that bore into plant stems, causing damage to crops. Early detection is crucial for effective management.",
      unknown:
        "Pest type could not be determined with confidence. Consider consulting an agricultural expert for proper identification.",
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

  const getConfidenceIcon = (confidence: number) => {
    const color = getConfidenceColor(confidence);
    if (confidence >= 0.8) return <CheckCircle size={24} color={color} />;
    if (confidence >= 0.6) return <AlertCircle size={24} color={color} />;
    return <XCircle size={24} color={color} />;
  };

  const getConfidenceLabel = (confidence: number): string => {
    if (confidence >= 0.8) return "High Confidence";
    if (confidence >= 0.6) return "Medium Confidence";
    return "Low Confidence";
  };

  const confidencePercent = (data.confidence * 100).toFixed(1);
  const pestName = formatPestName(data.prediction);
  const description = getPestDescription(data.prediction);

  return (
    <View className="bg-white flex-1 rounded-2xl">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <TouchableOpacity
          onPress={onBack}
          className="p-2 rounded-full bg-gray-100"
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-main">
          CLASSIFICATION RESULT
        </Text>
        <View className="w-10" />
      </View>

      {/* Content */}
      <View className="flex-1 p-6">
        {/* Pest name + confidence (main focus) */}
        <View className="items-center mb-4">
          <Text className="text-4xl font-bold text-gray-800 text-center">
            {pestName.toUpperCase()}
          </Text>
        </View>

        {/* Location (with MapPin, if available) */}
        {data.location_info?.city && data.location_info?.country && (
          <View className="flex-row items-center justify-center mb-4">
            <MapPin size={18} color="#ef4444" />
            <Text className="text-lg text-gray-600 ml-2">
              {data.location_info.city}, {data.location_info.country}
            </Text>
          </View>
        )}

        {/* Timestamp */}
        {data.timestamp && (
          <Text className="text-sm text-gray-500 text-center mb-6">
            {new Date(data.timestamp).toLocaleString()}
          </Text>
        )}

        {/* Image preview */}
        <View className="items-center mb-6">
          <View
            className="rounded-2xl overflow-hidden border-2 border-gray-200 shadow-md"
            style={{ width: imageSize, height: imageSize }}
          >
            <Image
              source={{ uri: data.imageUri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Confidence bar */}
        <View className="mb-6">
          {/* Title */}
          <Text className="text-xl font-medium text-gray-700 mb-2 text-center">
            Confidence Level
          </Text>

          {/* Icon + % */}
          <View className="flex-row items-center justify-center gap-2 mb-2">
            {getConfidenceIcon(data.confidence)}
            <Text
              className="text-xl font-semibold"
              style={{ color: getConfidenceColor(data.confidence) }}
            >
              {confidencePercent}%
            </Text>
          </View>

          {/* Bar (full width) */}
          <View className="bg-gray-200 h-4 rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: `${data.confidence * 100}%`,
                backgroundColor: getConfidenceColor(data.confidence),
              }}
            />
          </View>

          {/* Confidence Label */}
          <Text
            className="text-sm font-medium mt-1 text-center"
            style={{ color: getConfidenceColor(data.confidence) }}
          >
            {getConfidenceLabel(data.confidence)}
          </Text>
        </View>

        {/* Description card */}
        <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            About this pest:
          </Text>
          <Text className="text-gray-600 leading-5">{description}</Text>
        </View>
      </View>

      {/* Actions */}
      <View className="p-6">
        <View className="flex-row gap-3">
          {/* Primary action (Save) */}
          <TouchableOpacity
            className="flex-1 rounded-xl py-4 bg-green"
            onPress={onSave}
            activeOpacity={0.8}
          >
            <Text className="text-main font-semibold text-center text-lg">
              Save
            </Text>
          </TouchableOpacity>

          {/* Secondary action (Back) */}
          <TouchableOpacity
            className="flex-1 rounded-xl py-4 bg-gray-200"
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Text className="text-gray-700 font-semibold text-center text-lg">
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer - Scan ID (metadata) */}
      {data.id && (
        <View className="px-6 p-4 border-t border-gray-200">
          <Text className="text-xs text-gray-400 text-center">
            Scan ID: {data.id}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Classified;
