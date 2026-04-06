import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useBookmarks } from "@/hooks/use-bookmarks";

export function BookmarksPage() {
  const { bookmarks, removeBookmark, clearAll } = useBookmarks();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookmarks</h1>
          <p className="text-muted-foreground">
            {bookmarks.length === 0
              ? "You haven't saved any ayahs yet."
              : `${bookmarks.length} saved ayah${bookmarks.length === 1 ? "" : "s"}`}
          </p>
        </div>
        {bookmarks.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearAll}>
            Clear all
          </Button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="text-muted-foreground">
            Open a surah and tap the bookmark icon on any ayah to save it here.
          </p>
          <Button asChild className="mt-4">
            <Link to="/surah">Browse Surahs</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((b) => (
            <Card
              key={b.id}
              className="transition-all hover:border-primary/30 hover:shadow-md"
            >
              <CardHeader className="flex-row items-center gap-3 space-y-0 p-4">
                <Link
                  to={`/surah/${b.surahNumber}/${b.ayahNumberInSurah}`}
                  className="flex flex-1 items-center gap-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                    {b.surahNumber}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">
                      {b.surahName} · Ayah {b.ayahNumberInSurah}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Saved {new Date(b.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeBookmark(b.surahNumber, b.ayahNumberInSurah)}
                  aria-label="Remove bookmark"
                >
                  <Trash2 className="size-4" />
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
