import { useState, useEffect, useRef } from "react";
import { Alert } from "react-native";
import { useBarangay } from "../hooks/useBarangay";
import { useCrops } from "../hooks/useCrops";
import { useRouter, useLocalSearchParams } from "expo-router";

// Helper to format contact as '63+ 948 279 2687'
function formatPhilippineContact(input: string) {
  // Remove all non-digit characters
  let digits = input.replace(/\D/g, "");

  // Remove leading '0' if present
  if (digits.startsWith("0")) digits = digits.slice(1);

  // Remove leading '63' if present
  if (digits.startsWith("63")) digits = digits.slice(2);

  // Limit to 10 digits (Philippine mobile number)
  digits = digits.slice(0, 10);

  // Format as '63+ XXX XXX XXXX'
  let formatted = "63+";
  if (digits.length > 0) formatted += " " + digits.slice(0, 3);
  if (digits.length > 3) formatted += " " + digits.slice(3, 6);
  if (digits.length > 6) formatted += " " + digits.slice(6, 10);

  return formatted.trim();
}

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
  const [barangayName, setBarangayName] = useState("");
  const [contact, _setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- Status state ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedId, setGeneratedId] = useState("");

  // --- Success Dialog state ---
  const [showRegisterSuccess, setShowRegisterSuccess] = useState(false);

  // --- External data ---
  const { crops, loading: cropsLoading } = useCrops();
  const { barangays, loading: barangaysLoading } = useBarangay();
  const router = useRouter();
  const params = useLocalSearchParams();

  // Debug helper
  const log = (...args: any[]) =>
    debug && console.log("[useRegister]", ...args);

  // --- Effects ---
  const didInit = useRef(false);

  useEffect(() => {
    if (!didInit.current) {
      log("Params:", params);
      if (params?.rsbsa) setRsbsa(String(params.rsbsa));
      if (params?.barangay) setSelectedBarangay(String(params.barangay));
      didInit.current = true;
    }
  }, [params]);

  useEffect(() => {
    log("selectedBarangay:", selectedBarangay, "rsbsa:", rsbsa);

    if (selectedBarangay && rsbsa) {
      const barangay = barangays.find((b) => b.barangayId === selectedBarangay);
      if (barangay) {
        setBarangayName(barangay.barangayName);
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

  // Replace setContact with formatted setter
  const setContact = (val: string) => {
    _setContact(formatPhilippineContact(val));
  };

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
        setShowRegisterSuccess(true);
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

  const handleRegisterSuccessClose = () => {
    // Use the latest generatedId (the new RSBSA with updated barangay)
    router.replace({ pathname: "/auth/login", params: { rsbsa: generatedId } });
  };

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
    barangayName,
    setBarangayName,
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

    // success dialog
    showRegisterSuccess,
    setShowRegisterSuccess,

    // external data
    crops,
    cropsLoading,
    barangays,
    barangaysLoading,

    // handlers
    handleRegister,
    handleBack,
    handleRegisterSuccessClose,
  };
}
