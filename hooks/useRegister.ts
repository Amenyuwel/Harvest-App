import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useBarangay } from "../hooks/useBarangay";
import { useCrops } from "../hooks/useCrops";
import { useRouter, useLocalSearchParams } from "expo-router";

export function useRegister(debug = false) {
  // --- Form state ---
  const [rsbsa, setRsbsa] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [area, setArea] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- Status state ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedId, setGeneratedId] = useState("");

  // --- External data ---
  const { crops, loading: cropsLoading } = useCrops();
  const { barangays, loading: barangaysLoading } = useBarangay();
  const router = useRouter();
  const params = useLocalSearchParams();

  // Debug helper
  const log = (...args: any[]) =>
    debug && console.log("[useRegister]", ...args);

  // --- Effects ---
  useEffect(() => {
    log("Params:", params);
    if (params?.rsbsa) setRsbsa(String(params.rsbsa));
    if (params?.barangay) setSelectedBarangay(String(params.barangay));
  }, [params]);

  useEffect(() => {
    log("selectedBarangay:", selectedBarangay, "rsbsa:", rsbsa);

    if (selectedBarangay && rsbsa) {
      const barangay = barangays.find((b) => b.barangayId === selectedBarangay);
      if (barangay) {
        const lastFive = rsbsa.match(/(\d{5})$/)?.[1] ?? rsbsa;
        const id = `126303-${barangay.barangayId}-${lastFive}`;
        setGeneratedId(id);
        log("generatedId set to:", id);
      }
    }
  }, [selectedBarangay, rsbsa, barangays]);

  useEffect(() => {
    log("Name fields:", firstName, middleName, lastName);
    const names = [firstName, middleName, lastName].filter((n) => n.trim());
    setFullName(names.join(" "));
  }, [firstName, middleName, lastName]);

  // --- Handlers ---
  const handleRegister = async () => {
    log("handleRegister called");

    if (
      !firstName ||
      !lastName ||
      !selectedCrop ||
      !selectedBarangay ||
      !area ||
      !contact ||
      !password
    ) {
      setError("Please fill in all required fields");
      log("Validation failed: missing fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      log("Validation failed: passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      log("Sending registration to:", apiUrl);

      const cropName =
        crops.find((c) => c.cropId === selectedCrop)?.cropName ?? "";
      const barangayName =
        barangays.find((b) => b.barangayId === selectedBarangay)
          ?.barangayName ?? "";

      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rsbsaNumber: generatedId,
          firstName,
          middleName,
          lastName,
          fullName,
          crop: cropName,
          area,
          barangay: barangayName,
          contact,
          password,
          originalRsbsa: rsbsa,
        }),
      });

      const data = await response.json();
      log("Registration response:", data);

      if (data.success) {
        Alert.alert(
          "Registration successful!",
          `Your farmer ID is: ${generatedId}`,
          [
            {
              text: "OK",
              onPress: () =>
                router.replace({ pathname: "/auth/login", params: { rsbsa } }),
            },
          ]
        );
      } else {
        setError(data.message || "Registration failed. Please try again.");
        log("Registration failed:", data.message);
      }
    } catch (err) {
      setError(
        "Registration failed. Please check your connection and try again."
      );
      log("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => router.replace("/auth/rsbsa");

  // --- Exposed API ---
  return {
    // form values
    rsbsa,
    setRsbsa,
    firstName,
    setFirstName,
    middleName,
    setMiddleName,
    lastName,
    setLastName,
    fullName,
    selectedCrop,
    setSelectedCrop,
    area,
    setArea,
    selectedBarangay,
    setSelectedBarangay,
    contact,
    setContact,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,

    // status
    isLoading,
    error,
    generatedId,

    // external data
    crops,
    cropsLoading,
    barangays,
    barangaysLoading,

    // handlers
    handleRegister,
    handleBack,
  };
}
