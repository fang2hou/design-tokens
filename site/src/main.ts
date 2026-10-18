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
import { iconHtml, mountIcons } from "./icons";

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
  for (const el of document.querySelectorAll<HTMLInputElement>("[data-i18n-placeholder]")) {
    el.placeholder = t(lang, el.dataset.i18nPlaceholder ?? "");
  }
  for (const btn of document.querySelectorAll<HTMLButtonElement>("[data-lang]")) {
    btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
  }
  renderCalendar();
}

function applyMode(mode: Mode): void {
  currentMode = mode;
  localStorage.setItem("dt-theme", mode);
  document.documentElement.classList.toggle("dark", mode === "dark");
  const themeButton = document.querySelector<HTMLButtonElement>("#theme-toggle");
  if (themeButton) {
    themeButton.innerHTML = `<span class="icon">${iconHtml(mode === "dark" ? "sun" : "moon")}</span>`;
  }
  renderSemanticGrid();
}

function showToast(message: string, undo = false): void {
  const toast = document.querySelector<HTMLElement>("#toast");
  if (!toast) return;
  toast.querySelector("span")!.textContent = message;
  const undoButton = toast.querySelector<HTMLButtonElement>("#toast-undo");
  undoButton!.hidden = !undo;
  toast.dataset.visible = "true";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.dataset.visible = "false";
  }, 2400);
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

function renderHueStrips(): void {
  const cover = document.querySelector<HTMLElement>("#cover-strip");
  const stripLight = document.querySelector<HTMLElement>("#hue-strip-light");
  const stripDark = document.querySelector<HTMLElement>("#hue-strip-dark");
  const cells = (mode: "light" | "dark"): string =>
    flat.palette[mode]
      .map((entry) => `<div style="background-color:${entry.value}"></div>`)
      .join("");
  if (cover) cover.innerHTML = cells(currentMode === "dark" ? "dark" : "light");
  if (stripLight) stripLight.innerHTML = cells("light");
  if (stripDark) stripDark.innerHTML = cells("dark");
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

const RANGE_START = 1;
const RANGE_END = 5;

let viewYear = new Date().getFullYear();
let viewMonth = new Date().getMonth();

function monthLabel(lang: Lang, year: number, month: number): string {
  return new Intl.DateTimeFormat(lang, { year: "numeric", month: "long" }).format(
    new Date(year, month, 1),
  );
}

function weekdayLabels(lang: Lang): string[] {
  const formatter = new Intl.DateTimeFormat(lang, { weekday: "short" });
  const base = new Date(2026, 9, 5);
  return Array.from({ length: 7 }, (_, i) =>
    formatter.format(new Date(base.getFullYear(), base.getMonth(), base.getDate() + i)),
  );
}

function renderCalendar(): void {
  const grid = document.querySelector<HTMLElement>("#calendar-grid");
  const title = document.querySelector<HTMLElement>("#calendar-title");
  if (!grid || !title) return;
  title.textContent = monthLabel(currentLang, viewYear, viewMonth);
  const weekdays = weekdayLabels(currentLang);
  const firstDay = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();
  const lead = (firstDay.getDay() + 6) % 7;
  const cells: string[] = weekdays.map((day) => `<span class="calendar-weekday">${day}</span>`);
  for (let i = lead - 1; i >= 0; i -= 1) {
    cells.push(`<span class="calendar-day day-out">${daysInPrev - i}</span>`);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const inRange = day > RANGE_START && day < RANGE_END;
    const isEdge = day === RANGE_START || day === RANGE_END;
    const cls = isEdge ? "day-range-end" : inRange ? "day-in-range" : "";
    cells.push(`<button type="button" class="calendar-day ${cls}">${day}</button>`);
  }
  const tail = (7 - ((lead + daysInMonth) % 7)) % 7;
  for (let day = 1; day <= tail; day += 1) {
    cells.push(`<span class="calendar-day day-out">${day}</span>`);
  }
  grid.innerHTML = cells.join("");
}

function shiftMonth(delta: number): void {
  viewMonth += delta;
  if (viewMonth < 0) {
    viewMonth = 11;
    viewYear -= 1;
  } else if (viewMonth > 11) {
    viewMonth = 0;
    viewYear += 1;
  }
  renderCalendar();
}

function setupCalendarControls(): void {
  document
    .querySelectorAll<HTMLElement>("#calendar .calendar-head button")
    .forEach((button, index) => {
      button.addEventListener("click", () => shiftMonth(index === 0 ? -1 : 1));
    });
  for (const chip of document.querySelectorAll<HTMLButtonElement>(".chip-remove")) {
    chip.addEventListener("click", () => chip.closest(".chip")?.remove());
  }
}

function setupComponentInteractions(): void {
  for (const toggle of document.querySelectorAll<HTMLElement>(".switch")) {
    const flip = () => {
      const checked = toggle.getAttribute("aria-checked") !== "true";
      toggle.setAttribute("aria-checked", String(checked));
    };
    toggle.addEventListener("click", flip);
    toggle.addEventListener("keydown", (event) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        flip();
      }
    });
  }
  document.querySelector("#toast-trigger")?.addEventListener("click", () => {
    showToast(t(currentLang, "comp.savedToast"), true);
  });
  document.querySelector("#toast-undo")?.addEventListener("click", () => {
    const toast = document.querySelector<HTMLElement>("#toast");
    if (toast) toast.dataset.visible = "false";
  });
}

function currentSectionIndex(): number {
  const scroller = document.querySelector<HTMLElement>("#hscroll");
  if (!scroller) return 0;
  const sections = [...scroller.querySelectorAll<HTMLElement>("section")];
  const probe = scroller.scrollLeft + scroller.clientWidth / 2;
  let index = 0;
  sections.forEach((section, i) => {
    if (probe >= section.offsetLeft) index = i;
  });
  return index;
}

function scrollToSection(index: number): void {
  const scroller = document.querySelector<HTMLElement>("#hscroll");
  if (!scroller) return;
  const sections = scroller.querySelectorAll<HTMLElement>("section");
  const section = sections[index];
  if (section) {
    section.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }
}

function setupScrollNav(): void {
  const scroller = document.querySelector<HTMLElement>("#hscroll");
  if (!scroller) return;
  const links = [...document.querySelectorAll<HTMLAnchorElement>(".hnav-link")];
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute("href") ?? "");
      target?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    });
  });
  const sections = [...scroller.querySelectorAll<HTMLElement>("section")];
  scroller.addEventListener(
    "wheel",
    (event) => {
      if (!(event instanceof WheelEvent) || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) {
        return;
      }
      const section = event.target instanceof Element ? event.target.closest("section") : null;
      if (section && section.scrollHeight > section.clientHeight + 1) {
        const atTop = section.scrollTop <= 0;
        const atBottom = section.scrollTop + section.clientHeight >= section.scrollHeight - 1;
        if (
          (!atTop && event.deltaY < 0) ||
          (!atBottom && event.deltaY > 0) ||
          (atTop && atBottom)
        ) {
          return;
        }
      }
      event.preventDefault();
      scroller.scrollLeft += event.deltaY;
    },
    { passive: false },
  );
  const highlight = () => {
    const index = currentSectionIndex();
    links.forEach((link, i) => link.setAttribute("aria-current", String(i === index)));
  };
  scroller.addEventListener("scroll", highlight, { passive: true });
  highlight();
  document.querySelector("#nav-prev")?.addEventListener("click", () => {
    scrollToSection(Math.max(0, currentSectionIndex() - 1));
  });
  document.querySelector("#nav-next")?.addEventListener("click", () => {
    scrollToSection(Math.min(sections.length - 1, currentSectionIndex() + 1));
  });
  window.addEventListener("keydown", (event) => {
    if (event.target instanceof HTMLElement && event.target.matches("input, select, textarea")) {
      return;
    }
    if (event.key === "ArrowLeft") scrollToSection(Math.max(0, currentSectionIndex() - 1));
    if (event.key === "ArrowRight") {
      scrollToSection(Math.min(sections.length - 1, currentSectionIndex() + 1));
    }
  });
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
    renderHueStrips();
  });
}

mountIcons();
initTheme();
initLang();
initControls();
renderSemanticGrid();
renderHueStrips();
renderPaletteTable();
setupSquircleClip();
setupCalendarControls();
setupComponentInteractions();
setupScrollNav();
