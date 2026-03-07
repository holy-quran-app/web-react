import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Read the Quran",
    description:
      "Browse all 114 Surahs with clear Arabic text and translations.",
    href: "/surah",
  },
  {
    title: "Search Ayahs",
    description:
      "Find specific verses by keyword, surah name, or ayah number.",
    href: "/surah",
  },
  {
    title: "Dark Mode",
    description:
      "Comfortable reading experience in any lighting condition.",
    href: "#",
  },
];

export function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center gap-6 px-4 py-20 text-center md:py-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-transparent" />
        <p className="font-arabic text-2xl text-primary md:text-3xl">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
          The Holy Quran
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Read, explore, and reflect upon the divine words of Allah. A modern,
          accessible web experience for the Noble Quran.
        </p>
        <div className="flex gap-3 pt-4">
          <Button size="lg" asChild>
            <Link to="/surah">Start Reading</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/surah">Browse Surahs</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto grid gap-6 px-4 pb-20 md:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="transition-shadow hover:shadow-md"
          >
            <CardHeader>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </div>
  );
}
