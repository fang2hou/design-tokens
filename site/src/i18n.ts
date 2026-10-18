export type Lang = "zh-CN" | "ja" | "en";

export const LANGS: readonly Lang[] = ["zh-CN", "ja", "en"];

const dict: Record<Lang, Record<string, string>> = {
  "zh-CN": {
    "app.subtitle": "个人设计系统试验田",
    "nav.colors": "色彩",
    "nav.typography": "字体排版",
    "nav.corners": "圆角",
    "nav.components": "组件",
    "theme.toggle": "切换深浅色",
    "colors.semantic": "语义色",
    "colors.semanticHint": "点击色卡复制变量名",
    "colors.palette": "原始色板（Gruvbox Material · mix · hard）",
    "colors.paletteLight": "浅色",
    "colors.paletteDark": "深色",
    "typo.families": "字体族",
    "typo.scale": "字号阶梯",
    "typo.reading": "阅读排版",
    "typo.readingHint": "应用 measure / leading / paragraph token 的三语长文样张（衬线）",
    "corner.scale": "圆角阶梯",
    "corner.shapes": "边角形状方案",
    "corner.round": "标准圆角",
    "corner.squircle": "平滑圆角 squircle",
    "corner.soft": "柔和 superellipse(1.4)",
    "corner.boxy": "方正 superellipse(3)",
    "corner.svgClip": "SVG 裁剪路径（跨浏览器）",
    "corner.nested": "嵌套同心规则 r = R − p",
    "corner.support": "corner-shape 由 Chromium 139+ 渲染，其余浏览器回退为普通圆角",
    "comp.title": "组件预览",
    "comp.button": "按钮",
    "comp.badge": "徽章",
    "comp.input": "输入框",
    "comp.card": "卡片",
    "comp.cardBody":
      "圆角取 radius-xl 并配 corner-shape: squircle；按钮 radius-m；徽章 radius-full。",
    "footer.sources":
      "配色基于 Gruvbox Material（MIT）· 字体 IBM Plex / Source Serif 4 / Noto Serif（OFL）",
    copied: "已复制",
  },
  ja: {
    "app.subtitle": "個人デザインシステムの実験場",
    "nav.colors": "カラー",
    "nav.typography": "タイポグラフィ",
    "nav.corners": "角丸",
    "nav.components": "コンポーネント",
    "theme.toggle": "ダーク／ライト切替",
    "colors.semantic": "セマンティックカラー",
    "colors.semanticHint": "クリックで変数名をコピー",
    "colors.palette": "プリミティブパレット（Gruvbox Material · mix · hard）",
    "colors.paletteLight": "ライト",
    "colors.paletteDark": "ダーク",
    "typo.families": "フォントファミリー",
    "typo.scale": "タイプスケール",
    "typo.reading": "長文組み",
    "typo.readingHint": "measure・leading・paragraph トークンを適用した三言語の長文見本（セリフ）",
    "corner.scale": "角丸スケール",
    "corner.shapes": "角の形状オプション",
    "corner.round": "標準の角丸",
    "corner.squircle": "スクワークル",
    "corner.soft": "ソフト superellipse(1.4)",
    "corner.boxy": "角張った superellipse(3)",
    "corner.svgClip": "SVG クリップパス（クロスブラウザ）",
    "corner.nested": "ネスト同心則 r = R − p",
    "corner.support":
      "corner-shape は Chromium 139+ で描画、他のブラウザは通常の角丸にフォールバック",
    "comp.title": "コンポーネントプレビュー",
    "comp.button": "ボタン",
    "comp.badge": "バッジ",
    "comp.input": "入力欄",
    "comp.card": "カード",
    "comp.cardBody":
      "カードは radius-xl + corner-shape: squircle、ボタンは radius-m、バッジは radius-full。",
    "footer.sources":
      "配色は Gruvbox Material（MIT）・フォントは IBM Plex / Source Serif 4 / Noto Serif（OFL）",
    copied: "コピーしました",
  },
  en: {
    "app.subtitle": "A personal design system playground",
    "nav.colors": "Colors",
    "nav.typography": "Typography",
    "nav.corners": "Corners",
    "nav.components": "Components",
    "theme.toggle": "Toggle dark / light",
    "colors.semantic": "Semantic colors",
    "colors.semanticHint": "Click a swatch to copy its variable name",
    "colors.palette": "Primitive palette (Gruvbox Material · mix · hard)",
    "colors.paletteLight": "Light",
    "colors.paletteDark": "Dark",
    "typo.families": "Font families",
    "typo.scale": "Type scale",
    "typo.reading": "Reading typography",
    "typo.readingHint":
      "Trilingual long-form samples in serif, using the measure, leading and paragraph tokens",
    "corner.scale": "Radius scale",
    "corner.shapes": "Corner shape options",
    "corner.round": "Plain round",
    "corner.squircle": "Squircle",
    "corner.soft": "Soft superellipse(1.4)",
    "corner.boxy": "Boxy superellipse(3)",
    "corner.svgClip": "SVG clip-path (cross-browser)",
    "corner.nested": "Concentric nesting r = R − p",
    "corner.support":
      "corner-shape renders in Chromium 139+; other browsers fall back to plain round corners",
    "comp.title": "Component preview",
    "comp.button": "Button",
    "comp.badge": "Badge",
    "comp.input": "Input",
    "comp.card": "Card",
    "comp.cardBody":
      "Cards use radius-xl with corner-shape: squircle; buttons radius-m; badges radius-full.",
    "footer.sources":
      "Colors from Gruvbox Material (MIT) · Fonts: IBM Plex / Source Serif 4 / Noto Serif (OFL)",
    copied: "Copied",
  },
};

export function t(lang: Lang, key: string): string {
  return dict[lang][key] ?? dict["zh-CN"][key] ?? key;
}

export function isLang(value: string | null | undefined): value is Lang {
  return value != null && (LANGS as readonly string[]).includes(value);
}
