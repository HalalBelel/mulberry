export interface TechNode {
  id: string;
  name: string;
  status: "unlocked" | "available" | "crafted" | "next" | "future";
}

export const laterTechNames = [
  "Drying Rack",
  "Charcoal Pit",
  "Managed Coppice",
  "Bark Fibre Cordage",
  "Pulleys and Belts",
  "Gasifier",
  "Gas Engine",
  "Mechanical Luxury Homestead",
];

export const futureBuildables = [
  "Fire Pit",
  "Drying Rack",
  "Charcoal Pit",
  "Managed Coppice",
  "Gasifier",
  "Gas Engine",
  "Powered Coppice Cutter",
  "Powered Planter",
];
