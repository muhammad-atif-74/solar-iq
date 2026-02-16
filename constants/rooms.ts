import { Room } from "@/types";

export const defaultRooms: Room[] = [
    {
      id: "living_room",
      name: "Living Room",
      icon: "sofa",
      category: "living",
      isDefault: true,
    },
    {
      id: "bedroom",
      name: "Bedroom",
      icon: "bed",
      category: "sleeping",
      isDefault: true,
    },
    {
      id: "kitchen",
      name: "Kitchen",
      icon: "fridge",
      category: "utility",
      isDefault: true,
    },
    {
      id: "bathroom",
      name: "Bathroom",
      icon: "shower",
      category: "utility",
      isDefault: true,
    },
    {
      id: "dining_room",
      name: "Dining Room",
      icon: "silverware",
      category: "living",
      isDefault: false,
    },
    {
      id: "office",
      name: "Office / Study",
      icon: "desk",
      category: "work",
      isDefault: false,
    },
    {
      id: "kids_room",
      name: "Kids Room",
      icon: "teddy-bear",
      category: "sleeping",
      isDefault: false,
    },
    {
      id: "guest_room",
      name: "Guest Room",
      icon: "bed-double",
      category: "sleeping",
      isDefault: false,
    },
    {
      id: "hallway",
      name: "Hallway / Corridor",
      icon: "door",
      category: "transition",
      isDefault: false,
    },
    {
      id: "garage",
      name: "Garage",
      icon: "garage",
      category: "utility",
      isDefault: false,
    },
    {
      id: "garden",
      name: "Outdoor / Garden",
      icon: "tree",
      category: "outdoor",
      isDefault: false,
    },
    {
      id: "balcony",
      name: "Balcony / Terrace",
      icon: "balcony",
      category: "outdoor",
      isDefault: false,
    },
  ]
  