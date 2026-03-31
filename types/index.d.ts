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