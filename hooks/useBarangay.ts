import { useEffect, useState } from "react";

export function useBarangay() {
  const [barangays, setBarangays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBarangays = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/barangays`);
        const data = await res.json();
        setBarangays(data);
      } catch (err: any) {
        setError("Failed to fetch barangays");
      } finally {
        setLoading(false);
      }
    };
    fetchBarangays();
  }, []);

  return { barangays, loading, error };
}