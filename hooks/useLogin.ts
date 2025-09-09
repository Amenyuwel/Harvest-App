import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useLogin(debug = false) {
  // --- Form state ---
  const [rsbsa, setRsbsa] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- Status state ---
  const [isLoading, setIsLoading] = useState(false);

  // --- Router & params ---
  const router = useRouter();
  const { rsbsa: rsbsaParam } = useLocalSearchParams();

  // Debug helper
  const log = (...args: any[]) => debug && console.log("[useLogin]", ...args);

  // --- Effects ---
  useEffect(() => {
    log("rsbsaParam:", rsbsaParam);
    if (rsbsaParam) setRsbsa(rsbsaParam.toString());
  }, [rsbsaParam]);

  // --- Handlers ---
  const handleLogin = async () => {
    log("handleLogin called with:", rsbsa, password);

    if (!rsbsa || !password) {
      Alert.alert(
        "Missing Information",
        "Please enter both RSBSA and password"
      );
      log("Validation failed: missing fields");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      log("Sending login to:", apiUrl);

      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rsbsaNumber: rsbsa, password }),
      });

      const data = await response.json();
      log("Login response:", data);

      if (data.success) {
        // Save all user data to AsyncStorage
        await AsyncStorage.setItem("userToken", data.token);
        await AsyncStorage.setItem("userRSBSA", data.user.rsbsaNumber);
        await AsyncStorage.setItem("userFullName", data.user.fullName || "");
        await AsyncStorage.setItem("userBarangay", data.user.barangay || "");
        await AsyncStorage.setItem("userPrimaryCrop", data.user.crop || "");
        await AsyncStorage.setItem("userFarmArea", data.user.area || "0");
        await AsyncStorage.setItem("userContactNumber", data.user.contact || "");
        
        log("User data saved to storage:", data.user);
        router.replace({ pathname: "/(tabs)/home" });
      } else {
        Alert.alert(
          "Login Failed",
          data.message || "Invalid credentials. Please try again."
        );
        log("Login failed:", data.message);
      }
    } catch (err) {
      Alert.alert(
        "Connection Error",
        "Login failed. Please check your connection and try again."
      );
      log("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => router.back();

  // --- Exposed API ---
  return {
    // form
    rsbsa,
    setRsbsa,
    password,
    setPassword,
    showPassword,
    setShowPassword,

    // status
    isLoading,

    // handlers
    handleLogin,
    handleBack,

    // params
    rsbsaParam,
  };
}
