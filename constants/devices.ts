export const DEVICE_CATEGORIES = [
    { id: "cooling_and_heating", name: "Cooling & Heating" },
    { id: "kitchen", name: "Kitchen" },
    { id: "laundry", name: "Laundry" },
    { id: "lighting", name: "Lighting" },
    { id: "entertainment", name: "Entertainment" },
    { id: "utilities", name: "Utilities" },
];

export const DEVICE_CATALOG = [
    // Cooling & Heating
    { id: "dev_001", name: "Air Conditioner (1 ton)", category_id: "cooling_and_heating", category_name: "Cooling & Heating", default_wattage_w: 1000, icon: "snowflake", is_custom: false },
    { id: "dev_002", name: "Air Conditioner (1.5 ton)", category_id: "cooling_and_heating", category_name: "Cooling & Heating", default_wattage_w: 1500, icon: "snowflake", is_custom: false },
    { id: "dev_003", name: "Air Conditioner (2 ton)", category_id: "cooling_and_heating", category_name: "Cooling & Heating", default_wattage_w: 2000, icon: "snowflake", is_custom: false },
    { id: "dev_004", name: "Ceiling Fan", category_id: "cooling_and_heating", category_name: "Cooling & Heating", default_wattage_w: 75, icon: "fan", is_custom: false },
    { id: "dev_005", name: "Pedestal Fan", category_id: "cooling_and_heating", category_name: "Cooling & Heating", default_wattage_w: 55, icon: "fan", is_custom: false },
    { id: "dev_006", name: "Room Heater", category_id: "cooling_and_heating", category_name: "Cooling & Heating", default_wattage_w: 2000, icon: "flame", is_custom: false },

    // Kitchen
    { id: "dev_007", name: "Refrigerator", category_id: "kitchen", category_name: "Kitchen", default_wattage_w: 150, icon: "refrigerator", is_custom: false },
    { id: "dev_008", name: "Microwave Oven", category_id: "kitchen", category_name: "Kitchen", default_wattage_w: 1200, icon: "microwave", is_custom: false },
    { id: "dev_009", name: "Electric Kettle", category_id: "kitchen", category_name: "Kitchen", default_wattage_w: 1500, icon: "kettle", is_custom: false },
    { id: "dev_010", name: "Toaster", category_id: "kitchen", category_name: "Kitchen", default_wattage_w: 800, icon: "toaster", is_custom: false },
    { id: "dev_011", name: "Blender", category_id: "kitchen", category_name: "Kitchen", default_wattage_w: 300, icon: "blender", is_custom: false },
    { id: "dev_012", name: "Rice Cooker", category_id: "kitchen", category_name: "Kitchen", default_wattage_w: 500, icon: "pot", is_custom: false },
    { id: "dev_013", name: "Dishwasher", category_id: "kitchen", category_name: "Kitchen", default_wattage_w: 1800, icon: "dishwasher", is_custom: false },

    // Laundry
    { id: "dev_014", name: "Washing Machine", category_id: "laundry", category_name: "Laundry", default_wattage_w: 500, icon: "washing-machine", is_custom: false },
    { id: "dev_015", name: "Clothes Dryer", category_id: "laundry", category_name: "Laundry", default_wattage_w: 5000, icon: "dryer", is_custom: false },
    { id: "dev_016", name: "Iron", category_id: "laundry", category_name: "Laundry", default_wattage_w: 1000, icon: "iron", is_custom: false },

    // Lighting
    { id: "dev_017", name: "LED Bulb", category_id: "lighting", category_name: "Lighting", default_wattage_w: 9, icon: "lightbulb", is_custom: false },
    { id: "dev_018", name: "Tube Light (LED)", category_id: "lighting", category_name: "Lighting", default_wattage_w: 20, icon: "lightbulb", is_custom: false },
    { id: "dev_019", name: "Halogen Spotlight", category_id: "lighting", category_name: "Lighting", default_wattage_w: 50, icon: "lightbulb", is_custom: false },

    // Entertainment
    { id: "dev_020", name: "LED TV (32\")", category_id: "entertainment", category_name: "Entertainment", default_wattage_w: 40, icon: "tv", is_custom: false },
    { id: "dev_021", name: "LED TV (55\")", category_id: "entertainment", category_name: "Entertainment", default_wattage_w: 100, icon: "tv", is_custom: false },
    { id: "dev_022", name: "Laptop", category_id: "entertainment", category_name: "Entertainment", default_wattage_w: 65, icon: "laptop", is_custom: false },
    { id: "dev_023", name: "Desktop PC", category_id: "entertainment", category_name: "Entertainment", default_wattage_w: 250, icon: "monitor", is_custom: false },
    { id: "dev_024", name: "WiFi Router", category_id: "entertainment", category_name: "Entertainment", default_wattage_w: 10, icon: "wifi", is_custom: false },
    { id: "dev_025", name: "Gaming Console", category_id: "entertainment", category_name: "Entertainment", default_wattage_w: 150, icon: "gamepad", is_custom: false },

    // Utilities
    { id: "dev_026", name: "Water Pump (0.5 HP)", category_id: "utilities", category_name: "Utilities", default_wattage_w: 375, icon: "droplet", is_custom: false },
    { id: "dev_027", name: "Water Pump (1 HP)", category_id: "utilities", category_name: "Utilities", default_wattage_w: 750, icon: "droplet", is_custom: false },
    { id: "dev_028", name: "Geyser / Water Heater", category_id: "utilities", category_name: "Utilities", default_wattage_w: 2000, icon: "droplet", is_custom: false },
    { id: "dev_029", name: "UPS / Inverter", category_id: "utilities", category_name: "Utilities", default_wattage_w: 200, icon: "battery", is_custom: false },
];
