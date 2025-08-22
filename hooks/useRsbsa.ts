import { useState } from "react";

export function useRsbsa(initialValue = "", debug = false) {
  const [rsbsa, setRsbsa] = useState(initialValue);

  // Debug logger (only logs when debug=true)
  const log = (...args: any[]) => {
    if (debug) console.log("[useRsbsa]", ...args);
  };

  // --- Helpers ---
  const sanitizeInput = (value: string) => value.replace(/\D/g, ""); // remove non-numbers

  const enforcePrefix = (value: string) =>
    value.startsWith("126303") ? value : "126303" + value.replace(/^126303/, "");

  const limitLength = (value: string) => value.slice(0, 14);

  const formatWithDashes = (value: string) =>
    value.replace(/^(\d{6})(\d{0,3})(\d{0,5}).*/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join("-")
    );

  // --- Main handler ---
  const handleInputChange = (raw: string) => {
    log("Raw input:", raw);

    let cleaned = sanitizeInput(raw);
    cleaned = enforcePrefix(cleaned);
    cleaned = limitLength(cleaned);

    const formatted = formatWithDashes(cleaned);
    setRsbsa(formatted);

    log("Formatted RSBSA:", formatted);
  };

  // --- Validation ---
  const isValid = /^126303-\d{3}-\d{5}$/.test(rsbsa);
  log("isValid:", isValid, "Current RSBSA:", rsbsa);

  return { rsbsa, setRsbsa: handleInputChange, isValid };
}
