import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, ChevronRight, Menu, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SectionSummary } from "./backend.d";
import {
  useGetAllSections,
  useGetSection,
  useSearchSections,
} from "./hooks/useQueries";

// ----------------------------------------------------------------
// Debounce hook
// ----------------------------------------------------------------
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// ----------------------------------------------------------------
// Section number display
// ----------------------------------------------------------------
const SECTION_ICONS: Record<number, string> = {
  1: "01",
  2: "02",
  3: "03",
  4: "04",
  5: "05",
  6: "06",
  7: "07",
};

// ----------------------------------------------------------------
// Sidebar Item
// ----------------------------------------------------------------
interface SidebarItemProps {
  section: SectionSummary;
  isActive: boolean;
  isHighlighted: boolean;
  index: number;
  onClick: () => void;
}

function SidebarItem({
  section,
  isActive,
  isHighlighted,
  index,
  onClick,
}: SidebarItemProps) {
  const num = Number(section.id);
  return (
    <motion.button
      data-ocid={`sidebar.section.link.${index}`}
      onClick={onClick}
      className={[
        "w-full text-left px-4 py-3 flex items-start gap-3 transition-all duration-200",
        "rounded-md group relative overflow-hidden",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-handbook",
        isActive
          ? "bg-accent text-foreground"
          : "hover:bg-accent/50 text-muted-foreground hover:text-foreground",
        isHighlighted && !isActive
          ? "ring-1 ring-amber-handbook/50 bg-amber-handbook/5"
          : "",
      ].join(" ")}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
    >
      {/* Active indicator bar */}
      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 rounded-full"
          style={{ background: "oklch(var(--handbook-amber))" }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}

      {/* Section number */}
      <span
        className={[
          "font-mono-code text-xs font-semibold shrink-0 mt-0.5 w-6 text-right",
          isActive ? "text-amber" : "text-amber-dim",
        ].join(" ")}
        aria-hidden="true"
      >
        {SECTION_ICONS[num] ?? String(num).padStart(2, "0")}
      </span>

      {/* Title */}
      <span
        className={[
          "font-sans text-sm leading-snug font-medium",
          isActive ? "text-foreground" : "",
        ].join(" ")}
      >
        {section.title}
        {isHighlighted && !isActive && (
          <span
            className="ml-2 inline-flex items-center text-amber text-xs"
            aria-label="search match"
          >
            ●
          </span>
        )}
      </span>
    </motion.button>
  );
}

// ----------------------------------------------------------------
// Section skeleton
// ----------------------------------------------------------------
function SectionSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-3">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <Separator />
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  );
}

// ----------------------------------------------------------------
// Section content panel
// ----------------------------------------------------------------
interface SectionPanelProps {
  sectionId: bigint | null;
}

function SectionPanel({ sectionId }: SectionPanelProps) {
  const { data: section, isLoading } = useGetSection(sectionId);

  if (sectionId === null) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-8">
        <BookOpen
          className="mb-4 opacity-20"
          size={48}
          style={{ color: "oklch(var(--handbook-amber))" }}
        />
        <p className="font-display text-2xl font-light text-muted-foreground mb-2">
          Select a section
        </p>
        <p className="text-sm text-muted-foreground/60 max-w-xs">
          Choose a topic from the sidebar to begin reading.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 md:p-10">
        <SectionSkeleton />
      </div>
    );
  }

  if (!section) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-8">
        <p className="text-muted-foreground">Section not found.</p>
      </div>
    );
  }

  const sectionNum = Number(section.id);

  return (
    <motion.div
      key={section.id.toString()}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="p-6 md:p-10 max-w-3xl"
    >
      {/* Section header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="font-mono-code text-xs font-semibold tracking-widest uppercase"
            style={{ color: "oklch(var(--handbook-amber))" }}
          >
            Section {String(sectionNum).padStart(2, "0")}
          </span>
          <div
            className="h-px flex-1 max-w-[60px]"
            style={{ background: "oklch(var(--handbook-rule))" }}
          />
        </div>

        <h1
          data-ocid="section.title"
          className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4 leading-tight"
        >
          {section.title}
        </h1>

        <p
          className="text-base leading-relaxed"
          style={{ color: "oklch(var(--handbook-subtitle-text))" }}
        >
          {section.description}
        </p>

        <div
          className="mt-6 h-px"
          style={{ background: "oklch(var(--handbook-rule))" }}
        />
      </header>

      {/* Subsections */}
      <div className="space-y-10">
        {section.subsections.map((sub, idx) => (
          <motion.article
            key={sub.subtitle}
            data-ocid={`section.subsection.item.${idx + 1}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.25 }}
            className="group"
          >
            {/* Subsection title */}
            <div className="flex items-baseline gap-3 mb-3">
              <span
                className="font-mono-code text-xs font-medium shrink-0"
                style={{ color: "oklch(var(--handbook-section-num))" }}
                aria-hidden="true"
              >
                {String(sectionNum).padStart(2, "0")}.
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h2 className="font-display text-lg font-semibold text-foreground leading-snug">
                {sub.subtitle}
              </h2>
            </div>

            {/* Body text */}
            <p
              className="handbook-body-text pl-9 leading-[1.85] tracking-[0.01em]"
              style={{ color: "oklch(var(--handbook-body-text))" }}
            >
              {sub.body}
            </p>

            {/* Bottom rule (except last) */}
            {idx < section.subsections.length - 1 && (
              <div
                className="mt-8 h-px"
                style={{ background: "oklch(var(--handbook-rule) / 0.5)" }}
              />
            )}
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------
// Main App
// ----------------------------------------------------------------
export default function App() {
  const [activeSectionId, setActiveSectionId] = useState<bigint | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: sections = [], isLoading: sectionsLoading } =
    useGetAllSections();
  const { data: searchResults = [] } = useSearchSections(debouncedSearch);

  // Highlighted section IDs from search
  const highlightedIds = new Set(
    debouncedSearch.trim() ? searchResults.map((r) => r.id.toString()) : [],
  );

  // Auto-select first section on load
  useEffect(() => {
    if (sections.length > 0 && activeSectionId === null) {
      setActiveSectionId(sections[0].id);
    }
  }, [sections, activeSectionId]);

  const handleSectionClick = useCallback((id: bigint) => {
    setActiveSectionId(id);
    setSidebarOpen(false);
  }, []);

  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 border-b border-border/60 backdrop-blur-sm"
        style={{ background: "oklch(var(--sidebar) / 0.95)" }}
      >
        <div className="flex items-center gap-4 px-4 md:px-6 h-14">
          {/* Mobile hamburger */}
          <button
            type="button"
            data-ocid="sidebar.toggle.button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-handbook"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Logo & title */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-7 h-7 rounded flex items-center justify-center shrink-0"
              style={{ background: "oklch(var(--handbook-amber) / 0.15)" }}
            >
              <BookOpen
                size={14}
                style={{ color: "oklch(var(--handbook-amber))" }}
              />
            </div>
            <span className="font-display font-semibold text-sm md:text-base text-foreground leading-tight hidden sm:block">
              HVAC &amp; Insulation{" "}
              <span className="text-amber hidden md:inline">Handbook</span>
            </span>
            <span className="font-display font-semibold text-sm text-foreground sm:hidden">
              Handbook
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          <div className="relative w-48 md:w-64 lg:w-80">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "oklch(var(--muted-foreground))" }}
            />
            <Input
              ref={searchRef}
              data-ocid="search.search_input"
              placeholder="Search handbook…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm bg-muted/50 border-border/60 focus-visible:ring-amber-handbook focus-visible:border-amber-handbook/50 placeholder:text-muted-foreground/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Layout body ─────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* ── Sidebar ───────────────────────────────────────── */}
        <aside
          className={[
            "fixed md:sticky top-14 z-30 md:z-auto h-[calc(100vh-3.5rem)]",
            "w-72 shrink-0 flex flex-col",
            "border-r border-border/60 transition-transform duration-300 ease-in-out",
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0",
          ].join(" ")}
          style={{ background: "oklch(var(--sidebar))" }}
          aria-label="Table of contents"
        >
          {/* TOC header */}
          <div className="px-4 pt-5 pb-3 shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="h-px flex-1"
                style={{ background: "oklch(var(--handbook-rule))" }}
              />
              <span
                className="font-mono-code text-xs tracking-widest uppercase shrink-0"
                style={{ color: "oklch(var(--handbook-amber-dim))" }}
              >
                Contents
              </span>
              <div
                className="h-px flex-1"
                style={{ background: "oklch(var(--handbook-rule))" }}
              />
            </div>
          </div>

          {/* Search results notice */}
          <AnimatePresence>
            {debouncedSearch.trim() && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 pb-2 overflow-hidden"
              >
                <p className="text-xs text-muted-foreground">
                  {searchResults.length > 0 ? (
                    <>
                      <span className="text-amber font-medium">
                        {searchResults.length}
                      </span>{" "}
                      match{searchResults.length !== 1 ? "es" : ""} for "
                      {debouncedSearch}"
                    </>
                  ) : (
                    <>No results found</>
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section list */}
          <ScrollArea className="flex-1 px-2 pb-4">
            {sectionsLoading ? (
              <div className="px-2 space-y-2 pt-2">
                {["s1", "s2", "s3", "s4", "s5", "s6", "s7"].map((k) => (
                  <Skeleton key={k} className="h-11 w-full rounded-md" />
                ))}
              </div>
            ) : (
              <nav aria-label="Handbook sections">
                {sections.map((section, idx) => (
                  <SidebarItem
                    key={section.id.toString()}
                    section={section}
                    isActive={activeSectionId === section.id}
                    isHighlighted={highlightedIds.has(section.id.toString())}
                    index={idx + 1}
                    onClick={() => handleSectionClick(section.id)}
                  />
                ))}
              </nav>
            )}
          </ScrollArea>

          {/* Sidebar footer */}
          <div
            className="px-4 py-3 shrink-0 border-t border-border/50"
            style={{ borderColor: "oklch(var(--handbook-rule))" }}
          >
            <p className="text-xs text-muted-foreground/50 font-mono-code">
              {sections.length} sections
            </p>
          </div>
        </aside>

        {/* ── Main content ──────────────────────────────────── */}
        <main
          className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-3.5rem)]"
          id="main-content"
        >
          {/* Breadcrumb nav */}
          {activeSectionId !== null && sections.length > 0 && (
            <div
              className="sticky top-0 z-10 flex items-center gap-2 px-6 md:px-10 h-9 border-b border-border/30 text-xs text-muted-foreground"
              style={{ background: "oklch(var(--background) / 0.95)" }}
            >
              <span>Handbook</span>
              <ChevronRight size={12} className="opacity-40" />
              <span className="text-foreground font-medium">
                {sections.find((s) => s.id === activeSectionId)?.title ?? ""}
              </span>
            </div>
          )}

          <SectionPanel sectionId={activeSectionId} />

          {/* Footer */}
          <footer className="px-6 md:px-10 py-8 mt-8 border-t border-border/30 text-xs text-muted-foreground/50 flex items-center justify-between gap-4 flex-wrap">
            <span>HVAC &amp; Insulation Handbook — Field Reference</span>
            <span>
              © {year}. Built with ❤ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
