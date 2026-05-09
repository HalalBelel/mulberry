import { futureBuildables } from "../data/tech";

export function renderBuildPanel(): HTMLElement {
  const panel = document.createElement("section");
  panel.className = "panel build-panel";
  panel.innerHTML = `<h2>Build</h2><p class="hint">Milestone 1 shows the path. Construction begins after fire.</p>`;
  const list = document.createElement("ul");
  list.className = "build-list";
  for (const item of futureBuildables) {
    const li = document.createElement("li");
    li.innerHTML = `<span>${item}</span><em>locked / future</em>`;
    list.append(li);
  }
  panel.append(list);
  return panel;
}
