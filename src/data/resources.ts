import type { Inventory, ResourceKey } from "../game/resourceTypes";

export const resourceLabels: Record<ResourceKey, string> = {
  labour: "Labour",
  hunger: "Hunger",
  thirst: "Thirst",
  mulberryTwigs: "Mulberry Twigs",
  mulberryFruit: "Mulberry Fruit",
  mulberryLeaves: "Mulberry Leaves",
  mulberryFibre: "Mulberry Fibre",
  stone: "Stone",
  clay: "Clay",
  water: "Water",
};

export const initialInventory: Inventory = {
  labour: 10,
  hunger: 80,
  thirst: 80,
  mulberryTwigs: 0,
  mulberryFruit: 0,
  mulberryLeaves: 0,
  mulberryFibre: 0,
  stone: 2,
  clay: 0,
  water: 0,
};

export const trackedResourceOrder: ResourceKey[] = [
  "mulberryTwigs",
  "mulberryFruit",
  "mulberryLeaves",
  "mulberryFibre",
  "stone",
  "clay",
  "water",
];
