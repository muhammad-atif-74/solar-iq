import { getDevices } from "@/lib/supbase";
import { DEVICE } from "@/types";
import { getCompleteDevices } from "@/utils";
import { useCallback, useState } from "react";

export const useFetchDevices = () => {
  const [devices, setDevices] = useState<DEVICE[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDevices = useCallback(async (roomId: number | null = null, userId: string | null = null) => {
    setLoading(true);
    try {
      const data = await getDevices(roomId, userId);
      const deviceList = data ? getCompleteDevices(data) : [];
      setDevices(deviceList);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { devices, loading, fetchDevices };
};
