import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/theme-provider";
import { TajweedProvider } from "@/context/tajweed-provider";
import { ReadingSettingsProvider } from "@/context/reading-settings-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RootLayout } from "@/components/layout/root-layout";
import { HomePage } from "@/pages/home";
import { SurahListPage } from "@/pages/surah-list";
import { SurahDetailPage } from "@/pages/surah-detail";
import { JuzListPage } from "@/pages/juz-list";
import { PageListPage } from "@/pages/page-list";
import { HizbListPage } from "@/pages/hizb-list";
import { MemorizePage } from "@/pages/memorize";
import { BookmarksPage } from "@/pages/bookmarks";
import { SearchPage } from "@/pages/search";
import { SettingsPage } from "@/pages/settings";
import { NotFoundPage } from "@/pages/not-found";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <TajweedProvider>
        <ReadingSettingsProvider>
          <TooltipProvider>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
              <Routes>
                <Route element={<RootLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="surah" element={<SurahListPage />} />
                  <Route path="surah/:number" element={<SurahDetailPage />} />
                  <Route path="surah/:number/:ayah" element={<SurahDetailPage />} />
                  <Route path="juz" element={<JuzListPage />} />
                  <Route path="page" element={<PageListPage />} />
                  <Route path="hizb" element={<HizbListPage />} />
                  <Route path="memorize" element={<MemorizePage />} />
                  <Route path="bookmarks" element={<BookmarksPage />} />
                  <Route path="search" element={<SearchPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ReadingSettingsProvider>
      </TajweedProvider>
    </ThemeProvider>
  );
}
