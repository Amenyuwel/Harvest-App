import { useEffect, useState } from "react";

interface Crop {
  cropId: string;
  cropName: string;
}

export function useCrops() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/crops`);
        if (!res.ok) throw new Error("Failed to fetch crops");
        const data = await res.json();
        setCrops(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCrops();
  }, []);

  return { crops, loading, error };
}
