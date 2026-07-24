import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { REVIEW_METHODS } from "@/lib/memorization";
import { METHOD_ICONS } from "@/components/memorization/method-icons";
import type { ReviewMethodId } from "@/types/memorization";

interface Props {
  selected: ReviewMethodId | null;
  onChoose: (id: ReviewMethodId) => void;
}

export function MethodSelector({ selected, onChoose }: Props) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {REVIEW_METHODS.map((method) => {
        const Icon = METHOD_ICONS[method.id];
        const isSelected = selected === method.id;
        return (
          <Card
            key={method.id}
            className={cn(
              "flex flex-col gap-4 p-6 transition-all",
              isSelected
                ? "border-primary ring-1 ring-primary/40"
                : "hover:border-primary/30 hover:shadow-md",
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold leading-tight">{method.name}</h3>
                {method.arabicName && (
                  <p
                    className="font-arabic text-sm text-primary"
                    dir="rtl"
                    lang="ar"
                  >
                    {method.arabicName}
                  </p>
                )}
              </div>
            </div>

            <p className="text-sm font-medium text-foreground/90">{method.tagline}</p>
            <p className="text-sm text-muted-foreground">{method.description}</p>

            <ul className="flex flex-col gap-2">
              {method.howItWorks.map((step) => (
                <li key={step} className="flex gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>

            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground/80">Best for: </span>
              {method.bestFor}
            </p>

            <Button
              className="mt-auto w-full"
              variant={isSelected ? "outline" : "default"}
              disabled={isSelected}
              onClick={() => onChoose(method.id)}
            >
              {isSelected ? "Current method" : "Choose this method"}
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
