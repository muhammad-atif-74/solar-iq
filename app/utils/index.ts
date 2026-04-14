import { DEVICE_CATALOG } from "@/constants/devices";
import { defaultRooms } from "@/constants/rooms";
import { Detailed_Room, DEVICE, DEVICE_DB, UserRoom } from "@/types";

export const getCompleteDevices = (devices: DEVICE_DB[]) => {
    // Step 1: Build lookup map
    const catalogMap = new Map(
        DEVICE_CATALOG.map((item) => [item.id, item])
    );

    // Step 2: Transform devices
    const deviceList: DEVICE[] = devices
        .map((dbDevice: any) => {
            const template = catalogMap.get(dbDevice.appliance_id);

            if (!template) return null;

            return {
                id: template.id,
                name: dbDevice.is_custom ? dbDevice.custom_name : template.name,
                category_id: template.category_id,
                category_name: template.category_name,
                default_wattage_w:
                    dbDevice.wattage_override ?? template.default_wattage_w,
                icon: template.icon,

                device_id: dbDevice.id,
                room_id: dbDevice.room_id,
                user_id: dbDevice.user_id,
                appliance_id: dbDevice.appliance_id,
                is_on: dbDevice.is_on,

                is_custom: dbDevice.is_custom,
            };
        })
        .filter(Boolean) as DEVICE[];

    return deviceList

}

export const getCompleteRooms = (rooms: UserRoom[]) => {
    // Step 1: Build lookup map
    const catalogMap = new Map(
        defaultRooms
        .filter(item => item.id !== "all")
        .map((item) => [item.id, item])
    );

    // Step 2: Transform rooms
    const roomsList: Detailed_Room[] = rooms
        .map((dbRoom: UserRoom) => {
            const template = catalogMap.get(dbRoom.room_id);

            if (!template) return null;

            return {
                id: template.id,
                name: template.name,
                icon: template.icon,
                category: template.category,
                image: template.image,
                isDefault: template.isDefault,
                
                room_id: dbRoom.room_id,
                created_at: dbRoom.created_at,
                db_id: dbRoom.id,
                room_name: dbRoom.room_name,
                user_id: dbRoom.user_id,
            }; 
        })
        .filter(Boolean) as Detailed_Room[];

    return roomsList

}