import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  ChevronRight,
  Clock,
  Home,
  Menu,
  Search,
  TrendingUp,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SectionSummary } from "./backend.d";
import {
  useGetAllSections,
  useGetSection,
  useSearchSections,
} from "./hooks/useQueries";

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
type TabView = "handbook" | "history" | "sales_tips" | "in_home_process";

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
// Brief History Page
// ----------------------------------------------------------------
const HISTORY_SECTIONS = [
  {
    num: "01",
    title: "Ancient Origins: Fire, Hearths, and the First Heating Systems",
    body: `Long before the age of thermostats and refrigerants, humanity's relationship with heating was elemental and unforgiving. Ancient Romans engineered the hypocaust — an underfloor heating system that circulated hot air beneath raised tile floors and through hollow walls, warming bathhouses and elite residences across the Empire. Remarkably sophisticated for its era, the hypocaust established a principle that still underpins modern radiant floor heating: delivering warmth from below.\n\nFor most of human history, however, the open hearth or fireplace was the dominant heating technology. Through the medieval period and into the early modern era, wood and peat burned in central fireplaces or simple iron stoves provided warmth, cooked food, and served as the household's social nucleus. These systems were brutally inefficient — most heat escaped up the flue — but they were the only option available. Benjamin Franklin's invention of the Pennsylvania Fireplace in 1741, later refined into the Franklin Stove, marked one of the first serious attempts to improve heating efficiency by drawing combustion air from below and radiating heat into the room rather than losing it entirely to the chimney.`,
  },
  {
    num: "02",
    title: "The Industrial Revolution: Coal, Steam, and Central Heating",
    body: "The 19th century transformed heating from a domestic craft into an engineering discipline. The rise of coal as the dominant fuel source — dug out of the ground at massive scale and distributed by rail — made centralized heating systems economically viable for the first time. Steam heat, pioneered in commercial and institutional buildings during the 1830s and 1840s, used boilers to generate steam that traveled through pipes to cast-iron radiators in individual rooms. This was a revelation: a single centrally controlled fire could heat an entire building.\n\nBy the latter half of the 19th century, steam and hot water radiator systems were appearing in upscale homes, factories, hospitals, and schools throughout the northeastern United States and Western Europe. New York City, with its density of tenements and commercial buildings, became one of the great laboratories for steam heat distribution. Many of those original systems — now more than a century old — are still running today, their cast-iron radiators clanking and hissing in apartments across Manhattan, Brooklyn, and the Bronx. Understanding that legacy infrastructure remains essential for any HVAC professional working in the New York market.",
  },
  {
    num: "03",
    title: "The Birth of Air Conditioning: Willis Carrier and the Modern Era",
    body: `The story of modern air conditioning begins on a foggy night in Pittsburgh in 1902. Willis Haviland Carrier, a young engineer at the Buffalo Forge Company, was waiting for a train when the idea crystallized: if he could control humidity by passing air over coils cooled to the dew point, he could create controlled-temperature environments regardless of outdoor conditions. Carrier's first commercial installation — a humidity-control system for a Brooklyn printing plant — launched an industry that would reshape civilization.\n\nBy the 1920s, movie theaters were installing cooling systems as a competitive marketing advantage, advertising "cool air" to sweltering summer crowds. Department stores followed. The Carrier Corporation, founded in 1915, drove rapid commercialization. Window air conditioners became available to middle-class consumers in the post-World War II boom, and by the 1960s and 1970s, central air conditioning was becoming standard in new residential construction in the Sun Belt. The demographic consequences were profound: the population of the American South and Southwest exploded in the second half of the 20th century, enabled in large part by the ability to live and work in climate-controlled spaces. Air conditioning didn't just cool buildings — it rewrote the American map.`,
  },
  {
    num: "04",
    title: "The Gas and Oil Era: Furnaces, Boilers, and the 20th-Century Norm",
    body: `Natural gas pipeline infrastructure expanded dramatically across the United States during the 1930s through 1960s, and with it came a revolution in residential heating. Gas furnaces were cleaner, cheaper to operate, and required far less labor than coal boilers. Oil heat, served by a delivery infrastructure of trucks and storage tanks, became dominant in the Northeast where natural gas pipelines were less universal. By mid-century, the combination of gas furnaces in the Midwest and oil boilers in the Northeast had established what most Americans came to think of as "normal" heating.\n\nThese systems were reliable and effective, but early versions were startlingly inefficient by today's standards. Furnaces from the 1950s and 1960s operated at Annual Fuel Utilization Efficiency (AFUE) ratings of 50–60%, meaning nearly half the energy in the fuel was vented unused up the flue. The economics didn't demand better: energy was cheap, and efficiency was an engineering footnote rather than a selling point. That would change dramatically — and abruptly — in October 1973.`,
  },
  {
    num: "05",
    title: "The 1970s Oil Crisis: The Turning Point for HVAC Efficiency",
    body: `The 1973 OPEC oil embargo was a seismic shock to the American economy and a watershed moment for the HVAC industry. When Arab oil-producing nations cut off exports to the United States in retaliation for American support of Israel during the Yom Kippur War, the price of crude oil quadrupled almost overnight. Heating oil prices spiked. Gasoline lines stretched for blocks. For the first time in a generation, Americans confronted the reality that cheap, abundant fossil fuels were not a given.\n\nThe Carter administration responded with the National Energy Act of 1978 and a suite of efficiency standards and tax incentives. The Department of Energy began developing mandatory efficiency minimums for heating and cooling equipment. Insulation, which had been a cost-cutting item in postwar construction, suddenly became a selling point. The concept of "energy audit" entered the consumer vocabulary. The HVAC industry, which had marketed equipment almost entirely on upfront cost and raw capacity, was forced to grapple with operating efficiency as a primary design criterion. The modern era of high-efficiency gas furnaces, heat pump technology, and building envelope science can trace its origins directly to those long lines at the gas pump in 1973 and 1979.`,
  },
  {
    num: "06",
    title: "Refrigerant Regulation: From R-22 to R-410A and Beyond",
    body: "The mid-20th century HVAC industry was built on chlorofluorocarbon (CFC) and hydrochlorofluorocarbon (HCFC) refrigerants, most notably R-22 (Freon). These chemicals were stable, effective, and seemingly benign — until atmospheric scientists discovered in the 1970s that they were destroying the stratospheric ozone layer. The 1987 Montreal Protocol set in motion a global phaseout of ozone-depleting refrigerants that would reshape the industry over the following decades.\n\nR-22 production and import in the United States was banned effective January 1, 2020. In the years leading up to that date, R-22 prices skyrocketed as supplies dwindled, creating a lucrative service market but also accelerating the replacement of aging R-22 equipment. The primary replacement refrigerant, R-410A, carries no ozone depletion potential — but it is a potent greenhouse gas with a global warming potential (GWP) nearly 2,000 times that of carbon dioxide. Under the American Innovation and Manufacturing (AIM) Act of 2020, R-410A is itself being phased down, with lower-GWP alternatives like R-32 and R-454B entering the market. For HVAC technicians in New York, understanding refrigerant transitions, proper recovery procedures, and equipment compatibility is both a legal obligation and a core professional competency.",
  },
  {
    num: "07",
    title: "The Heat Pump Revolution: Electrification Comes of Age",
    body: `The heat pump is not a new invention — the thermodynamic principles underlying it were understood in the 19th century, and the first practical residential heat pumps appeared in the 1940s and 1950s. For most of the 20th century, however, heat pumps were a niche product, largely limited to mild climates in the American South and Pacific Northwest. In colder climates like New York, they were considered impractical: early models lost efficiency rapidly as outdoor temperatures dropped, and at temperatures below roughly 25–30°F, they struggled to maintain output.\n\nThe past fifteen years have seen a genuine technological revolution. Modern inverter-driven, variable-capacity heat pumps — often branded as "cold climate" heat pumps — can now maintain rated heating capacity at outdoor temperatures of -13°F or below, with meaningful efficiency down to -22°F. Products from manufacturers like Mitsubishi, Daikin, and Bosch have fundamentally changed the calculus for heating in climate zones that previously demanded combustion systems. A heat pump operating at a Coefficient of Performance (COP) of 3.0 delivers three units of heat for every unit of electrical energy consumed — three times the thermal efficiency of even the best electric resistance heat and far superior to gas combustion on a unit-of-heat-delivered basis.`,
  },
  {
    num: "08",
    title:
      "New York State and the Climate Leadership and Community Protection Act",
    body: `New York State's Climate Leadership and Community Protection Act (CLCPA), signed into law in July 2019, is among the most aggressive climate statutes in the United States. It mandates a 40% reduction in greenhouse gas emissions by 2030 (from 1990 levels) and a net-zero emissions economy by 2050. Buildings account for roughly a third of New York's total greenhouse gas emissions, making the built environment — and by extension, the HVAC industry — central to achieving the law's targets.\n\nThe practical implications for the heating and cooling industry are substantial. New York State is moving to limit natural gas infrastructure expansion and has signaled intent to ban new gas equipment in new construction, phasing in restrictions building type by building type. The Public Service Commission has ordered utilities to begin developing electrification transition programs. NYSERDA's Clean Heating and Cooling initiatives provide substantial incentives for heat pump installation, including the EmPower+ program for income-qualified households and the Clean Heat program offering per-ton incentives for cold-climate heat pump adoption. For HVAC contractors in New York, the CLCPA is not an abstract policy concern — it is actively reshaping what equipment is being installed, what customers are asking for, and what technical skills command premium wages.`,
  },
  {
    num: "09",
    title: "Insulation and the Building Envelope: The Forgotten Half of HVAC",
    body: `No heating or cooling system can perform to its rated efficiency in a building that leaks like a sieve. The building envelope — walls, roof, windows, foundation, and the air barrier that ties them together — determines the thermal load that any mechanical system must overcome. For most of American residential construction history, insulation was an afterthought: a thin layer of fiberglass batt stuffed between studs, with no systematic attention to air sealing.\n\nThe energy efficiency movement of the post-1970s era gradually transformed understanding of the building envelope. Blower door testing, pioneered in the late 1970s, made it possible to measure and locate air infiltration quantitatively. Energy auditing became a profession. Programs like NYSERDA's Home Performance with ENERGY STAR brought systematic building science to residential retrofits, demonstrating that air sealing and insulation upgrades could reduce heating loads by 30–50% in older homes — often far more cost-effective than equipment upgrades alone. Spray polyurethane foam (SPF), rigid foam, and advanced insulation materials gave contractors tools to achieve near-zero air leakage in retrofits as well as new construction. The modern, well-trained HVAC professional understands that their job begins with the envelope, not the equipment.`,
  },
  {
    num: "10",
    title: "The Road Ahead: VRF, Geothermal, Smart Buildings, and Hydrogen",
    body: "The trajectory of HVAC technology points toward greater electrification, higher efficiency, tighter integration with building controls, and eventually the decarbonization of the heating supply chain itself. Variable Refrigerant Flow (VRF) systems — multi-zone heat pump networks that can simultaneously heat and cool different zones of a large building by redirecting refrigerant — are increasingly displacing traditional central HVAC in commercial and multi-family construction. Their precision, efficiency, and flexibility represent a significant technological step forward.\n\nGeothermal heat pump systems, which exchange heat with the earth rather than the outdoor air, offer the highest efficiencies available in any climate — though the upfront cost of ground loop installation remains a barrier. As incentives under programs like the federal Investment Tax Credit (ITC) expand geothermal eligibility, the economics are improving. Meanwhile, the long-term question of how to decarbonize heating in very dense urban environments — where heat pumps alone may be insufficient — is driving research into hydrogen blending in gas distribution networks and district-scale thermal energy systems. For the HVAC professional working in New York today, staying current with these technology shifts is not optional. The industry is changing faster than at any point in the last 50 years, and the technicians and contractors who understand why — who understand the history that brought us here — are best positioned to navigate what comes next.",
  },
];

function BriefHistoryPage() {
  return (
    <motion.div
      key="history"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-3xl mx-auto px-6 md:px-10 py-10"
    >
      {/* Page header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Clock size={16} style={{ color: "oklch(var(--handbook-amber))" }} />
          <span
            className="font-mono-code text-xs font-semibold tracking-widest uppercase"
            style={{ color: "oklch(var(--handbook-amber))" }}
          >
            Historical Overview
          </span>
          <div
            className="h-px flex-1"
            style={{ background: "oklch(var(--handbook-rule))" }}
          />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-5 leading-tight">
          A Brief History of Heating &amp; Cooling
        </h1>
        <p
          className="text-base leading-relaxed max-w-2xl"
          style={{ color: "oklch(var(--handbook-subtitle-text))" }}
        >
          From ancient Roman hypocausts to cold-climate heat pumps and New
          York's Climate Leadership Act — the long arc of how humanity learned
          to control the temperature of its built environment, and where the
          industry is headed next.
        </p>
        <div
          className="mt-8 h-px"
          style={{ background: "oklch(var(--handbook-rule))" }}
        />
      </header>

      {/* Sections */}
      <div className="space-y-12">
        {HISTORY_SECTIONS.map((section, idx) => (
          <motion.article
            key={section.num}
            data-ocid={`history.section.item.${idx + 1}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
          >
            <div className="flex items-baseline gap-3 mb-3">
              <span
                className="font-mono-code text-xs font-medium shrink-0"
                style={{ color: "oklch(var(--handbook-section-num))" }}
                aria-hidden="true"
              >
                {section.num}
              </span>
              <h2 className="font-display text-xl font-semibold text-foreground leading-snug">
                {section.title}
              </h2>
            </div>
            <div className="pl-9 space-y-4">
              {section.body.split("\n\n").map((para) => (
                <p
                  key={para.slice(0, 40)}
                  className="handbook-body-text leading-[1.85] tracking-[0.01em]"
                  style={{ color: "oklch(var(--handbook-body-text))" }}
                >
                  {para}
                </p>
              ))}
            </div>
            {idx < HISTORY_SECTIONS.length - 1 && (
              <div
                className="mt-10 h-px"
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
// Sales Tips Page
// ----------------------------------------------------------------
const SALES_SECTIONS = [
  {
    num: "01",
    title: "Understanding the Customer's Pain Points",
    body: `Every sale begins with a problem. In HVAC and insulation, those problems are visceral and personal: the bedroom that's always too cold, the heating bill that doubled last January, the system that broke down on the coldest night of the year, the damp basement that smells wrong. Before you say a word about equipment or pricing, your job is to understand exactly what is making that customer's life uncomfortable or expensive.\n\nAsk open-ended questions: "What made you call us today?" "How long has this been an issue?" "Which rooms bother you the most?" "Have you seen your energy bills change in the last couple of years?" Listen without interrupting. Take notes visibly — it signals that you're taking their concerns seriously. The customer who feels heard is far more likely to trust your recommendations and less likely to shop your quote against a competitor who just measured the house and sent a PDF.`,
  },
  {
    num: "02",
    title: "Qualifying the Lead: What to Know Before You Propose",
    body: `Not every lead is ready to buy, and wasting a full proposal on an unqualified prospect costs you time you could spend on someone who's ready to move. Before you invest heavily, confirm a few basics: Is this person the homeowner or a renter? If they rent, do they have authorization from the landlord? What is their timeline — are they planning work in the next 30 days, or "thinking about it" for next year? Have they worked with other contractors recently, and if so, what stopped them from moving forward?\n\nBudget signals are equally important. You don't always need to ask directly — listen for clues. Someone who mentions "we want to do this right" is signaling openness to premium solutions. Someone who opens by saying "I got three quotes and yours needs to be competitive" is primarily price-driven. Someone who asks "what's the cheapest way to get heat into that room" is not currently a candidate for a full system replacement. Read the room and tailor your approach accordingly.`,
  },
  {
    num: "03",
    title: "Building Trust Through Education",
    body: `The single most powerful sales strategy in HVAC is also the simplest: be the most knowledgeable, honest person the customer has ever met in this industry. Most homeowners have had at least one bad experience with a contractor — oversold, overcharged, or simply left with a system that didn't work as promised. They approach you with a baseline level of suspicion. Dissolve it with expertise.\n\nExplain things in plain language. Tell them why their old system is failing, not just that it needs to be replaced. Show them where the heat is escaping with a thermal camera or even just a flashlight at the window frame seals on a cold day. Explain the difference between a 14 SEER and an 18 SEER unit in terms of monthly cost savings, not just percentages. When you demonstrate genuine knowledge and transparency — including the honest admission that a cheaper option might serve their needs adequately — customers reward you with trust. And trusted contractors get referrals.`,
  },
  {
    num: "04",
    title: "The Walkthrough: Your Most Important Sales Tool",
    body: `Never quote from the doorstep. A thorough walkthrough of the home — basement, attic, mechanical room, every room if possible — communicates professionalism, surfaces problems the customer may not know about, and gives you the information you need to build an accurate proposal. It also extends the time you spend building rapport before you ever mention price.\n\nDuring the walkthrough, narrate what you're observing: "I can see your attic insulation is compressed and probably at R-11 — we'd recommend R-38 for your climate zone." "This expansion tank looks original — if we're replacing the boiler, we should address this too." "Your ductwork in the crawlspace has a couple of disconnected sections that are conditioning the crawlspace instead of the living area." This running commentary accomplishes two things: it educates the customer about the state of their home, and it plants seeds for the line items that will appear in your proposal.`,
  },
  {
    num: "05",
    title: "Presenting the Quote: Lead with Value, Not Price",
    body: `The moment you hand over a number without context is the moment price becomes the only thing the customer is thinking about. Instead, structure your proposal presentation as a story: here's what I found, here's what we recommend, here's why, here's what it will do for your comfort and your bills, and here's what it costs.\n\nPresent options when appropriate — typically three tiers: a baseline solution that addresses the core need, a mid-range recommendation that's the right call for most customers in their situation, and a premium option that represents best-in-class efficiency or features. This framing, borrowed from effective sales methodology across industries, accomplishes several things. It positions the mid-range option as the sensible choice rather than the expensive one. It prevents the conversation from becoming purely about finding the cheapest solution. And it gives customers who are ready to spend more a clear path to do so without feeling upsold.\n\nAlways leave written materials: a clear, itemized proposal, manufacturer spec sheets for the equipment you're recommending, and relevant rebate information. Customers who take the time to read what you leave behind are more likely to call you back than those who don't.`,
  },
  {
    num: "06",
    title: "Upselling Strategies That Serve the Customer",
    body: `The best upsells are not about padding your ticket — they're about solving problems the customer didn't know they had, and they should be presented as genuine recommendations. In HVAC and insulation, the most natural and defensible upsells include:\n\nAir sealing combined with insulation: Installing attic insulation over a leaky ceiling plane is like putting a blanket over a screen door. Air sealing first dramatically improves the ROI of the insulation itself — and is a story customers readily understand when you explain it this way.\n\nSmart thermostats: A $150–200 thermostat upgrade adds convenience, demonstrates technology leadership, and is a straightforward close when the customer is already spending thousands. Present the estimated savings and the scheduling features together.\n\nExtended warranty and service agreements: Service agreements generate recurring revenue and dramatically reduce customer churn. Present them at proposal time as peace of mind, not as a sales add-on.`,
  },
  {
    num: "07",
    title: "Handling Objections: The Three You'll Hear Every Week",
    body: `"It's too expensive." Don't capitulate immediately with a discount — first, ask what they were expecting to spend. Often the gap is smaller than it appears, or there's a different scope of work that fits their budget. If price is a genuine barrier, introduce financing options before you reduce scope or margin.\n\n"I need to get other quotes." Affirm it: "Absolutely, you should." Then ask what criteria matter most to them — price, brand, warranty, speed of installation — so you can address those points directly rather than just waiting to be shopped. Offer to schedule a follow-up call after they've gathered their other bids.\n\n"My old system still works." This is a comfort objection disguised as a practical one. Address it with a total-cost-of-ownership frame: "It works today, but a system this age has a 60% probability of a major failure within the next two winters, and service calls on old equipment cost more than on new. Would you like me to show you what the five-year cost comparison looks like between repairing and replacing?"`,
  },
  {
    num: "08",
    title: "NY Incentives and Rebates as a Closing Tool",
    body: `New York customers are leaving significant money on the table if they're not taking advantage of available rebates and incentives, and positioning yourself as the guide to those programs is a meaningful competitive differentiator. Key programs to know and communicate:\n\nNYSERDA Clean Heat program: Per-ton incentives for qualifying cold-climate heat pump installations, available to both residential and small commercial customers. Amounts vary but have historically ranged from several hundred to over a thousand dollars per ton of capacity.\n\nConEd, National Grid, and PSEG Long Island rebates: Utility programs for qualifying heat pump, heat pump water heater, and insulation upgrades. Amounts and eligibility change regularly — maintain a current cheat sheet.\n\nFederal Energy Efficient Home Improvement Credit (25C): Up to $1,200 per year in federal tax credits for qualifying insulation, heat pumps, and controls, plus up to $2,000 specifically for heat pumps. This credit applies to homeowners directly.\n\nNY State Green Building Tax Credit and Inflation Reduction Act Rebates: Additional stacking incentives that can dramatically reduce the net cost of electrification upgrades. Always present the total net cost after incentives — the gross price is not the number that matters.`,
  },
  {
    num: "09",
    title: "Talking Heat Pumps to Skeptical New York Customers",
    body: `"Will it work in the winter here?" This is the objection that has cost the heat pump market in the Northeast more than any other factor, and it used to be a legitimate concern. No longer. Modern cold-climate heat pumps maintain their heating output at -13°F and continue to function — though at reduced capacity — well below that. In the New York climate, where temperatures below 0°F are rare and brief, a properly sized cold-climate heat pump will handle the heating load throughout all but the very worst nights of the year.\n\nThe best way to address skepticism is with specifics and social proof. Quote the rated capacity at low-temperature conditions from the NEEP directory. Reference customers you've installed for in similar climate zones and similar homes — if you have them, ask their permission to share their first-season heating costs. Explain that backup heat (electric resistance strips, retained oil or gas for the coldest days) is a legitimate design strategy for hybrid systems, and is often required anyway to meet code. Reframe the conversation: the question isn't "will it work in winter" but "how much of your annual heating load can it cover?" In New York, the answer for a well-specified system is 85–95%.`,
  },
  {
    num: "10",
    title: "Financing as a Sales Tool",
    body: `The single most common reason a qualified, interested customer doesn't sign is upfront cost. Financing dissolves that barrier and allows customers to make the right decision for their home rather than the cheapest decision their checking account permits today. Make financing a standard part of every proposal presentation — not something you pull out when the customer hesitates on price.\n\nPresent the monthly payment alongside the annual energy savings to frame the financial proposition accurately: "At current rates, this system will save you approximately $150 per month in heating costs. At $89 per month on our 84-month financing, you're cash-flow positive from day one." This reframes the purchase from a capital expense into an operating cost that pays for itself. Know the programs you offer thoroughly — interest rates, term lengths, prepayment penalties, and qualification requirements — and be prepared to run a soft pull at the kitchen table if the customer is ready to move.`,
  },
  {
    num: "11",
    title: "Follow-Up Strategy and Staying Top of Mind",
    body: `Most HVAC sales don't close on the first visit. The industry average is three to seven touchpoints before a decision, which means the contractor who gives up after one unreturned phone call is leaving most of their business on the table. Build a systematic follow-up process: a text or email the night of the walkthrough ("Thank you for having me — your proposal is attached and I'm available to answer any questions"), a phone call three to five days later, and a final check-in two weeks out.\n\nFor customers who aren't ready to move forward this season, don't disappear. Send a brief seasonal maintenance reminder in October. A note about a new rebate program. A photo of a similar install you're proud of. Not spam — one or two touches per year that demonstrate you're still thinking about their home. The HVAC industry runs on recurring relationships: the customer you install for today is the customer who calls you for the next 20 years of service, and the one who sends you their neighbor when the neighbor's boiler quits in February.`,
  },
  {
    num: "12",
    title: "Building Referrals and Your Community Reputation",
    body: `In the trades, reputation is your most valuable marketing asset and also your most fragile one. A single job done badly, or a single customer service failure that goes unaddressed, can undo years of positive word-of-mouth. Conversely, a business built on genuine quality, reliable service, and straightforward communication is the most defensible competitive position available to a local contractor.\n\nAsk for referrals explicitly, and ask at the right moment — when the customer has just expressed satisfaction, immediately after a job well done, not in a follow-up email months later. Make it easy: a text with a direct link to your Google review page. Incentivize it modestly: a $50 referral credit on their next service call. Join your local chamber of commerce and the appropriate trade associations. Sponsor a youth sports team. Show up as a real member of your community, not just a truck with a phone number. The plumber who is also the parent at your kid's school is the plumber who gets called first and recommended most.`,
  },
];

function SalesTipsPage() {
  return (
    <motion.div
      key="sales"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-3xl mx-auto px-6 md:px-10 py-10"
    >
      {/* Page header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp
            size={16}
            style={{ color: "oklch(var(--handbook-amber))" }}
          />
          <span
            className="font-mono-code text-xs font-semibold tracking-widest uppercase"
            style={{ color: "oklch(var(--handbook-amber))" }}
          >
            Sales Guide
          </span>
          <div
            className="h-px flex-1"
            style={{ background: "oklch(var(--handbook-rule))" }}
          />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-5 leading-tight">
          Sales Tips for HVAC &amp; Insulation
        </h1>
        <p
          className="text-base leading-relaxed max-w-2xl"
          style={{ color: "oklch(var(--handbook-subtitle-text))" }}
        >
          A practical guide to building trust, presenting value, handling
          objections, and closing deals in the New York HVAC and insulation
          market — from the first phone call to the signed contract and beyond.
        </p>
        <div
          className="mt-8 h-px"
          style={{ background: "oklch(var(--handbook-rule))" }}
        />
      </header>

      {/* Sections */}
      <div className="space-y-12">
        {SALES_SECTIONS.map((section, idx) => (
          <motion.article
            key={section.num}
            data-ocid={`sales.section.item.${idx + 1}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.3 }}
          >
            <div className="flex items-baseline gap-3 mb-3">
              <span
                className="font-mono-code text-xs font-medium shrink-0"
                style={{ color: "oklch(var(--handbook-section-num))" }}
                aria-hidden="true"
              >
                {section.num}
              </span>
              <h2 className="font-display text-xl font-semibold text-foreground leading-snug">
                {section.title}
              </h2>
            </div>
            <div className="pl-9 space-y-4">
              {section.body.split("\n\n").map((para) => (
                <p
                  key={para.slice(0, 40)}
                  className="handbook-body-text leading-[1.85] tracking-[0.01em]"
                  style={{ color: "oklch(var(--handbook-body-text))" }}
                >
                  {para}
                </p>
              ))}
            </div>
            {idx < SALES_SECTIONS.length - 1 && (
              <div
                className="mt-10 h-px"
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
// In Home Process Page
// ----------------------------------------------------------------
const IN_HOME_SECTIONS = [
  {
    num: "01",
    title: "Before You Ring the Bell",
    tip: "Preparation before you reach the door sets the tone for everything.",
    body: `Review the lead info before arriving: what prompted the call, how old the system is, whether it's a boiler or forced-air setup, oil or gas. If you know nothing, assume nothing — go in ready to assess from scratch.\n\nPark professionally. Dress clean. Have your notepad, pen, and measuring tape accessible — not buried in the truck. First impressions are formed in seconds and they are very difficult to reverse.`,
  },
  {
    num: "02",
    title: "The First 60 Seconds at the Door",
    tip: "Confidence, warmth, and brevity. Don't over-introduce.",
    body: `Greet by name if you have it. State who you are, who you're with, and why you're there — in one sentence. Example: "Hi, I'm [Name] from [Company] — I'm here to take a look at your heating system and see what's going on."\n\nSmile, make eye contact, and wait to be invited in. Do not walk in uninvited. Once inside, ask where the heating system is and ask if you can take a look around the house. Most homeowners will say yes. That walkthrough is your most important sales move.`,
  },
  {
    num: "03",
    title: "The Walkthrough: What You're Looking For",
    tip: "Walk slowly. Look at everything. Take notes visibly.",
    body: `Start at the mechanical system — boiler room, utility room, or air handler closet. Note the equipment: brand, age (check the serial number if the label doesn't show a year), fuel type, venting configuration, and condition. Look for rust, corrosion, water stains, draft issues, or signs of prior repairs.\n\nThen move through the living space. Check every room: are there baseboards, radiators, or supply registers? Are any rooms clearly colder or warmer? Note window conditions, attic access, basement rim joists. Look at the thermostat — is it old, outdated, or poorly located?\n\nAsk as you walk: "Does this room heat well?" "Do you notice any cold spots in winter?" "Has anything changed recently with your bills or comfort?" Every answer is data for your proposal and a trust-building moment.`,
  },
  {
    num: "04",
    title: "Identifying the System Type",
    tip: "Know what you're dealing with before you say anything about solutions.",
    body: `Boiler (hot water or steam): Look for radiators or baseboard convectors. Check if it's a single-pipe steam, two-pipe steam, or hydronic hot water system. Steam systems are common in older New York homes and require specific knowledge — don't guess.\n\nForced Air (furnace): Look for supply and return registers in the walls or floors. Check the ductwork in the basement or crawlspace — look for disconnects, leaks, or poor insulation. Is there a central air system on the same air handler?\n\nOil vs. Gas: Oil systems will have a storage tank (basement, underground, or above-ground outdoor). Gas systems connect to the utility line. Note which — fuel type drives the entire conversation about replacement options and conversion.`,
  },
  {
    num: "05",
    title: "Reading the Homeowner: Stay on Oil/Gas or Convert?",
    tip: "Ask, don't assume. Their priorities drive the recommendation.",
    body: `Once you have a read on the system, the conversation shifts to options. The key questions to answer are: What is the homeowner's primary driver — comfort, cost savings, environmental concern, or reliability? Are they planning to stay in the home long-term? What is their tolerance for upfront investment?\n\nOpen with: "Now that I've had a chance to look things over, I want to understand what matters most to you — are you more focused on keeping costs down, improving comfort, or are you interested in moving away from oil/gas entirely?" Their answer tells you which direction to steer.`,
  },
  {
    num: "06",
    title: "The Boiler Situation: What to Assess and Say",
    tip: "Boilers last 20–30 years. Age and efficiency are your two anchors.",
    body: `If the boiler is 15+ years old: focus the conversation on reliability risk. A boiler that fails in January is an emergency. The cost of an emergency replacement — expedited labor, potential damage from no heat — far exceeds a planned replacement now.\n\nIf the boiler is inefficient (under 85% AFUE): frame the conversation around operating costs. Calculate the approximate annual fuel savings between their current unit and a high-efficiency replacement. Real numbers matter more than percentages.\n\nIf the homeowner wants to stay on oil or gas: respect that. Recommend the highest-efficiency replacement available for their fuel type, address any distribution problems (bad zones, leaky pipes, air in the system), and offer a service contract. Don't push conversion on someone who isn't open to it — you'll lose the job entirely.`,
  },
  {
    num: "07",
    title: "The Forced Air Situation: What to Assess and Say",
    tip: "The duct system is half the job. Never ignore it.",
    body: `Forced air systems fail in two places: the equipment and the distribution. A new furnace in a leaky duct system will underperform and frustrate the homeowner. Always assess both.\n\nCheck duct sealing: look for disconnected sections, gaps at register boots, or flex duct that has collapsed or kinked. This is visible in 10 minutes in most basements. If you see problems, mention them matter-of-factly during the walkthrough — not as a sales pitch, but as an observation.\n\nAir conditioning: if there's a coil on the furnace and an outdoor condenser, assess that too. If the AC is as old as the furnace, present a package replacement — the incremental cost is low and it avoids a callback in July.`,
  },
  {
    num: "08",
    title: "The Heat Pump Conversation: When and How to Bring It Up",
    tip: "Lead with what it does for them. Not with the technology.",
    body: `Don't open with "heat pump" if the homeowner hasn't mentioned it — many still associate the term with systems that don't work in cold weather. Instead, open with the outcome: "There's now a heating and cooling system that can replace your furnace and AC, run entirely on electricity, and cut your heating costs significantly. It's rated to work at temperatures well below zero. Would you like me to walk you through it?"\n\nIf they're on oil: the case is strong. Oil is expensive and volatile. A cold-climate heat pump with a backup electric or retained oil option is a financially compelling story in New York. Run the numbers on their annual oil bill and show what they'd save.\n\nIf they're on gas: the case is more nuanced. Gas is relatively cheap in New York right now. Lead with comfort (zone control, summer cooling) and long-term positioning with NY incentives. Don't oversell savings if the math doesn't support it.\n\nIf they're on steam heat: a full conversion to forced air or mini-splits is a larger project. Be honest about scope and cost. Some homeowners are ready; many are not. Read the room.`,
  },
  {
    num: "09",
    title: "Handling 'I Want to Stay on Oil/Gas' — Without Losing the Sale",
    tip: "Validate the choice. Then make the best version of that choice.",
    body: `Some homeowners will not convert. They may have concerns about heat pump performance in extreme cold, distrust of electric bills, or simply strong familiarity with their current fuel. Do not argue. Arguing creates resistance; validation creates trust.\n\n"That makes complete sense — a lot of our customers feel the same way, and there are great high-efficiency options in oil/gas that will serve you very well for the next 20 years." Then pivot to: what's the best equipment for their situation, what accessories improve the system (smart thermostat, outdoor reset, indirect water heater), and what maintenance/service agreement protects their investment?\n\nThe homeowner who feels heard — not pushed — is the homeowner who signs.`,
  },
  {
    num: "10",
    title: "Insulation: Bring It Up on Every Visit",
    tip: "Insulation problems drive equipment problems. Connect the two.",
    body: `Most homeowners don't think about insulation unless they've had an energy audit. Your job is to plant that seed on every visit. During the walkthrough, glance at the basement rim joists, the attic hatch, and any visible exterior walls. You don't need a full audit to observe obvious problems.\n\nConnect it to their existing complaint: "One reason this room never heats properly is that the exterior wall here has almost no insulation — you can feel the cold coming through." Or: "Your boiler is running longer than it should because a good portion of the heat is escaping through the attic. If we address the insulation at the same time as the equipment, your savings will be significantly higher."\n\nPresenting insulation alongside mechanical work increases your average ticket, reduces callback complaints about comfort, and delivers a genuinely better outcome for the customer.`,
  },
  {
    num: "11",
    title: "Closing the Visit: What to Leave Behind",
    tip: "Never leave without a next step. Ambiguity kills deals.",
    body: `Before you leave, summarize what you found and what you'll propose. Don't recite everything — pick the two or three most important findings and state them clearly. Then set a specific next step: "I'll have your proposal to you by tomorrow afternoon. Is email best, or would you prefer I call you to walk through it?"\n\nLeave a business card. If you have any printed materials on relevant rebate programs or equipment, leave those too. The homeowner who has something to read after you leave is more likely to stay engaged than one who has only a mental note.\n\nFollow up when you said you would. Every hour past your promised deadline lowers your close rate.`,
  },
];

function InHomeProcessPage() {
  return (
    <motion.div
      key="in_home"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-3xl mx-auto px-6 md:px-10 py-10"
    >
      {/* Page header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Home size={16} style={{ color: "oklch(var(--handbook-amber))" }} />
          <span
            className="font-mono-code text-xs font-semibold tracking-widest uppercase"
            style={{ color: "oklch(var(--handbook-amber))" }}
          >
            Field Guide
          </span>
          <div
            className="h-px flex-1"
            style={{ background: "oklch(var(--handbook-rule))" }}
          />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-5 leading-tight">
          The In-Home Process
        </h1>
        <p
          className="text-base leading-relaxed max-w-2xl"
          style={{ color: "oklch(var(--handbook-subtitle-text))" }}
        >
          A step-by-step field guide for entering a residential home, assessing
          the situation, and laying out the right sales conversation — whether
          it's a boiler, a furnace, a heat pump conversion, or an insulation
          upgrade.
        </p>
        <div
          className="mt-8 h-px"
          style={{ background: "oklch(var(--handbook-rule))" }}
        />
      </header>

      {/* Sections */}
      <div className="space-y-10">
        {IN_HOME_SECTIONS.map((section, idx) => (
          <motion.article
            key={section.num}
            data-ocid={`inhome.section.item.${idx + 1}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.3 }}
          >
            {/* Title row */}
            <div className="flex items-baseline gap-3 mb-2">
              <span
                className="font-mono-code text-xs font-medium shrink-0"
                style={{ color: "oklch(var(--handbook-section-num))" }}
                aria-hidden="true"
              >
                {section.num}
              </span>
              <h2 className="font-display text-xl font-semibold text-foreground leading-snug">
                {section.title}
              </h2>
            </div>

            {/* Tip callout */}
            <div
              className="ml-9 mb-3 px-3 py-2 rounded border-l-2 text-sm font-medium italic"
              style={{
                borderColor: "oklch(var(--handbook-amber))",
                background: "oklch(var(--handbook-amber) / 0.07)",
                color: "oklch(var(--handbook-amber))",
              }}
            >
              {section.tip}
            </div>

            {/* Body */}
            <div className="pl-9 space-y-4">
              {section.body.split("\n\n").map((para) => (
                <p
                  key={para.slice(0, 40)}
                  className="handbook-body-text leading-[1.85] tracking-[0.01em]"
                  style={{ color: "oklch(var(--handbook-body-text))" }}
                >
                  {para}
                </p>
              ))}
            </div>

            {idx < IN_HOME_SECTIONS.length - 1 && (
              <div
                className="mt-9 h-px"
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
// Top Tab Bar
// ----------------------------------------------------------------
interface TabBarProps {
  activeTab: TabView;
  onTabChange: (tab: TabView) => void;
}

function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const tabs: {
    id: TabView;
    label: string;
    icon: React.ReactNode;
    ocid: string;
  }[] = [
    {
      id: "handbook",
      label: "Handbook",
      icon: <BookOpen size={14} />,
      ocid: "nav.handbook.tab",
    },
    {
      id: "history",
      label: "Brief History",
      icon: <Clock size={14} />,
      ocid: "nav.history.tab",
    },
    {
      id: "sales_tips",
      label: "Sales Tips",
      icon: <TrendingUp size={14} />,
      ocid: "nav.sales_tips.tab",
    },
    {
      id: "in_home_process",
      label: "In Home Process",
      icon: <Home size={14} />,
      ocid: "nav.in_home_process.tab",
    },
  ];

  return (
    <div
      className="sticky top-14 z-30 border-b border-border/60 px-4 md:px-6"
      style={{ background: "oklch(var(--sidebar) / 0.97)" }}
      role="tablist"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              data-ocid={tab.ocid}
              aria-selected={isActive}
              onClick={() => onTabChange(tab.id)}
              className={[
                "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-150",
                "whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-handbook",
                "rounded-none",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              <span className={isActive ? "text-amber" : ""}>{tab.icon}</span>
              {tab.label}
              {/* Active underline indicator */}
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                  style={{ background: "oklch(var(--handbook-amber))" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Main App
// ----------------------------------------------------------------
export default function App() {
  const [activeTab, setActiveTab] = useState<TabView>("handbook");
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

  // Switch to handbook tab when clicking a section from search results
  const handleTabChange = useCallback((tab: TabView) => {
    setActiveTab(tab);
  }, []);

  const year = new Date().getFullYear();

  // Non-handbook content area height accounts for header (3.5rem) + tab bar (~2.75rem)
  const contentHeight = "calc(100vh - 3.5rem - 2.75rem)";
  // Sidebar top offset: header + tab bar
  const sidebarTop = "calc(3.5rem + 2.75rem)";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 border-b border-border/60 backdrop-blur-sm"
        style={{ background: "oklch(var(--sidebar) / 0.95)" }}
      >
        <div className="flex items-center gap-4 px-4 md:px-6 h-14">
          {/* Mobile hamburger — only visible on handbook tab */}
          {activeTab === "handbook" && (
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
          )}

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

          {/* Search — only on handbook tab */}
          {activeTab === "handbook" && (
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
          )}
        </div>
      </header>

      {/* ── Tab Bar ─────────────────────────────────────────── */}
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* ── Content: Handbook view ─────────────────────────── */}
      {activeTab === "handbook" && (
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

          {/* ── Sidebar ─────────────────────────────────────── */}
          <aside
            className={[
              "fixed md:sticky z-30 md:z-auto h-[calc(100vh-3.5rem-2.75rem)]",
              "w-72 shrink-0 flex flex-col",
              "border-r border-border/60 transition-transform duration-300 ease-in-out",
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0",
            ].join(" ")}
            style={{
              background: "oklch(var(--sidebar))",
              top: sidebarTop,
            }}
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

          {/* ── Main content ────────────────────────────────── */}
          <main
            className="flex-1 min-w-0 overflow-y-auto"
            style={{ height: contentHeight }}
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
      )}

      {/* ── Content: Brief History view ─────────────────────── */}
      {activeTab === "history" && (
        <div
          className="flex-1 overflow-y-auto"
          style={{ height: contentHeight }}
        >
          <AnimatePresence mode="wait">
            <BriefHistoryPage key="history" />
          </AnimatePresence>
          <footer className="px-6 md:px-10 py-8 border-t border-border/30 text-xs text-muted-foreground/50 flex items-center justify-between gap-4 flex-wrap max-w-3xl mx-auto">
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
        </div>
      )}

      {/* ── Content: Sales Tips view ──────────────────────────── */}
      {activeTab === "sales_tips" && (
        <div
          className="flex-1 overflow-y-auto"
          style={{ height: contentHeight }}
        >
          <AnimatePresence mode="wait">
            <SalesTipsPage key="sales" />
          </AnimatePresence>
          <footer className="px-6 md:px-10 py-8 border-t border-border/30 text-xs text-muted-foreground/50 flex items-center justify-between gap-4 flex-wrap max-w-3xl mx-auto">
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
        </div>
      )}

      {/* ── Content: In Home Process view ─────────────────────── */}
      {activeTab === "in_home_process" && (
        <div
          className="flex-1 overflow-y-auto"
          style={{ height: contentHeight }}
        >
          <AnimatePresence mode="wait">
            <InHomeProcessPage key="in_home" />
          </AnimatePresence>
          <footer className="px-6 md:px-10 py-8 border-t border-border/30 text-xs text-muted-foreground/50 flex items-center justify-between gap-4 flex-wrap max-w-3xl mx-auto">
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
        </div>
      )}
    </div>
  );
}
