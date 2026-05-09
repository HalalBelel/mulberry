import { laterTechNames } from "../data/tech";
import type { GameState } from "../game/GameState";

export function renderTechTreePanel(state: GameState): HTMLElement {
  const panel = document.createElement("section");
  panel.className = "panel tech-panel branching-tree";
  panel.innerHTML = `<h2>Tech Tree</h2><p class="hint">Branching possibilities. Click C to craft available nodes.</p>`;
  const tree = document.createElement("div");
  tree.className = "tree-map";

  const foraging = node("Foraging", "unlocked", "root");
  const bow = node("Mulberry Bow Drill", state.bowDrillUnlocked ? "crafted" : "available", "branch-a");
  const firePit = node("Stone Fire Pit", state.firePitBuilt ? "built" : state.bowDrillUnlocked ? "available" : "locked", "branch-a");
  const fire = node("First Flame", state.fireLit ? "lit" : state.firePitBuilt ? "ready: press E" : "locked", "branch-a");
  tree.append(foraging, bow, firePit, fire);

  const branches = document.createElement("div");
  branches.className = "future-branches";
  for (const name of laterTechNames) {
    branches.append(node(name, "future", "future"));
  }
  tree.append(branches);
  panel.append(tree);
  return panel;
}

function node(name: string, status: string, branch: string): HTMLElement {
  const item = document.createElement("div");
  item.className = `tech-node ${branch} ${status.replace(/[: ]/g, "-")}`;
  item.innerHTML = `<strong>${name}</strong><span>${status}</span>`;
  return item;
}
