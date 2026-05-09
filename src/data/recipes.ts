import type { ResourceKey } from "../game/resourceTypes";

export type RecipeId = "bowDrill" | "firePit";

export interface Recipe {
  id: RecipeId;
  name: string;
  description: string;
  costs: Partial<Record<ResourceKey, number>>;
  requiresBowDrill?: boolean;
}

export const recipes: Recipe[] = [
  {
    id: "bowDrill",
    name: "Mulberry Bow Drill",
    description: "A visible hand tool made from springy mulberry twigs and bark fibre for starting flame by friction.",
    costs: {
      mulberryTwigs: 5,
      mulberryFibre: 2,
    },
  },
  {
    id: "firePit",
    name: "Stone Fire Pit",
    description: "A small ring of stones, clay, tinder, and mulberry twigs. Walk to it and press E to light it with the bow drill.",
    costs: {
      stone: 4,
      clay: 2,
      mulberryTwigs: 3,
      mulberryLeaves: 2,
    },
    requiresBowDrill: true,
  },
];
