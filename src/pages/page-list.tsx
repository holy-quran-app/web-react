import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";

const TOTAL_PAGES = 604;

export function PageListPage() {
  const navigate = useNavigate();
  const [loadingPage, setLoadingPage] = useState<number | null>(null);

  const goToPage = async (page: number) => {
    setLoadingPage(page);
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/page/${page}/quran-uthmani`);
      const json = await res.json();
      const first = json.data.ayahs?.[0];
      if (first) {
        navigate(`/surah/${first.surah.number}/${first.numberInSurah}`);
        return;
      }
    } catch {
      // ignore
    } finally {
      setLoadingPage(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Seo
        title="Browse by Page"
        description="Read the Holy Quran page by page, following the standard 604-page Mushaf layout."
        path="/page"
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Mushaf Pages</h1>
        <p className="text-muted-foreground">Jump to any of the 604 pages</p>
      </div>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12">
        {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant="outline"
            size="sm"
            disabled={loadingPage === page}
            onClick={() => goToPage(page)}
            className="h-10"
          >
            {page}
          </Button>
        ))}
      </div>
    </div>
  );
}
