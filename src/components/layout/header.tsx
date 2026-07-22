import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { usePinnedAyah } from "@/hooks/use-pinned-ayah";
import { cn } from "@/lib/utils";
import { navItems, isNavItemActive } from "./nav-items";
import { MobileNav } from "./mobile-nav";
import { QuranLogo } from "./logo";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { pinnedAyah } = usePinnedAyah();

  const { pathname } = useLocation();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center">
            <QuranLogo className="h-9 w-9 text-primary" />
          </div>
          <span
            className="font-arabic text-lg font-semibold text-primary"
            dir="rtl"
            lang="ar"
          >
            القرآن الكريم
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Desktop navigation — collapses into the hamburger menu below md */}
          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <Button
                key={item.to}
                variant="ghost"
                size="sm"
                asChild
                className={cn(
                  item.desktopClassName,
                  isNavItemActive(item, pathname) && "bg-accent/60",
                )}
              >
                <Link to={item.to}>{item.label}</Link>
              </Button>
            ))}

            {pinnedAyah && (
              <Button variant="ghost" size="sm" asChild>
                <Link
                  to={`/surah/${pinnedAyah.surahNumber}`}
                  title={`Continue reading: ${pinnedAyah.surahName} - Ayah ${pinnedAyah.ayahNumberInSurah}`}
                >
                  <BookmarkIcon className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Continue Reading</span>
                </Link>
              </Button>
            )}
          </nav>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ?
              <SunIcon className="h-5 w-5" />
            : <MoonIcon className="h-5 w-5" />}
          </Button>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}
