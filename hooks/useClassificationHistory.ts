import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ClassificationHistoryItem {
  id: string;
  prediction: string;
  confidence: number;
  imageUri: string;
  timestamp: string;
  rsbsaNumber: string;
  serverResponse?: any; // Store full server response if needed
}

const HISTORY_STORAGE_KEY = "classification_history";
const MAX_HISTORY_ITEMS = 100; // Limit to prevent storage overflow

export const useClassificationHistory = (rsbsaNumber?: string) => {
  const [history, setHistory] = useState<ClassificationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load history from storage
  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        const parsedHistory: ClassificationHistoryItem[] =
          JSON.parse(storedHistory);
        // Filter by RSBSA number if provided
        const filteredHistory = rsbsaNumber
          ? parsedHistory.filter((item) => item.rsbsaNumber === rsbsaNumber)
          : parsedHistory;
        setHistory(
          filteredHistory.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
        );
      }
    } catch (error) {
      console.error("Failed to load classification history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save new classification to history
  const addToHistory = async (
    classification: Omit<ClassificationHistoryItem, "id">
  ) => {
    try {
      // Get current full history from storage
      const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      let fullHistory: ClassificationHistoryItem[] = storedHistory
        ? JSON.parse(storedHistory)
        : [];

      // Create new history item
      const newItem: ClassificationHistoryItem = {
        ...classification,
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        rsbsaNumber: rsbsaNumber || classification.rsbsaNumber || "anonymous",
      };

      // Add to beginning of array (most recent first)
      fullHistory.unshift(newItem);

      // Limit history size
      if (fullHistory.length > MAX_HISTORY_ITEMS) {
        fullHistory = fullHistory.slice(0, MAX_HISTORY_ITEMS);
      }

      // Save back to storage
      await AsyncStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(fullHistory)
      );

      // Update local state with filtered history
      const filteredHistory = rsbsaNumber
        ? fullHistory.filter((item) => item.rsbsaNumber === rsbsaNumber)
        : fullHistory;
      setHistory(filteredHistory);

      return newItem.id;
    } catch (error) {
      console.error("Failed to save classification to history:", error);
      return null;
    }
  };

  // Remove item from history
  const removeFromHistory = async (
    itemId: string,
    deleteFromServer: boolean = false
  ) => {
    try {
      const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        let fullHistory: ClassificationHistoryItem[] =
          JSON.parse(storedHistory);

        // Find the item to get server ID if needed
        const itemToDelete = fullHistory.find((item) => item.id === itemId);

        // Remove from local storage
        fullHistory = fullHistory.filter((item) => item.id !== itemId);
        await AsyncStorage.setItem(
          HISTORY_STORAGE_KEY,
          JSON.stringify(fullHistory)
        );

        // Update local state
        const filteredHistory = rsbsaNumber
          ? fullHistory.filter((item) => item.rsbsaNumber === rsbsaNumber)
          : fullHistory;
        setHistory(
          filteredHistory.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
        );

        // Optional: Delete from server if server ID exists
        if (deleteFromServer && itemToDelete?.serverResponse?.id) {
          try {
            // Delete from your Flask backend
            const response = await fetch(
              `${process.env.EXPO_PUBLIC_FLASK_URL}/api/classification/${itemToDelete.serverResponse.id}`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.ok) {
              console.log(
                `Successfully deleted classification ${itemToDelete.serverResponse.id} from server`
              );
            } else {
              console.warn(`Failed to delete from server: ${response.status}`);
            }
          } catch (serverError) {
            console.warn("Failed to delete from server:", serverError);
            // Don't throw error - local deletion was successful
          }
        }
      }
    } catch (error) {
      console.error("Failed to remove item from history:", error);
      throw error; // Re-throw to handle in UI
    }
  };

  // Clear all history for current user
  const clearHistory = async (deleteFromServer: boolean = false) => {
    try {
      console.log(
        "clearHistory called with rsbsaNumber:",
        rsbsaNumber,
        "deleteFromServer:",
        deleteFromServer
      );

      if (rsbsaNumber) {
        // If RSBSA provided, only clear items for this user
        const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
        console.log("Current stored history:", storedHistory);

        if (storedHistory) {
          let fullHistory: ClassificationHistoryItem[] =
            JSON.parse(storedHistory);
          console.log(
            "Full history before filter:",
            fullHistory.length,
            "items"
          );

          // Get items that belong to current user (for potential server deletion)
          const userItems = fullHistory.filter(
            (item) => item.rsbsaNumber === rsbsaNumber
          );
          console.log("User items to be cleared:", userItems.length);

          // Keep items that don't belong to current user
          const itemsToKeep = fullHistory.filter(
            (item) => item.rsbsaNumber !== rsbsaNumber
          );
          console.log(
            "Items to keep after filter:",
            itemsToKeep.length,
            "items"
          );

          await AsyncStorage.setItem(
            HISTORY_STORAGE_KEY,
            JSON.stringify(itemsToKeep)
          );
          console.log("Updated AsyncStorage with filtered history");

          // Optional: Delete from server
          if (deleteFromServer && userItems.length > 0) {
            console.log("Attempting to delete user items from server...");
            for (const item of userItems) {
              if (item.serverResponse?.id) {
                try {
                  const response = await fetch(
                    `${process.env.EXPO_PUBLIC_FLASK_URL}/api/classification/${item.serverResponse.id}`,
                    {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  );

                  if (response.ok) {
                    console.log(
                      `Successfully deleted classification ${item.serverResponse.id} from server`
                    );
                  } else {
                    console.warn(
                      `Failed to delete ${item.serverResponse.id} from server: ${response.status}`
                    );
                  }
                } catch (serverError) {
                  console.warn(
                    `Failed to delete ${item.serverResponse.id} from server:`,
                    serverError
                  );
                }
              }
            }
          }
        }
      } else {
        // Clear all history
        console.log("Clearing all history (no RSBSA specified)");
        await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
      }

      console.log("Setting local history state to empty array");
      setHistory([]);
      console.log("History cleared successfully");
    } catch (error) {
      console.error("Failed to clear history:", error);
      throw error; // Re-throw to handle in UI
    }
  };

  // Get stats for current user
  const getStats = () => {
    const total = history.length;
    const pestCounts: Record<string, number> = {};

    history.forEach((item) => {
      pestCounts[item.prediction] = (pestCounts[item.prediction] || 0) + 1;
    });

    const mostCommonPest = Object.entries(pestCounts).reduce(
      (a, b) => (pestCounts[a[0]] > pestCounts[b[0]] ? a : b),
      ["none", 0]
    );

    // Calculate average confidence
    const avgConfidence =
      total > 0
        ? history.reduce((sum, item) => sum + item.confidence, 0) / total
        : 0;

    return {
      total,
      pestCounts,
      mostCommonPest: mostCommonPest[0] !== "none" ? mostCommonPest[0] : null,
      averageConfidence: avgConfidence,
    };
  };

  useEffect(() => {
    loadHistory();
  }, [rsbsaNumber]);

  return {
    history,
    isLoading,
    addToHistory,
    removeFromHistory,
    clearHistory,
    refreshHistory: loadHistory,
    getStats,
  };
};
