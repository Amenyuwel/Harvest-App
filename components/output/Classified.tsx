import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Share,
  RotateCcw,
  ArrowLeft,
} from "lucide-react-native";

interface ClassificationData {
  prediction: string;
  confidence: number;
  imageUri: string;
  timestamp?: string;
  id?: string;
}

interface ClassifiedProps {
  data: ClassificationData;
  onBack?: () => void;
  onRetake?: () => void;
  onShare?: () => void;
  isRetakeLoading?: boolean;
}

const Classified: React.FC<ClassifiedProps> = ({
  data,
  onBack,
  onRetake,
  onShare,
  isRetakeLoading = false,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const imageSize = screenWidth * 0.8;

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
    <View className="bg-white w-full rounded-3xl p-6 shadow-lg">
      {/* Back Button */}
      {onBack && (
        <TouchableOpacity
          className="absolute top-4 left-4 z-10 bg-gray-100 rounded-full p-2"
          onPress={onBack}
          activeOpacity={0.8}
        >
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
      )}

      {/* Header */}
      <View className="items-center mb-6">
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          Classification Result
        </Text>
        {data.timestamp && (
          <Text className="text-sm text-gray-500">
            {new Date(data.timestamp).toLocaleString()}
          </Text>
        )}
      </View>

      {/* Image Preview */}
      <View className="items-center mb-6">
        <View
          className="rounded-2xl overflow-hidden border-4 border-gray-200 shadow-md"
          style={{ width: imageSize, height: imageSize }}
        >
          <Image
            source={{ uri: data.imageUri }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Classification Results */}
      <View className="bg-gray-50 rounded-2xl p-5 mb-6">
        {/* Pest Name */}
        <View className="items-center mb-4">
          <Text className="text-3xl font-bold text-gray-800 text-center mb-2">
            {pestName}
          </Text>

          {/* Confidence Level */}
          <View className="flex-row items-center gap-2">
            {getConfidenceIcon(data.confidence)}
            <Text
              className="text-lg font-semibold"
              style={{ color: getConfidenceColor(data.confidence) }}
            >
              {confidencePercent}% • {getConfidenceLabel(data.confidence)}
            </Text>
          </View>
        </View>

        {/* Confidence Bar */}
        <View className="mb-4">
          <View className="bg-gray-200 h-3 rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: `${data.confidence * 100}%`,
                backgroundColor: getConfidenceColor(data.confidence),
              }}
            />
          </View>
        </View>

        {/* Description */}
        <View className="bg-white rounded-xl p-4 border border-gray-200">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            About this pest:
          </Text>
          <Text className="text-gray-600 leading-5">{description}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-3 justify-center items-center">
        <TouchableOpacity
          className={`flex-1 rounded-xl py-3 flex-row items-center justify-center gap-2 ${
            isRetakeLoading ? "bg-gray-300" : "bg-blue-500"
          }`}
          onPress={onRetake}
          disabled={isRetakeLoading}
          activeOpacity={0.8}
        >
          {isRetakeLoading ? (
            <>
              <ActivityIndicator size={20} color="#666" />
              <Text className="text-gray-600 font-semibold">Analyzing...</Text>
            </>
          ) : (
            <>
              <RotateCcw size={20} color="white" />
              <Text className="text-white font-semibold">Retake</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Scan ID */}
      {data.id && (
        <Text className="text-xs text-gray-400 text-center mt-4">
          Scan ID: {data.id}
        </Text>
      )}
    </View>
  );
};

export default Classified;
