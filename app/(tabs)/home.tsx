import Carousel from "@/components/home/Carousel";
import Scan from "@/components/home/Scan";
import Activity from "@/components/home/Activity";
import Classified from "@/components/output/Classified";
import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useClassificationHistory, ClassificationHistoryItem } from "@/hooks/useClassificationHistory";
import { useUserInfo } from "@/hooks/useUserInfo";

interface ClassificationData {
  prediction: string;
  confidence: number;
  imageUri: string;
  timestamp: string;
  id?: string;
  location_info?: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  };
}

export default function HomePage() {
  const [showClassified, setShowClassified] = useState(false);
  const [classificationData, setClassificationData] =
    useState<ClassificationData | null>(null);

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
    // Debug: Log the data to see if location_info exists
    console.log("🔍 Classification data received:", data);
    console.log("🗺️ Location info:", data.location_info);
    
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
    // Debug: Log history item data
    console.log("🔍 History item clicked:", item);
    console.log("🗺️ Server response:", item.serverResponse);
    console.log("🗺️ Location from server response:", item.serverResponse?.location_info);
    
    // Convert history item to ClassificationData format
    const classificationData: ClassificationData = {
      prediction: item.prediction,
      confidence: item.confidence,
      imageUri: item.imageUri,
      timestamp: item.timestamp,
      id: item.id,
      location_info: item.serverResponse?.location_info || undefined,
    };
    
    console.log("🔍 Final classification data for Classified component:", classificationData);
    
    setClassificationData(classificationData);
    setShowClassified(true);
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
            />
          )
        )}
      </View>
    </ScrollView>
  );
}
