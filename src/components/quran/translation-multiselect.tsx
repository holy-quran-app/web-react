import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TranslationEdition } from "@/types/quran";

interface Props {
  availableEditions: TranslationEdition[];
  selected: string[];
  onToggle: (identifier: string) => void;
}

export function TranslationMultiselect({ availableEditions, selected, onToggle }: Props) {
  const [open, setOpen] = useState(false);

  const label =
    selected.length === 0
      ? "No Translations"
      : selected.length === 1
        ? availableEditions.find((e) => e.identifier === selected[0])?.englishName ??
          selected[0]
        : `${selected.length} translations`;

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-64 justify-between"
      >
        <span className="truncate">{label}</span>
        <ChevronDown className="size-4 shrink-0 opacity-60" />
      </Button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="listbox"
            aria-multiselectable="true"
            className="absolute left-0 top-full z-50 mt-1 max-h-72 w-72 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
          >
            {availableEditions.map((ed) => {
              const isSelected = selected.includes(ed.identifier);
              return (
                <button
                  key={ed.identifier}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onToggle(ed.identifier)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground",
                    isSelected && "bg-accent/50",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-sm border",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/40",
                    )}
                  >
                    {isSelected && <Check className="size-3" />}
                  </span>
                  <span className="truncate">{ed.englishName}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
