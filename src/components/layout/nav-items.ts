export interface NavItem {
  to: string;
  label: string;
  /** Match the pathname exactly instead of by prefix. */
  exact?: boolean;
  /**
   * Extra classes controlling how/when the item shows in the desktop header
   * bar. Ignored by the mobile sidebar, which always lists every item.
   */
  desktopClassName?: string;
}

/**
 * Single source of truth for the primary navigation. Consumed by both the
 * desktop header (`Header`) and the mobile sidebar (`MobileNav`).
 */
export const navItems: NavItem[] = [
  { to: "/", label: "Home", exact: true },
  { to: "/surah", label: "Surahs" },
  { to: "/juz", label: "Juz", desktopClassName: "hidden md:inline-flex" },
  { to: "/page", label: "Pages", desktopClassName: "hidden md:inline-flex" },
  { to: "/hizb", label: "Hizb", desktopClassName: "hidden lg:inline-flex" },
  { to: "/bookmarks", label: "Bookmarks" },
  { to: "/search", label: "Search" },
  {
    to: "/settings",
    label: "Settings",
    desktopClassName: "hidden md:inline-flex",
  },
];

export function isNavItemActive(item: NavItem, pathname: string): boolean {
  return item.exact ? pathname === item.to : pathname.includes(item.to);
}
