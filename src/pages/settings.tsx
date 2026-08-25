import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useTheme } from "@/hooks/use-theme";
import { useTajweed } from "@/hooks/use-tajweed";
import { useReadingSettings } from "@/hooks/use-reading-settings";
import type {
  ArabicFontSize,
  TranslationFontSize,
} from "@/context/reading-settings-context";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { tajweedEnabled, setTajweedEnabled } = useTajweed();
  const {
    arabicFontSize,
    setArabicFontSize,
    translationFontSize,
    setTranslationFontSize,
    showTranslation,
    setShowTranslation,
  } = useReadingSettings();

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Seo title="Settings" noindex />
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Customize your reading experience
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="gap-3 p-5">
            <div>
              <CardTitle className="text-base">Theme</CardTitle>
              <CardDescription>Light or dark appearance</CardDescription>
            </div>
            <div className="flex gap-2">
              {(["light", "dark", "system"] as const).map((t) => (
                <Button
                  key={t}
                  size="sm"
                  variant={theme === t ? "default" : "outline"}
                  onClick={() => setTheme(t)}
                  className="border border-transparent"
                >
                  {t[0].toUpperCase() + t.slice(1)}
                </Button>
              ))}
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="gap-3 p-5">
            <div>
              <CardTitle className="text-base">Tajweed Colors</CardTitle>
              <CardDescription>
                Highlight tajweed rules in the Arabic text
              </CardDescription>
            </div>
            <div>
              <Button
                size="sm"
                variant={tajweedEnabled ? "default" : "outline"}
                onClick={() => setTajweedEnabled(!tajweedEnabled)}
                className="border border-transparent"
              >
                {tajweedEnabled ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="gap-3 p-5">
            <div>
              <CardTitle className="text-base">Arabic Font Size</CardTitle>
              <CardDescription>
                Controls the Quranic script size
              </CardDescription>
            </div>
            <Select
              value={arabicFontSize}
              onValueChange={(v) => setArabicFontSize(v as ArabicFontSize)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="gap-3 p-5">
            <div>
              <CardTitle className="text-base">Translation</CardTitle>
              <CardDescription>
                Show or hide translations, and adjust their size
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant={showTranslation ? "default" : "outline"}
                onClick={() => setShowTranslation(!showTranslation)}
                className="border border-transparent w-18"
              >
                {showTranslation ? "Visible" : "Hidden"}
              </Button>
              <Select
                value={translationFontSize}
                onValueChange={(v) =>
                  setTranslationFontSize(v as TranslationFontSize)
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="gap-3 p-5">
            <div>
              <CardTitle className="text-base">Keyboard Shortcuts</CardTitle>
              <CardDescription>Available while reading a surah</CardDescription>
            </div>
            <ul className="grid grid-cols-1 gap-1 text-sm text-muted-foreground sm:grid-cols-2">
              <li>
                <kbd className="rounded-sm border px-1.5">Space</kbd> Play /
                Pause
              </li>
              <li>
                <kbd className="rounded-sm border px-1.5">J</kbd> Next ayah
              </li>
              <li>
                <kbd className="rounded-sm border px-1.5">K</kbd> Previous ayah
              </li>
              <li>
                <kbd className="rounded-sm border px-1.5">N</kbd> Next surah
              </li>
              <li>
                <kbd className="rounded-sm border px-1.5">P</kbd> Previous surah
              </li>
              <li>
                <kbd className="rounded-sm border px-1.5">/</kbd> Focus search
              </li>
            </ul>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
