import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  isBookmarked: boolean;
  onToggle: () => void;
}

export function BookmarkButton({ isBookmarked, onToggle }: Props) {
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={onToggle}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      className={cn(
        "text-muted-foreground hover:text-primary",
        isBookmarked && "text-primary",
      )}
    >
      <Bookmark className={cn("size-3", isBookmarked && "fill-current")} />
    </Button>
  );
}
