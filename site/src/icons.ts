import arrowRight from "lucide-static/icons/arrow-right.svg?raw";
import barChart3 from "lucide-static/icons/bar-chart-3.svg?raw";
import bell from "lucide-static/icons/bell.svg?raw";
import bookOpen from "lucide-static/icons/book-open.svg?raw";
import calendar from "lucide-static/icons/calendar.svg?raw";
import check from "lucide-static/icons/check.svg?raw";
import chevronDown from "lucide-static/icons/chevron-down.svg?raw";
import chevronLeft from "lucide-static/icons/chevron-left.svg?raw";
import chevronRight from "lucide-static/icons/chevron-right.svg?raw";
import circleCheck from "lucide-static/icons/circle-check.svg?raw";
import creditCard from "lucide-static/icons/credit-card.svg?raw";
import fileText from "lucide-static/icons/file-text.svg?raw";
import house from "lucide-static/icons/house.svg?raw";
import lifeBuoy from "lucide-static/icons/life-buoy.svg?raw";
import logOut from "lucide-static/icons/log-out.svg?raw";
import mail from "lucide-static/icons/mail.svg?raw";
import messageSquare from "lucide-static/icons/message-square.svg?raw";
import moon from "lucide-static/icons/moon.svg?raw";
import moreHorizontal from "lucide-static/icons/more-horizontal.svg?raw";
import paperclip from "lucide-static/icons/paperclip.svg?raw";
import plus from "lucide-static/icons/plus.svg?raw";
import puzzle from "lucide-static/icons/puzzle.svg?raw";
import search from "lucide-static/icons/search.svg?raw";
import settings from "lucide-static/icons/settings.svg?raw";
import sun from "lucide-static/icons/sun.svg?raw";
import trendingUp from "lucide-static/icons/trending-up.svg?raw";
import trash2 from "lucide-static/icons/trash-2.svg?raw";
import users from "lucide-static/icons/users.svg?raw";
import x from "lucide-static/icons/x.svg?raw";

const icons = {
  "arrow-right": arrowRight,
  "bar-chart-3": barChart3,
  bell,
  "book-open": bookOpen,
  calendar,
  check,
  "chevron-down": chevronDown,
  "chevron-left": chevronLeft,
  "chevron-right": chevronRight,
  "circle-check": circleCheck,
  "credit-card": creditCard,
  "file-text": fileText,
  house,
  "life-buoy": lifeBuoy,
  "log-out": logOut,
  mail,
  "message-square": messageSquare,
  moon,
  "more-horizontal": moreHorizontal,
  paperclip,
  plus,
  puzzle,
  search,
  settings,
  sun,
  "trending-up": trendingUp,
  "trash-2": trash2,
  users,
  x,
} as const;

export type IconName = keyof typeof icons;

export function iconHtml(name: IconName): string {
  return icons[name];
}

export function mountIcons(root: ParentNode = document): void {
  for (const el of root.querySelectorAll<HTMLElement>("[data-icon]")) {
    const name = el.dataset.icon;
    if (name !== undefined && name in icons) {
      el.innerHTML = icons[name as IconName];
    }
  }
}
