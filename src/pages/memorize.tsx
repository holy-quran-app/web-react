import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MethodSelector } from "@/components/memorization/method-selector";
import { METHOD_ICONS } from "@/components/memorization/method-icons";
import { ProgressStats } from "@/components/memorization/progress-stats";
import { TodayPlan } from "@/components/memorization/today-plan";
import { AddSurahSheet } from "@/components/memorization/add-surah-sheet";
import { MemorizedList } from "@/components/memorization/memorized-list";
import { useMemorization } from "@/hooks/use-memorization";
import { getMethodInfo } from "@/lib/memorization";
import { cn } from "@/lib/utils";

const CYCLE_OPTIONS = [5, 7, 10, 15, 30];

export function MemorizePage() {
  const {
    state,
    plan,
    stats,
    reviewedIds,
    setMethod,
    setCycleLength,
    addSurah,
    removeSurah,
    setStatus,
    setAyahRange,
    setNotes,
    toggleReviewed,
    rate,
    resetAll,
  } = useMemorization();

  const [showMethods, setShowMethods] = useState(false);

  const existingNumbers = new Set(state.entries.map((e) => e.surahNumber));
  const todayDone = plan
    ? plan.sections.reduce(
        (sum, s) => sum + s.entries.filter((e) => reviewedIds.has(e.surahNumber)).length,
        0,
      )
    : 0;

  const methodInfo = state.method ? getMethodInfo(state.method) : null;
  const MethodIcon = state.method ? METHOD_ICONS[state.method] : null;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Memorization Tracker</h1>
        <p className="text-muted-foreground">
          Choose a proven review method and follow a daily plan to memorize the Quran and
          keep it strong.
        </p>
      </div>

      {/* No method chosen yet — introduce and let the user pick one */}
      {!state.method && (
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">
              Pick one of the three most widely used Hifz review systems below. Stick with
              a single method for at least a few weeks — consistency is what builds lasting
              retention.
            </p>
          </div>
          <MethodSelector selected={null} onChoose={setMethod} />
        </div>
      )}

      {/* Method chosen — show the dashboard */}
      {state.method && methodInfo && (
        <div className="flex flex-col gap-8">
          {/* Current method bar */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                {MethodIcon && (
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MethodIcon className="size-5" />
                  </div>
                )}
                <div>
                  <span className="text-xs text-muted-foreground">Review method</span>
                  <p className="font-semibold leading-tight">{methodInfo.name}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowMethods((v) => !v)}>
                {showMethods ? "Close" : "Change method"}
              </Button>
            </div>
            {showMethods && (
              <div className="mt-4">
                <MethodSelector
                  selected={state.method}
                  onChoose={(id) => {
                    setMethod(id);
                    setShowMethods(false);
                  }}
                />
              </div>
            )}
          </div>

          <ProgressStats
            stats={stats}
            todayDone={todayDone}
            todayTotal={plan?.totalItems ?? 0}
          />

          {/* Today's plan */}
          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Today's review</h2>
                <p className="text-sm text-muted-foreground">{methodInfo.tagline}</p>
              </div>
              {state.method === "cycle" && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Cycle length</span>
                  <div className="flex items-center gap-0.5 rounded-lg border p-0.5">
                    {CYCLE_OPTIONS.map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setCycleLength(n)}
                        className={cn(
                          "rounded-md px-2 py-1 text-xs font-medium tabular-nums transition-colors",
                          state.cycleLength === n
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {n}d
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {plan && (
              <TodayPlan
                plan={plan}
                reviewedIds={reviewedIds}
                onToggle={toggleReviewed}
                onRate={rate}
              />
            )}
          </section>

          {/* My memorization */}
          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">My memorization</h2>
                <p className="text-sm text-muted-foreground">
                  {state.entries.length === 0
                    ? "Add the surahs you are working on to build your plan."
                    : `${stats.memorizedCount} memorized · ${stats.learningCount} in progress`}
                </p>
              </div>
              <AddSurahSheet
                existingNumbers={existingNumbers}
                onAdd={addSurah}
                onRemove={removeSurah}
                trigger={
                  <Button size="sm">
                    <Plus className="size-4" /> Add surah
                  </Button>
                }
              />
            </div>

            {state.entries.length === 0 ? (
              <div className="rounded-xl border border-dashed p-10 text-center">
                <p className="text-muted-foreground">
                  You haven't added any surahs yet. Add ones you're learning or have
                  already memorized to start your review plan.
                </p>
                <AddSurahSheet
                  existingNumbers={existingNumbers}
                  onAdd={addSurah}
                  onRemove={removeSurah}
                  trigger={
                    <Button className="mt-4">
                      <Plus className="size-4" /> Add your first surah
                    </Button>
                  }
                />
                <p className="mt-3 text-xs text-muted-foreground">
                  or{" "}
                  <Link to="/surah" className="underline hover:text-primary">
                    browse all surahs
                  </Link>
                </p>
              </div>
            ) : (
              <>
                <MemorizedList
                  entries={state.entries}
                  onSetStatus={setStatus}
                  onSetAyahRange={setAyahRange}
                  onSetNotes={setNotes}
                  onRemove={removeSurah}
                />
                <div className="mt-3 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Reset your tracker? This removes all surahs and progress but keeps your chosen method.",
                        )
                      ) {
                        resetAll();
                      }
                    }}
                  >
                    <RotateCcw className="size-3.5" /> Reset tracker
                  </Button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
