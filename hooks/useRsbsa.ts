import { useState } from "react";

export function useRsbsa(
  initialValue = "",
  debug = false,
  validBarangayIds: string[] = []
) {
  const [rsbsa, setRsbsa] = useState(
    initialValue.startsWith("126303-") ? initialValue : "126303-"
  );
  const [error, setError] = useState<string | null>(null);

  const log = (...args: any[]) => {
    if (debug) console.log("[useRsbsa]", ...args);
  };

  const PREFIX = "126303-";
  const sanitizeInput = (value: string) => value.replace(/\D/g, ""); // remove non-numbers

  const formatWithDashes = (value: string) =>
    value.replace(/^(\d{3})(\d{0,5}).*/, (_, b, c) =>
      [b, c].filter(Boolean).join("-")
    );

  const handleInputChange = (raw: string) => {
    log("Raw input:", raw);

    // If the user tries to delete or change the prefix, ignore the change
    if (!raw.startsWith(PREFIX)) {
      setRsbsa(PREFIX);
      setError(null);
      return;
    }

    // Remove the prefix for processing
    let input = raw.slice(PREFIX.length);

    // Only allow numbers
    let cleaned = sanitizeInput(input);

    // Limit to 8 digits after the prefix (3 for barangay, 5 for count)
    cleaned = cleaned.slice(0, 8);

    // Format as XXX-XXXXX
    const formatted = formatWithDashes(cleaned);
    const finalValue = PREFIX + formatted;

    // Extract barangay code if available
    const barangayCode = cleaned.slice(0, 3);

    // Validate barangay code if 3 digits entered
    if (barangayCode.length === 3) {
      if (!validBarangayIds.includes(barangayCode)) {
        setError("Barangay code does not exist.");
      } else {
        setError(null);
      }
    } else {
      setError(null);
    }

    setRsbsa(finalValue);
    log("Formatted RSBSA:", finalValue);
  };

  // --- Validation ---
  const barangayCode = rsbsa.slice(7, 10);
  const farmerCount = rsbsa.slice(11, 16);
  const isEndingWith00000 = rsbsa.length === 16 && farmerCount === "00000";
  const isValid =
    /^126303-\d{3}-\d{5}$/.test(rsbsa) &&
    validBarangayIds.includes(barangayCode) &&
    !error &&
    !isEndingWith00000;

  log("isValid:", isValid, "Current RSBSA:", rsbsa);

  return {
    rsbsa,
    setRsbsa: handleInputChange,
    isValid,
    error,
    isEndingWith00000,
  };
}
