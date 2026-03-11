import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RootLayout } from "@/components/layout/root-layout";
import { HomePage } from "@/pages/home";
import { SurahListPage } from "@/pages/surah-list";
import { SurahDetailPage } from "@/pages/surah-detail";
import { NotFoundPage } from "@/pages/not-found";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route element={<RootLayout />}>
              <Route index element={<HomePage />} />
              <Route path="surah" element={<SurahListPage />} />
              <Route path="surah/:number" element={<SurahDetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  );
}
