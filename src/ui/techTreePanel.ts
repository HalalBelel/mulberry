import { laterTechNames } from "../data/tech";
import type { GameState } from "../game/GameState";

export function renderTechTreePanel(state: GameState): HTMLElement {
  const panel = document.createElement("section");
  panel.className = "panel tech-panel";
  panel.innerHTML = `<h2>Tech Tree</h2>`;
  const nodes = document.createElement("div");
  nodes.className = "tech-nodes";
  const early = [
    ["Foraging", "unlocked"],
    ["Mulberry Bow Drill", state.bowDrillUnlocked ? "crafted" : "available"],
    ["Fire Pit", "next unlock"],
  ];
  for (const [name, status] of early) nodes.append(node(name, status));
  for (const name of laterTechNames) nodes.append(node(name, "future"));
  panel.append(nodes);
  return panel;
}

function node(name: string, status: string): HTMLElement {
  const item = document.createElement("div");
  item.className = `tech-node ${status.replace(" ", "-")}`;
  item.innerHTML = `<strong>${name}</strong><span>${status}</span>`;
  return item;
}
