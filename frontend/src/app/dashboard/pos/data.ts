export interface MenuItem {
    id: number;
    name: string;
    category: string;
    price: number;
    available: boolean;
}

export const MOCK_MENU: MenuItem[] = [
    { id: 1, name: "Sample Item", category: "Main", price: 100, available: true }
];
