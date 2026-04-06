import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface SearchMatch {
  number: number;
  text: string;
  numberInSurah: number;
  surah: {
    number: number;
    englishName: string;
    name: string;
  };
}

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const [input, setInput] = useState(query);
  const [matches, setMatches] = useState<SearchMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!query.trim()) {
      queueMicrotask(() => {
        if (!cancelled) setMatches([]);
      });
      return () => {
        cancelled = true;
      };
    }
    queueMicrotask(() => {
      if (!cancelled) {
        setLoading(true);
        setError(false);
      }
    });
    fetch(
      `https://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/all/en`,
    )
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.code === 200 && json.data?.matches) {
          setMatches(json.data.matches as SearchMatch[]);
        } else {
          setMatches([]);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Search</h1>
        <p className="text-muted-foreground">
          Search English translations of the entire Quran
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setParams(input.trim() ? { q: input.trim() } : {});
        }}
        className="mb-6 flex gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. mercy, paradise, Moses..."
          className="max-w-md"
        />
        <Button type="submit">
          <SearchIcon className="size-4" />
          Search
        </Button>
      </form>

      {loading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Searching...
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive">
          Something went wrong. Try a different query.
        </p>
      )}
      {!loading && !error && query && matches.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No matches found for &ldquo;{query}&rdquo;.
        </p>
      )}
      {matches.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            {matches.length} match{matches.length === 1 ? "" : "es"}
          </p>
          {matches.map((m) => (
            <Link
              key={`${m.surah.number}-${m.numberInSurah}`}
              to={`/surah/${m.surah.number}/${m.numberInSurah}`}
            >
              <Card className="transition-all hover:border-primary/30 hover:shadow-md">
                <CardHeader className="gap-1 p-4">
                  <CardTitle className="text-sm text-primary">
                    {m.surah.englishName} · Ayah {m.numberInSurah}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-foreground/80">
                    {m.text}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
