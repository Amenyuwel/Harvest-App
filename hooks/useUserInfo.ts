import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserInfo {
  rsbsaNumber: string;
  fullName: string;  // Changed from fullname to fullName
  barangay: string;
  primaryCrop: string;
  farmArea: number;
  contactNumber: string;
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
      const fullName = await AsyncStorage.getItem("userFullName");
      const barangay = await AsyncStorage.getItem("userBarangay");
      const primaryCrop = await AsyncStorage.getItem("userPrimaryCrop");
      const farmArea = await AsyncStorage.getItem("userFarmArea");
      const contactNumber = await AsyncStorage.getItem("userContactNumber");

      if (token && rsbsaNumber) {
        setUserInfo({ 
          token, 
          rsbsaNumber,
          fullName: fullName || "",
          barangay: barangay || "",
          primaryCrop: primaryCrop || "",
          farmArea: farmArea ? parseFloat(farmArea) : 0,
          contactNumber: contactNumber || "",
        });
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
      await AsyncStorage.removeItem("userFullName");
      await AsyncStorage.removeItem("userBarangay");
      await AsyncStorage.removeItem("userPrimaryCrop");
      await AsyncStorage.removeItem("userFarmArea");
      await AsyncStorage.removeItem("userContactNumber");
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
