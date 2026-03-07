import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { usePinnedAyah } from "@/hooks/use-pinned-ayah";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { pinnedAyah } = usePinnedAyah();

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
          <div className="flex flex-col">
            <span className="text-lg font-semibold leading-tight tracking-tight">
              Holy Quran
            </span>
            <span className="font-arabic text-xs text-muted-foreground leading-tight">
              القرآن الكريم
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">Home</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/surah">Surahs</Link>
          </Button>
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
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>
        </nav>
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

function QuranLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="currentColor"
      className={className}
    >
      <path d="m40.4978 31.68475c5.78886.05 12.41759-2.73946 12.69756-2.85943a.93777.93777 0 0 0 .51986-1.1398c-.97517-3.12652-3.56631-11.54425-4.47914-14.50719a.96584.96584 0 0 0 -1.41968-.50983 16.885 16.885 0 0 1 -7.76853 1.53964 12.13626 12.13626 0 0 0 -7.04863 1.83963c.019 1.01746 0 18.57642 0 18.57642a10.91147 10.91147 0 0 1 7.49856-2.93944z" />
      <path d="m10.80351 28.82532c.28.12 6.88868 2.89946 12.69756 2.85943a11.05041 11.05041 0 0 1 7.49858 2.93943v-18.56642c-.24995-.14994-.52993-.30994-.82986-.45988a11.9167 11.9167 0 0 0 -6.21879-1.38974 16.95808 16.95808 0 0 1 -7.76852-1.53968 1.00571 1.00571 0 0 0 -.88985-.07c-.49668.16276-.601.83551-.73983 1.25978-.77228 2.52641-3.44506 11.16712-4.26916 13.82727a.93779.93779 0 0 0 .51987 1.13981z" />
      <path d="m59.95407 31.22488-5.669-18.2665a1.00571 1.00571 0 0 0 -1.32971-.62987l-1.67966.68985 4.34914 14.07731a2.91576 2.91576 0 0 1 -1.6397 3.55931c-.28992.13-7.1686 3.09938-13.4974 3.02938a8.64949 8.64949 0 0 0 -4.55912 1.23983c-1.77328 1.023-1.55461 1.54848-2.92938 2.12959a2.9504 2.9504 0 0 1 -3.19943-.80993 9.404 9.404 0 0 0 -6.26874-2.55942c-6.33883.05-13.22752-2.89947-13.51744-3.02945a2.91576 2.91576 0 0 1 -1.63963-3.55931l4.34914-14.07731-1.67967-.68987a1.0019 1.0019 0 0 0 -1.32969.62991l-5.66898 18.26648a1.0015 1.0015 0 0 0 .68989 1.24975s21.79108 6.173 23.19553 6.56874c.96479.26013 1.09956.97014 1.46965 1.73972.39719.61541 1.61354.32882 2.26962.38992h2.13959a1.01325 1.01325 0 0 0 .97979-.77988 1.82605 1.82605 0 0 1 1.27979-1.34971c5.54124-1.57314 17.5251-4.964 23.19555-6.56874a1.00122 1.00122 0 0 0 .68986-1.2498z" />
      <path d="m27.69027 41.84283a3.23286 3.23286 0 0 1 -.4-.90986c-1.4671-.415-6.8387-1.92765-8.19837-2.31956v3.07942a.96168.96168 0 0 1 -.29.67986l-4.57914 4.36916c-.96631.79178-.84327 2.27335-.82972 3.3894a1.62958 1.62958 0 0 0 2.46944 1.36963l13.60734-8.40829a3.07388 3.07388 0 0 1 -1.77955-1.24976z" />
      <path d="m45.1969 42.37269a.96168.96168 0 0 1 -.29-.67986v-3.07942l-1.99961.5699-6.19874 1.74969a3.00423 3.00423 0 0 1 -2.16963 2.15961l13.59742 8.40836a1.62964 1.62964 0 0 0 2.46947-1.36978c.00792-1.12127.13979-2.594-.82987-3.38928z" />
    </svg>
  );
}
