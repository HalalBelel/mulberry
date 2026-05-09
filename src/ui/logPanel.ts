import type { GameState } from "../game/GameState";

export function renderLogPanel(state: GameState): HTMLElement {
  const panel = document.createElement("section");
  panel.className = "panel log-panel";
  panel.innerHTML = `<h2>Event Log</h2>`;
  const list = document.createElement("ol");
  for (const entry of state.log) {
    const li = document.createElement("li");
    li.textContent = entry;
    list.append(li);
  }
  panel.append(list);
  return panel;
}
