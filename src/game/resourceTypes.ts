export type ResourceKey =
  | "labour"
  | "hunger"
  | "thirst"
  | "mulberryTwigs"
  | "mulberryFruit"
  | "mulberryLeaves"
  | "mulberryFibre"
  | "stone"
  | "clay"
  | "water";

export type Inventory = Record<ResourceKey, number>;

export type InteractableType = "mulberry" | "stone" | "clay" | "water";

export interface InteractableDefinition {
  id: string;
  type: InteractableType;
  name: string;
  actionLabel: string;
  radius: number;
}
