import { getCompleteDevices } from "@/app/utils";
import { getDevices } from "@/lib/supbase";
import { DEVICE } from "@/types";
import { useState } from "react";

export const useFetchDevices = () => {
  const [allDevices, setAllDevices] = useState<DEVICE[]>([]);
  const [devices, setDevices] = useState<DEVICE[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDevices = async (activeTab: string = "all") => {
    setLoading(true);
    try {
      const all = await getDevices(null);
      const allList = all ? getCompleteDevices(all) : [];

      setAllDevices(allList);

      const filteredList =
        activeTab === "all"
          ? allList
          : allList.filter(d => d.room_id === Number(activeTab));

      setDevices(filteredList);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return { devices, allDevices, loading, fetchDevices };
};
