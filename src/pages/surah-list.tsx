import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/seo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Surah } from "@/types/quran";

type RevelationFilter = "all" | "Meccan" | "Medinan";
type SortBy = "number" | "ayahs-desc" | "ayahs-asc" | "name";

export function SurahListPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [revelation, setRevelation] = useState<RevelationFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("number");

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then((res) => res.json())
      .then((data) => {
        setSurahs(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const list = surahs.filter((s) => {
      if (revelation !== "all" && s.revelationType !== revelation) return false;
      if (!q) return true;
      return (
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        s.name.includes(search) ||
        s.number.toString() === search
      );
    });
    const sorted = [...list];
    switch (sortBy) {
      case "ayahs-desc":
        sorted.sort((a, b) => b.numberOfAyahs - a.numberOfAyahs);
        break;
      case "ayahs-asc":
        sorted.sort((a, b) => a.numberOfAyahs - b.numberOfAyahs);
        break;
      case "name":
        sorted.sort((a, b) => a.englishName.localeCompare(b.englishName));
        break;
      default:
        sorted.sort((a, b) => a.number - b.number);
    }
    return sorted;
  }, [surahs, search, revelation, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Seo
        title="All 114 Surahs"
        description="Browse all 114 Surahs of the Holy Quran with Arabic names, English translations, revelation type, and verse counts."
        path="/surah"
      />
      <div className="mb-8 flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Surahs</h1>
          <p className="text-muted-foreground">
            All 114 chapters of the Holy Quran
          </p>
        </div>
        <Input
          placeholder="Search by name, translation, or number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          {(["all", "Meccan", "Medinan"] as RevelationFilter[]).map((r) => (
            <Chip
              key={r}
              active={revelation === r}
              onClick={() => setRevelation(r)}
            >
              {r === "all" ? "All" : r}
            </Chip>
          ))}
          <span className="mx-2 self-center text-muted-foreground">|</span>
          {(
            [
              { key: "number", label: "By number" },
              { key: "name", label: "By name" },
              { key: "ayahs-desc", label: "Longest" },
              { key: "ayahs-asc", label: "Shortest" },
            ] as { key: SortBy; label: string }[]
          ).map((s) => (
            <Chip
              key={s.key}
              active={sortBy === s.key}
              onClick={() => setSortBy(s.key)}
            >
              {s.label}
            </Chip>
          ))}
        </div>
      </div>

      {loading ?
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((surah) => (
            <Link key={surah.number} to={`/surah/${surah.number}`}>
              <Card className="transition-all hover:shadow-md hover:border-primary/30">
                <CardHeader className="flex-row items-center gap-4 space-y-0 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                    {surah.number}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <CardTitle className="text-base">
                      {surah.englishName}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {surah.englishNameTranslation} &middot;{" "}
                      {surah.numberOfAyahs} Ayahs &middot;{" "}
                      {surah.revelationType}
                    </CardDescription>
                  </div>
                  <span className="font-arabic text-xl text-primary">
                    {surah.name}
                  </span>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      }
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={cn(
        "h-8 rounded-full border border-transparent px-3",
        active && "shadow-sm",
      )}
    >
      {children}
    </Button>
  );
}
