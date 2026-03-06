import { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSurah } from "@/hooks/use-surah";
import { useTajweed } from "@/hooks/use-tajweed";
import { useRecitation } from "@/hooks/use-recitation";
import { AyahCard } from "@/components/quran/ayah-card";
import { RecitationPlayer } from "@/components/quran/recitation-player";

export function SurahDetailPage() {
  const { number } = useParams<{ number: string }>();
  const { tajweedEnabled, setTajweedEnabled } = useTajweed();
  const { surah, tajweedTexts, loading } = useSurah(number, tajweedEnabled);

  const surahNumber = Number(number);
  const ayahs = surah?.ayahs ?? [];

  const recitation = useRecitation(surahNumber, ayahs);

  const ayahRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Scroll to the currently playing ayah
  useEffect(() => {
    if (recitation.currentAyahIndex === null) return;
    const el = ayahRefs.current.get(recitation.currentAyahIndex);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [recitation.currentAyahIndex]);

  if (loading) {
    return (
      <div className="container mx-auto space-y-4 px-4 py-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <div className="space-y-3 pt-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Surah not found</h2>
        <Button asChild>
          <Link to="/surah">Back to Surahs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="container mx-auto flex-1 px-4 py-8">
        {/* Surah header */}
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <h1 className="font-arabic text-4xl text-primary">{surah.name}</h1>
          <h2 className="text-2xl font-bold tracking-tight">
            {surah.englishName}
          </h2>
          <p className="text-muted-foreground">
            {surah.englishNameTranslation} &middot; {surah.numberOfAyahs} Ayahs
            &middot; {surah.revelationType}
          </p>
          <div className="flex items-center gap-2 pt-2">
            {surahNumber > 1 && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/surah/${surahNumber - 1}`}>Previous Surah</Link>
              </Button>
            )}
            {surahNumber < 114 && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/surah/${surahNumber + 1}`}>Next Surah</Link>
              </Button>
            )}
            <Button
              variant={tajweedEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setTajweedEnabled(!tajweedEnabled)}
              aria-label={tajweedEnabled ? "Disable Tajweed colors" : "Enable Tajweed colors"}
              className="gap-1.5"
            >
              <TajweedIcon className="size-4" />
              Tajweed
            </Button>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Bismillah for all surahs except At-Tawbah (9) */}
        {surah.number !== 9 && surah.number !== 1 && (
          <p className="mb-8 text-center font-arabic text-2xl leading-loose text-primary/80">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        )}

        {/* Ayahs */}
        <ScrollArea className="h-auto">
          <div className="space-y-4">
            {surah.ayahs.map((ayah, index) => (
              <div
                key={ayah.number}
                ref={(el) => {
                  if (el) {
                    ayahRefs.current.set(index, el);
                  } else {
                    ayahRefs.current.delete(index);
                  }
                }}
              >
                <AyahCard
                  ayah={ayah}
                  index={index}
                  isCurrentlyPlaying={
                    recitation.currentAyahIndex === index &&
                    recitation.isPlaying
                  }
                  isLoading={
                    recitation.currentAyahIndex === index &&
                    recitation.isLoading
                  }
                  onPlay={recitation.playAyah}
                  onTogglePlayPause={recitation.togglePlayPause}
                  tajweedText={
                    tajweedEnabled
                      ? tajweedTexts?.get(ayah.numberInSurah)
                      : undefined
                  }
                />
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Bottom navigation */}
        <div className="mt-8 flex justify-between">
          {surahNumber > 1 ? (
            <Button variant="outline" asChild>
              <Link to={`/surah/${surahNumber - 1}`}>Previous Surah</Link>
            </Button>
          ) : (
            <div />
          )}
          {surahNumber < 114 && (
            <Button variant="outline" asChild>
              <Link to={`/surah/${surahNumber + 1}`}>Next Surah</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Sticky recitation player */}
      <RecitationPlayer
        isPlaying={recitation.isPlaying}
        isLoading={recitation.isLoading}
        currentAyahIndex={recitation.currentAyahIndex}
        totalAyahs={ayahs.length}
        progress={recitation.progress}
        duration={recitation.duration}
        reciter={recitation.reciter}
        onPlaySurah={recitation.playSurah}
        onTogglePlayPause={recitation.togglePlayPause}
        onStop={recitation.stop}
        onPlayAyah={recitation.playAyah}
        onReciterChange={recitation.setReciter}
      />
    </div>
  );
}

function TajweedIcon({ className }: { className?: string }) {
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
      <path d="M12 2v4" />
      <path d="m6.8 15-3.5 2" />
      <path d="m20.7 17-3.5-2" />
      <path d="M6.5 8.5c1.6-1.6 4-2.2 6.2-1.5" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 15v4" />
      <circle cx="12" cy="12" r="8" strokeDasharray="4 2" />
    </svg>
  );
}
