export type User = {
    username: string;
    email: string;
    status: string;
    userid: string;
}

export type Room = {
    id: string;
    name: string;
    icon: string;
    category: string;
    isDefault?: boolean;
    room_id?: number | string;
}

export type UserRoom = {
    created_at: string;
    id: number;
    room_id: string;
    room_name: string;
    user_id: string;
}
export type Selected_Room = {
    id: string;
    qty: number;
    name: string;
}

export type HomeData = {
    created_at: string;
    home_name: string;
    solar_capacity_kw: number;
    has_solar: boolean;
}

export type Device_Category = {
    id: string;
    name: string
}

export type Device_Template = {
    id: string;
    name: string;
    category_id: string;
    category_name: string;
    default_wattage_w: number;
    icon: string;
    is_custom: boolean

}

type DEVICE_DB = {
    room_id: number;
    user_id: string;
    appliance_id: string | null;
    is_on: boolean,
    is_custom: boolean;
    custom_name?: string | null;
    wattage_override?: number | null
}