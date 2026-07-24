import { BookMarked, CalendarCheck, Flame, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { MemorizationStats } from "@/lib/memorization";

interface Props {
  stats: MemorizationStats;
  todayDone: number;
  todayTotal: number;
}

interface Tile {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
}

export function ProgressStats({ stats, todayDone, todayTotal }: Props) {
  const tiles: Tile[] = [
    {
      icon: Flame,
      label: "Streak",
      value: `${stats.streak}`,
      hint: stats.streak === 1 ? "day" : "days",
    },
    {
      icon: CalendarCheck,
      label: "Today",
      value: todayTotal ? `${todayDone}/${todayTotal}` : "—",
      hint: todayTotal ? "reviewed" : "nothing due",
    },
    {
      icon: BookMarked,
      label: "Memorized",
      value: `${stats.memorizedCount}`,
      hint: stats.memorizedCount === 1 ? "surah" : "surahs",
    },
    {
      icon: TrendingUp,
      label: "Of the Quran",
      value: `${stats.percentComplete}%`,
      hint: `${stats.ayahsMemorized.toLocaleString()} ayahs`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map((tile) => (
        <Card key={tile.label} className="gap-0 p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <tile.icon className="size-4 text-primary" />
            <span className="text-xs font-medium">{tile.label}</span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums">
            {tile.value}
          </p>
          <p className="text-xs text-muted-foreground">{tile.hint}</p>
        </Card>
      ))}
    </div>
  );
}
