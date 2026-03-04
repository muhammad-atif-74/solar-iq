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
}

export type Selected_Room = {
    id: string;
    qty: number;
    name: string;
}