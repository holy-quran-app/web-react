import { Link } from "react-router-dom";
import { Seo } from "@/components/seo";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-4 py-32 text-center">
      <Seo title="Page Not Found" noindex />
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-xl text-muted-foreground">Page not found</p>
      <Button asChild>
        <Link to="/">Return Home</Link>
      </Button>
    </div>
  );
}
