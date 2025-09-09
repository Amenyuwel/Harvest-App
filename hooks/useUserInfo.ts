import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserInfo {
  rsbsaNumber: string;
  token: string;
}

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserInfo = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const rsbsaNumber = await AsyncStorage.getItem("userRSBSA");

      if (token && rsbsaNumber) {
        setUserInfo({ token, rsbsaNumber });
      } else {
        setUserInfo(null);
      }
    } catch (error) {
      console.error("Failed to load user info:", error);
      setUserInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearUserInfo = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userRSBSA");
      setUserInfo(null);
    } catch (error) {
      console.error("Failed to clear user info:", error);
    }
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

  return {
    userInfo,
    isLoading,
    refreshUserInfo: loadUserInfo,
    clearUserInfo,
    isLoggedIn: !!userInfo,
    rsbsaNumber: userInfo?.rsbsaNumber,
  };
};
