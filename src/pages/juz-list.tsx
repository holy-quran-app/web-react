import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Juz -> first surah/ayah (standard Hafs division)
const JUZ_STARTS: { juz: number; surah: number; ayah: number; label: string }[] = [
  { juz: 1, surah: 1, ayah: 1, label: "Al-Fatiha 1" },
  { juz: 2, surah: 2, ayah: 142, label: "Al-Baqarah 142" },
  { juz: 3, surah: 2, ayah: 253, label: "Al-Baqarah 253" },
  { juz: 4, surah: 3, ayah: 93, label: "Al-Imran 93" },
  { juz: 5, surah: 4, ayah: 24, label: "An-Nisa 24" },
  { juz: 6, surah: 4, ayah: 148, label: "An-Nisa 148" },
  { juz: 7, surah: 5, ayah: 82, label: "Al-Maidah 82" },
  { juz: 8, surah: 6, ayah: 111, label: "Al-Anam 111" },
  { juz: 9, surah: 7, ayah: 88, label: "Al-Araf 88" },
  { juz: 10, surah: 8, ayah: 41, label: "Al-Anfal 41" },
  { juz: 11, surah: 9, ayah: 93, label: "At-Tawbah 93" },
  { juz: 12, surah: 11, ayah: 6, label: "Hud 6" },
  { juz: 13, surah: 12, ayah: 53, label: "Yusuf 53" },
  { juz: 14, surah: 15, ayah: 1, label: "Al-Hijr 1" },
  { juz: 15, surah: 17, ayah: 1, label: "Al-Isra 1" },
  { juz: 16, surah: 18, ayah: 75, label: "Al-Kahf 75" },
  { juz: 17, surah: 21, ayah: 1, label: "Al-Anbiya 1" },
  { juz: 18, surah: 23, ayah: 1, label: "Al-Muminun 1" },
  { juz: 19, surah: 25, ayah: 21, label: "Al-Furqan 21" },
  { juz: 20, surah: 27, ayah: 56, label: "An-Naml 56" },
  { juz: 21, surah: 29, ayah: 46, label: "Al-Ankabut 46" },
  { juz: 22, surah: 33, ayah: 31, label: "Al-Ahzab 31" },
  { juz: 23, surah: 36, ayah: 28, label: "Ya-Sin 28" },
  { juz: 24, surah: 39, ayah: 32, label: "Az-Zumar 32" },
  { juz: 25, surah: 41, ayah: 47, label: "Fussilat 47" },
  { juz: 26, surah: 46, ayah: 1, label: "Al-Ahqaf 1" },
  { juz: 27, surah: 51, ayah: 31, label: "Adh-Dhariyat 31" },
  { juz: 28, surah: 58, ayah: 1, label: "Al-Mujadila 1" },
  { juz: 29, surah: 67, ayah: 1, label: "Al-Mulk 1" },
  { juz: 30, surah: 78, ayah: 1, label: "An-Naba 1" },
];

export function JuzListPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Juz</h1>
        <p className="text-muted-foreground">30 parts (ajzāʾ) of the Quran</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {JUZ_STARTS.map((j) => (
          <Link key={j.juz} to={`/surah/${j.surah}/${j.ayah}`}>
            <Card className="transition-all hover:border-primary/30 hover:shadow-md">
              <CardHeader className="flex-row items-center gap-4 space-y-0 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                  {j.juz}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base">Juz {j.juz}</CardTitle>
                  <CardDescription className="text-xs">Starts at {j.label}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
