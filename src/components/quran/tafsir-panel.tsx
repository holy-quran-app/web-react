import { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  text: string | undefined;
  loading: boolean;
  isArabic?: boolean;
}

export function TafsirPanel({ text, loading, isArabic }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-2 border-t border-border/50 pt-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        <ChevronDown
          className={cn("size-3 transition-transform", open && "rotate-180")}
        />
        Tafsir
      </button>
      {open && (
        <div className="mt-2 rounded-md bg-muted/40 p-3 text-sm leading-relaxed">
          {loading && !text ? (
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-3 animate-spin" /> Loading tafsir...
            </span>
          ) : text ? (
            <p
              className={cn(isArabic && "font-arabic text-right text-lg leading-loose")}
              dir={isArabic ? "rtl" : "ltr"}
              lang={isArabic ? "ar" : undefined}
            >
              {text}
            </p>
          ) : (
            <span className="text-xs text-muted-foreground">
              Tafsir not available for this ayah.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
