import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  arabicText: string;
  translations: { label: string; text: string }[];
  surahNumber: number;
  surahName: string;
  ayahNumberInSurah: number;
}

export function AyahActions({
  arabicText,
  translations,
  surahNumber,
  surahName,
  ayahNumberInSurah,
}: Props) {
  const [copied, setCopied] = useState(false);

  const reference = `— ${surahName} ${surahNumber}:${ayahNumberInSurah}`;
  const buildText = () => {
    const lines = [arabicText];
    for (const t of translations) {
      if (t.text) lines.push(`${t.label}: ${t.text}`);
    }
    lines.push(reference);
    return lines.join("\n\n");
  };

  const shareUrl = `${window.location.origin}${import.meta.env.BASE_URL}surah/${surahNumber}/${ayahNumberInSurah}`.replace(
    /\/\/surah/,
    "/surah",
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${buildText()}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const share = async () => {
    const data = {
      title: `${surahName} ${surahNumber}:${ayahNumberInSurah}`,
      text: buildText(),
      url: shareUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        // user cancelled
      }
    } else {
      copy();
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={copy}
        aria-label="Copy ayah"
        className="text-muted-foreground hover:text-primary"
      >
        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={share}
        aria-label="Share ayah"
        className="text-muted-foreground hover:text-primary"
      >
        <Share2 className="size-3" />
      </Button>
    </div>
  );
}
