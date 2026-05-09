import type { GameState } from "../game/GameState";

export function renderSelectedPanel(state: GameState): HTMLElement {
  const panel = document.createElement("section");
  panel.className = "panel selected-panel";
  panel.innerHTML = `<h2>Selected</h2>`;
  if (!state.selected) {
    panel.innerHTML += `<p>No resource nearby.</p>`;
    return panel;
  }
  panel.innerHTML += `
    <h3>${state.selected.name}</h3>
    <p>${state.selected.inRange ? "In range" : "Move closer"} · ${state.selected.distance.toFixed(1)} m</p>
    <p><kbd>E</kbd> ${state.selected.actionLabel}</p>
  `;
  return panel;
}
