import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import React from "react";
import {
  useClassificationHistory,
  ClassificationHistoryItem,
} from "@/hooks/useClassificationHistory";
import { useUserInfo } from "@/hooks/useUserInfo";
import { History, Clock, Trash2, Calendar, User } from "lucide-react-native";

interface ActivityProps {
  onItemClick?: (item: ClassificationHistoryItem) => void;
}

const Activity: React.FC<ActivityProps> = ({ onItemClick }) => {
  const { userInfo, isLoading: isUserLoading } = useUserInfo();
  const { history, isLoading, removeFromHistory, clearHistory } =
    useClassificationHistory(userInfo?.rsbsaNumber);

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

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return "#22c55e"; // Green
    if (confidence >= 0.6) return "#f59e0b"; // Orange
    return "#ef4444"; // Red
  };

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    Alert.alert(
      "Delete Classification",
      "Are you sure you want to remove this classification from your history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Delete from both local storage and server
              await removeFromHistory(itemId, true);
              console.log(
                `Deleted classification ${itemId} from local storage and server`
              );
            } catch (error) {
              console.error("Failed to delete classification:", error);
              Alert.alert(
                "Error",
                "Failed to delete classification. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All History",
      "Are you sure you want to clear all your classification history? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("Starting to clear history...");
              await clearHistory(true); // Also delete from server
              console.log("History cleared successfully");
            } catch (error) {
              console.error("Failed to clear history:", error);
              Alert.alert(
                "Error",
                "Failed to clear history. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const renderHistoryItem = (item: ClassificationHistoryItem) => (
    <TouchableOpacity
      key={item.id}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
      onPress={() => onItemClick?.(item)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start gap-3">
        {/* Image Preview */}
        <View className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
          <Image
            source={{ uri: item.imageUri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-lg font-semibold text-gray-800">
              {formatPestName(item.prediction)}
            </Text>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation(); // Prevent triggering the item click
                handleDeleteItem(item.id);
              }}
              className="p-1"
            >
              <Trash2 size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center gap-2 mb-2">
            <Text
              className="text-sm font-medium"
              style={{ color: getConfidenceColor(item.confidence) }}
            >
              {(item.confidence * 100).toFixed(1)}% confidence
            </Text>
          </View>

          <View className="flex-row items-center gap-1">
            <Clock size={12} color="#6b7280" />
            <Text className="text-xs text-gray-500">
              {formatDate(item.timestamp)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isUserLoading || isLoading) {
    return (
      <View className="bg-card w-full h-[300px] rounded-3xl items-center justify-center">
        <ActivityIndicator size="large" color="#B6EC80" />
        <Text className="text-gray-500 mt-2">Loading history...</Text>
      </View>
    );
  }

  // Show login prompt if user is not logged in
  if (!userInfo) {
    return (
      <View className="bg-card w-full h-[300px] rounded-3xl p-4 items-center justify-center">
        <User size={48} color="#d1d5db" />
        <Text className="text-gray-600 text-center mt-3 font-semibold">
          Please log in to view your classification history
        </Text>
        <Text className="text-gray-400 text-sm text-center mt-1">
          Your scan history will be saved to your RSBSA account
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-card w-full rounded-3xl p-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-3">
          <History size={24} color="#B6EC80" />
          <View>
            <Text className="text-main font-heading text-xl font-semibold">
              Classification History
            </Text>
            <Text className="text-gray-500 text-xs">
              RSBSA: {userInfo.rsbsaNumber}
            </Text>
          </View>
        </View>

        {history.length > 0 && (
          <TouchableOpacity
            onPress={handleClearAll}
            className="px-3 py-1 bg-red-50 rounded-lg"
          >
            <Text className="text-red-600 text-sm font-medium">Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <View className="h-[200px]">
        {history.length > 0 ? (
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {history.map(renderHistoryItem)}
          </ScrollView>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Calendar size={48} color="#d1d5db" />
            <Text className="text-gray-500 text-center mt-3">
              No classifications yet
            </Text>
            <Text className="text-gray-400 text-sm text-center mt-1">
              Start scanning pests to build your history
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Activity;
