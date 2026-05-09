import type { ResourceKey } from "../game/resourceTypes";

export interface Recipe {
  id: "bowDrill";
  name: string;
  description: string;
  costs: Partial<Record<ResourceKey, number>>;
}

export const recipes: Recipe[] = [
  {
    id: "bowDrill",
    name: "Mulberry Bow Drill",
    description: "A fire-starting tool made from springy mulberry twigs and bark fibre.",
    costs: {
      mulberryTwigs: 5,
      mulberryFibre: 2,
    },
  },
];
