import type { GameState } from "../game/GameState";
import { renderBuildPanel } from "./buildPanel";
import { renderCraftingPanel } from "./craftingPanel";
import { renderLogPanel } from "./logPanel";
import { renderResourcePanel } from "./resourcePanel";
import { renderSelectedPanel } from "./selectedPanel";
import { renderTechTreePanel } from "./techTreePanel";

interface Visibility {
  inventory: boolean;
  crafting: boolean;
  tech: boolean;
  build: boolean;
  paused: boolean;
}

export class HUD {
  private visibility: Visibility = { inventory: true, crafting: true, tech: false, build: false, paused: false };

  constructor(private readonly root: HTMLElement, private readonly state: GameState) {
    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      if (key === "i") this.toggle("inventory");
      if (key === "c") this.toggle("crafting");
      if (key === "t") this.toggle("tech");
      if (key === "b") this.toggle("build");
      if (key === "escape") this.toggle("paused");
    });
    state.subscribe(() => this.render());
    this.render();
  }

  render(): void {
    this.root.replaceChildren();
    const left = document.createElement("div");
    left.className = "ui-column left";
    if (this.visibility.inventory) left.append(renderResourcePanel(this.state));
    if (this.visibility.crafting) left.append(renderCraftingPanel(this.state));

    const right = document.createElement("div");
    right.className = "ui-column right";
    right.append(renderSelectedPanel(this.state));
    if (this.visibility.tech) right.append(renderTechTreePanel(this.state));
    if (this.visibility.build) right.append(renderBuildPanel());
    right.append(renderLogPanel(this.state));

    const controls = document.createElement("div");
    controls.className = "controls-help";
    controls.innerHTML = `<strong>WASD</strong> move · mouse drag/scroll camera · <strong>E</strong> interact · <strong>I/C/T/B</strong> panels · <strong>Esc</strong> pause`;
    this.root.append(left, right, controls);
    if (this.visibility.paused) {
      const pause = document.createElement("div");
      pause.className = "pause-card";
      pause.textContent = "Paused / mouse released";
      this.root.append(pause);
    }
  }

  private toggle(key: keyof Visibility): void {
    this.visibility[key] = !this.visibility[key];
    this.render();
  }
}
