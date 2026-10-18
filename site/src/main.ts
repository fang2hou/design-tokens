import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans-jp/400.css";
import "@fontsource/ibm-plex-sans-jp/600.css";
import "./styles/plex-sans-sc.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/source-serif-4/400.css";
import "@fontsource/noto-serif-sc/400.css";
import "@fontsource/noto-serif-jp/400.css";
import flatJson from "../../dist/tokens.flat.json";
import "./styles/main.css";
import { isLang, t, type Lang } from "./i18n";

type Mode = "light" | "dark";

interface SemanticEntry {
  name: string;
  light: string;
  dark: string;
}

interface PaletteEntry {
  name: string;
  value: string;
}

interface FlatData {
  semantic: SemanticEntry[];
  palette: { light: PaletteEntry[]; dark: PaletteEntry[] };
}

const flat = flatJson as unknown as FlatData;

let currentLang: Lang = "zh-CN";
let currentMode: Mode = "light";
let toastTimer: number | undefined;

function applyLang(lang: Lang): void {
  currentLang = lang;
  localStorage.setItem("dt-lang", lang);
  document.documentElement.lang = lang;
  for (const el of document.querySelectorAll<HTMLElement>("[data-i18n]")) {
    el.textContent = t(lang, el.dataset.i18n ?? "");
  }
  for (const btn of document.querySelectorAll<HTMLButtonElement>("[data-lang]")) {
    btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
  }
}

function applyMode(mode: Mode): void {
  currentMode = mode;
  localStorage.setItem("dt-theme", mode);
  document.documentElement.classList.toggle("dark", mode === "dark");
  const themeButton = document.querySelector<HTMLButtonElement>("#theme-toggle");
  if (themeButton) themeButton.textContent = mode === "dark" ? "☀" : "☾";
  renderSemanticGrid();
}

function showToast(message: string): void {
  const toast = document.querySelector<HTMLElement>("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.dataset.visible = "true";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.dataset.visible = "false";
  }, 1200);
}

async function copyToken(name: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(name);
    showToast(t(currentLang, "copied"));
  } catch {
    showToast(name);
  }
}

function renderSemanticGrid(): void {
  const grid = document.querySelector<HTMLElement>("#semantic-grid");
  if (!grid) return;
  grid.textContent = "";
  for (const entry of flat.semantic) {
    const value = currentMode === "dark" ? entry.dark : entry.light;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "swatch";
    button.innerHTML = `<span class="swatch-chip" style="background-color:${value}"></span>
      <code class="text-xs">${entry.name}</code>
      <code class="text-xs opacity-60">${value}</code>`;
    button.addEventListener("click", () => void copyToken(entry.name));
    grid.append(button);
  }
}

function renderPaletteTable(): void {
  const table = document.querySelector<HTMLElement>("#palette-table");
  if (!table) return;
  const rows = flat.palette.light.map((lightEntry, index) => {
    const darkEntry = flat.palette.dark[index];
    if (!darkEntry) return "";
    return `<tr>
      <td class="py-1 pr-2"><code class="text-xs">${lightEntry.name}</code></td>
      <td class="py-1 pr-2">
        <button type="button" class="swatch" data-copy="${lightEntry.name}">
          <span class="swatch-chip" style="background-color:${lightEntry.value}"></span>
        </button>
      </td>
      <td class="py-1 pr-2"><code class="text-xs opacity-60">${lightEntry.value}</code></td>
      <td class="py-1 pr-2">
        <button type="button" class="swatch" data-copy="${darkEntry.name}">
          <span class="swatch-chip" style="background-color:${darkEntry.value}"></span>
        </button>
      </td>
      <td class="py-1"><code class="text-xs opacity-60">${darkEntry.value}</code></td>
    </tr>`;
  });
  table.innerHTML = `<thead>
      <tr class="text-left text-muted-foreground">
        <th class="py-2 pr-2 font-weight-body" data-i18n="colors.palette"></th>
        <th class="py-2 pr-2" colspan="2" data-i18n="colors.paletteLight"></th>
        <th class="py-2" colspan="2" data-i18n="colors.paletteDark"></th>
      </tr>
    </thead><tbody>${rows.join("")}</tbody>`;
  for (const btn of table.querySelectorAll<HTMLButtonElement>("[data-copy]")) {
    btn.addEventListener("click", () => void copyToken(btn.dataset.copy ?? ""));
  }
}

function superellipsePath(size: number, exponent = 4, samples = 96): string {
  const half = size / 2;
  const points: string[] = [];
  for (let i = 0; i <= samples; i += 1) {
    const angle = (i / samples) * Math.PI * 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = half + half * Math.sign(cos) * Math.abs(cos) ** (2 / exponent);
    const y = half + half * Math.sign(sin) * Math.abs(sin) ** (2 / exponent);
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return `${points.join(" ")} Z`;
}

function setupSquircleClip(): void {
  const path = document.querySelector<SVGPathElement>("#squircle-path");
  const demos = document.querySelectorAll<HTMLElement>(".corner-svg");
  const first = demos[0];
  if (!path || !first) return;
  const size = first.offsetWidth;
  path.setAttribute("d", superellipsePath(size));
  path.setAttribute("transform", `translate(${(136 - size) / 2} ${(136 - size) / 2})`);
}

function initTheme(): void {
  const stored = localStorage.getItem("dt-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyMode(stored === "dark" || stored === "light" ? stored : prefersDark ? "dark" : "light");
}

function initLang(): void {
  const stored = localStorage.getItem("dt-lang");
  applyLang(isLang(stored) ? stored : "zh-CN");
}

function initControls(): void {
  for (const btn of document.querySelectorAll<HTMLButtonElement>("[data-lang]")) {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (isLang(lang)) applyLang(lang);
    });
  }
  document.querySelector("#theme-toggle")?.addEventListener("click", () => {
    applyMode(currentMode === "dark" ? "light" : "dark");
  });
}

initTheme();
initLang();
initControls();
renderSemanticGrid();
renderPaletteTable();
setupSquircleClip();
