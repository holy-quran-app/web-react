import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePinnedAyah } from "@/hooks/use-pinned-ayah";
import { navItems, isNavItemActive } from "./nav-items";
import { QuranLogo } from "./logo";

/**
 * Hamburger button + slide-in sidebar navigation for mobile. Rendered only
 * below the `md` breakpoint; on larger screens the inline header nav is used.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { pinnedAyah } = usePinnedAyah();

  // Every nav link calls this on tap, so the sidebar closes on selection
  // whether or not the destination route actually changes.
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-72 gap-0 p-0">
        <SheetHeader className="border-b border-border/40">
          <Link to="/" onClick={close} className="flex items-center gap-3">
            <QuranLogo className="h-8 w-8 text-primary" />
            <SheetTitle
              className="font-arabic text-lg font-semibold text-primary"
              dir="rtl"
              lang="ar"
            >
              القرآن الكريم
            </SheetTitle>
          </Link>
          <SheetDescription className="sr-only">
            Main navigation menu
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-1 overflow-y-auto p-3">
          {navItems.map((item) => (
            <Button
              key={item.to}
              variant="ghost"
              asChild
              className={cn(
                "h-11 justify-start text-base",
                isNavItemActive(item, pathname) && "bg-accent/60",
              )}
            >
              <Link to={item.to} onClick={close}>
                {item.label}
              </Link>
            </Button>
          ))}

          {pinnedAyah && (
            <Button
              variant="ghost"
              asChild
              className="h-11 justify-start text-base"
            >
              <Link
                to={`/surah/${pinnedAyah.surahNumber}`}
                onClick={close}
                title={`Continue reading: ${pinnedAyah.surahName} - Ayah ${pinnedAyah.ayahNumberInSurah}`}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Continue Reading
              </Link>
            </Button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
