import { resourceLabels, trackedResourceOrder } from "../data/resources";
import { drinkWater, eatFruit } from "../game/actions";
import type { GameState } from "../game/GameState";

export function renderResourcePanel(state: GameState): HTMLElement {
  const panel = document.createElement("section");
  panel.className = "panel resource-panel";
  panel.innerHTML = `<h2>Mulberry Alone</h2>`;

  const meters = document.createElement("div");
  meters.className = "meters";
  for (const key of ["labour", "hunger", "thirst"] as const) {
    const row = document.createElement("div");
    row.className = "meter-row";
    row.innerHTML = `<span>${resourceLabels[key]}</span><strong>${Math.round(state.inventory[key])}</strong><div class="meter"><i style="width:${key === "labour" ? state.inventory[key] * 10 : state.inventory[key]}%"></i></div>`;
    meters.append(row);
  }
  panel.append(meters);

  const list = document.createElement("ul");
  list.className = "resource-list";
  for (const key of trackedResourceOrder) {
    const li = document.createElement("li");
    li.innerHTML = `<span>${resourceLabels[key]}</span><strong>${state.inventory[key]}</strong>`;
    list.append(li);
  }
  panel.append(list);

  const actions = document.createElement("div");
  actions.className = "button-row";
  const eat = document.createElement("button");
  eat.textContent = "Eat fruit";
  eat.disabled = state.inventory.mulberryFruit < 1;
  eat.addEventListener("click", () => eatFruit(state));
  const drink = document.createElement("button");
  drink.textContent = "Drink water";
  drink.disabled = state.inventory.water < 1;
  drink.addEventListener("click", () => drinkWater(state));
  actions.append(eat, drink);
  panel.append(actions);
  return panel;
}
