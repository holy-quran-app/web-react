import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TOTAL_HIZB_QUARTERS = 240;

export function HizbListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<number | null>(null);

  const go = async (quarter: number) => {
    setLoading(quarter);
    try {
      const res = await fetch(
        `https://api.alquran.cloud/v1/hizbQuarter/${quarter}/quran-uthmani`,
      );
      const json = await res.json();
      const first = json.data.ayahs?.[0];
      if (first) {
        navigate(`/surah/${first.surah.number}/${first.numberInSurah}`);
        return;
      }
    } catch {
      // ignore
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Hizb Quarters</h1>
        <p className="text-muted-foreground">
          240 hizb-quarters (4 per hizb, 8 per juz)
        </p>
      </div>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12">
        {Array.from({ length: TOTAL_HIZB_QUARTERS }, (_, i) => i + 1).map((q) => {
          const hizb = Math.ceil(q / 4);
          const pos = ((q - 1) % 4) + 1;
          return (
            <Button
              key={q}
              variant="outline"
              size="sm"
              disabled={loading === q}
              onClick={() => go(q)}
              title={`Hizb ${hizb} · ¼ ${pos}`}
              className="h-10"
            >
              {q}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
