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