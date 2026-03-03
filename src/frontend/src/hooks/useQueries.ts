import { useQuery } from "@tanstack/react-query";
import type { SearchResult, Section, SectionSummary } from "../backend.d";
import { useActor } from "./useActor";

// ----------------------------------------------------------------
// Pro Tips subsections — appended to each section after backend fetch
// ----------------------------------------------------------------
const PRO_TIPS: Record<number, { subtitle: string; body: string }> = {
  1: {
    subtitle: "Pro Tips & Commonly Overlooked",
    body: "One of the most overlooked issues with heat pump condensers in NY is improper refrigerant charge — many techs blame the compressor when low charge is the real culprit. Always verify superheat and subcooling before condemning a compressor. Check that the defrost board is functioning correctly; a stuck defrost relay will keep the unit in defrost and cause ice buildup even in mild weather. Verify that the reversing valve is fully shifting — a partially stuck valve causes complaints of poor heating or cooling with no obvious fault code. Don't overlook dirty or blocked condenser coils; even partial fouling significantly reduces efficiency. In NY winters, make sure the unit is elevated above typical snow accumulation levels — units sitting in ice will short-cycle and trip on low pressure. Always check discharge line temperature as a quick compressor health indicator.",
  },
  2: {
    subtitle: "Pro Tips & Commonly Overlooked",
    body: "Restricted airflow is the most commonly missed cause of poor performance in air handlers. Always check static pressure across the coil and at the unit — high static kills efficiency and can freeze the coil. Dirty evaporator coils are frequently overlooked, especially on units that haven't had filter changes. A clogged condensate drain will trip the safety float switch and shut the unit down — this is often misdiagnosed as an electrical or control issue. Check that auxiliary/emergency heat is wired and staged correctly; many installs leave aux heat unconfigured. On variable-speed air handlers, verify that the ECM motor is receiving the correct control signal — a failed communication wire causes the blower to run at wrong speeds. Inspect the filter rack for bypass air around the filter edges, which allows dirt to coat the coil.",
  },
  3: {
    subtitle: "Pro Tips & Commonly Overlooked",
    body: "The C-wire (common wire) is the most frequent source of thermostat problems — without a stable 24V common, smart thermostats behave erratically or drain battery power. Always verify C-wire presence and continuity before replacing a thermostat. On heat pump systems, confirm the O/B wire is set correctly for the equipment brand — Carrier/Bryant use B (energized in heating), most others use O (energized in cooling). A misset O/B will cause the system to heat when it should cool and vice versa. Check for loose low-voltage connections at the air handler terminal board — these corrode over time and cause intermittent faults. Verify thermostat location isn't near a supply register, exterior wall, or in direct sunlight, which causes false readings. On dual-fuel systems, confirm the balance point (outdoor lockout temperature) is set correctly to prevent simultaneous gas and heat pump operation.",
  },
  4: {
    subtitle: "Pro Tips & Commonly Overlooked",
    body: "Air in the system is one of the most common and overlooked boiler problems — it causes banging, gurgling, and uneven heat distribution. Always bleed radiators and check the auto-vent after any work. Low water cutoff (LWCO) devices are frequently dirty or stuck — a failed LWCO will shut the boiler down and is often misread as a burner or ignition problem. Check expansion tank pressure and bladder condition; a waterlogged expansion tank causes pressure relief valves to weep and the system to over-pressurize. On oil boilers, a dirty or worn nozzle is the leading cause of hard starts, soot buildup, and smoke — replace the nozzle annually. Verify flue draft and combustion air supply; insufficient combustion air causes incomplete combustion and carbon monoxide risk. On steam systems, check steam trap operation — failed traps that are stuck open cause water hammer and uneven heat throughout the building.",
  },
  5: {
    subtitle: "Pro Tips & Commonly Overlooked",
    body: "Cracked heat exchangers are a serious safety hazard and are frequently missed on visual inspection — use a combustion analyzer and perform a CO test in the supply air before clearing any furnace. Flame rollout switches and high limit switches that have tripped once are often reset and ignored; always investigate the root cause (blocked flue, dirty filter, cracked heat exchanger, inadequate combustion air). Inducer motor bearings fail before the motor stops completely — listen for noise and check amp draw. A partially failing inducer causes pressure switch lockouts that are misdiagnosed as pressure switch failures. On 90%+ furnaces, check the condensate trap and drain for blockages; a clogged trap will cause nuisance pressure switch faults. Verify gas pressure at the manifold — low gas pressure causes ignition problems and poor heat output that is often blamed on the igniter or control board. On oil furnaces, inspect the combustion chamber for erosion and the heat exchanger for cracks or rust annually.",
  },
  6: {
    subtitle: "Pro Tips & Commonly Overlooked",
    body: "Undersized wire is a leading cause of nuisance breaker trips and equipment damage — always verify wire gauge against the equipment's MCA (minimum circuit ampacity) and MOCP (maximum overcurrent protection) ratings on the nameplate. Many techs overlook voltage imbalance on multi-phase equipment — even a small imbalance (over 2%) dramatically shortens compressor life. Check voltage at the equipment terminals under load, not just at the panel. Loose connections are the number one cause of electrical failures in HVAC — terminals oxidize and loosen over time. Inspect and torque all connections at the contactor, capacitor, and disconnect during every service call. The disconnect must be within sight of the equipment and rated for the load — verify this on every install. On heat pump installs, confirm the correct wire size is used for the aux/emergency heat circuit, which is often a much higher amperage circuit than the heat pump compressor circuit.",
  },
};

const PRO_TIPS_7 = {
  subtitle: "Pro Tips & Commonly Overlooked",
  body: "The biggest mistake in insulation work is adding insulation without air sealing first — insulation slows conductive heat transfer, but air leaks bypass insulation entirely and account for 30-40% of heating/cooling losses in older NY homes. Always air seal before or during insulation installation. Bypasses in attics (top plates, dropped ceilings, interior wall cavities open to the attic) are invisible from the attic floor and are frequently skipped — these are the largest air leakage paths in most homes. Rim joists in basements are chronically under-insulated; closed-cell spray foam at the rim joist is one of the best bang-for-buck improvements available. Don't compress fiberglass batts — a 6-inch R-19 batt compressed into a 3.5-inch cavity performs closer to R-13. Verify vapor barrier placement: in NY, it goes on the warm-in-winter side (inside face of exterior walls). Installing it on the wrong side traps moisture in the wall cavity and causes mold and rot. On attic insulation jobs, confirm that soffit vents are not blocked by insulation — use baffles to maintain a clear airflow channel.",
};

// ----------------------------------------------------------------
// Section 7 override — replaces "Electric Strip Heat" with Insulation
// ----------------------------------------------------------------
const SECTION_7_OVERRIDE: Section = {
  id: 7n,
  title: "Insulation",
  description:
    "Insulation types, R-values, installation methods, air sealing, vapor control, and NY energy code.",
  subsections: [
    {
      subtitle: "Insulation Types",
      body: "Common types include fiberglass batts, blown-in cellulose, spray foam (open and closed cell), and rigid foam board. Each has different applications, cost points, and performance characteristics. Fiberglass batts are the most common and least expensive, ideal for standard stud-bay installations. Blown-in cellulose is made from recycled paper and is great for retrofitting existing walls and attics. Closed-cell spray foam provides the highest R-value per inch (around R-6 to R-7) and acts as both an air and vapor barrier. Open-cell spray foam is less expensive and provides good air sealing but has a lower R-value (~R-3.5 per inch). Rigid foam board is used for exterior continuous insulation and under slabs.",
    },
    {
      subtitle: "R-Values & NY Energy Code",
      body: "R-value measures thermal resistance — higher is better. New York follows the Energy Conservation Construction Code (ECCC), which requires: Attics R-49, Exterior walls R-20 (with continuous insulation) or R-13 cavity + R-5 ci, Floors over unconditioned spaces R-30, Basement walls R-15 continuous or R-19 cavity. Climate Zone 5 applies to most of NY. Always verify current local code before starting a job, as requirements can vary by jurisdiction and project type.",
    },
    {
      subtitle: "Attic & Roof Insulation",
      body: "Attics are the highest-priority area for insulation in New York homes. Blown-in cellulose or fiberglass is the most common approach for attic floors. Before insulating, seal all air leakage points — electrical penetrations, plumbing chases, recessed lights, top plates, and attic hatches. Install baffles at the eaves to maintain ventilation airflow from soffit to ridge. For cathedral ceilings (unvented), closed-cell spray foam applied to the underside of the roof deck is the preferred method to meet code without sacrificing headroom.",
    },
    {
      subtitle: "Wall Insulation",
      body: "For new construction, 2x6 framing allows for R-21 fiberglass or R-20 open-cell spray foam in the cavity. For existing homes, drill-and-fill (blown-in dense-pack cellulose or fiberglass) is the standard retrofit method. Closed-cell spray foam can be used to insulate rim joists in basements — this is one of the most cost-effective insulation upgrades available. Continuous exterior rigid foam insulation helps address thermal bridging through studs, which can reduce effective wall R-value by 20-30%.",
    },
    {
      subtitle: "Air Sealing",
      body: "Air sealing is just as important as insulation and should always be done first. Even a well-insulated home can lose significant energy through air infiltration. Key areas to seal: electrical boxes and outlets on exterior walls (use foam gaskets), plumbing and wire penetrations through top and bottom plates, attic hatch covers (weatherstrip and insulate the hatch cover itself), recessed lighting (use IC-rated, airtight fixtures or seal from above), chimney chases and fireplace surrounds, band joists and rim joists in basements. Use caulk for small gaps, foam for medium gaps, and rigid blocking plus foam for large openings.",
    },
    {
      subtitle: "Vapor & Moisture Control",
      body: "In New York (Climate Zone 5), a Class II vapor retarder (such as kraft-faced fiberglass or vapor barrier paint) is required on the warm-in-winter side of insulation in most wall assemblies. Closed-cell spray foam acts as its own vapor retarder. Avoid trapping moisture — assemblies should be designed to either prevent moisture entry or allow drying to one side. Crawl spaces should be sealed with a ground vapor barrier and insulated at the perimeter walls rather than the floor above. Never insulate over wet or damp framing.",
    },
    {
      subtitle: "NY Energy Code & Permits",
      body: "Most insulation work in New York requires compliance with the Residential Code of New York State (RCNYS) and the Energy Conservation Construction Code (ECCC). New construction always requires permits and inspections. For existing homes, significant insulation upgrades (such as adding insulation to a finished basement or attic conversion) typically require a permit. Always check with the local building department. The NY State Energy Research and Development Authority (NYSERDA) offers rebate programs for qualifying insulation improvements — it's worth informing customers about available incentives.",
    },
    PRO_TIPS_7,
  ],
};

const SECTION_7_SUMMARY: SectionSummary = {
  id: 7n,
  title: "Insulation",
  description:
    "Insulation types, R-values, installation methods, air sealing, vapor control, and NY energy code.",
};

function applySection7Override(sections: SectionSummary[]): SectionSummary[] {
  return sections.map((s) => (s.id === 7n ? SECTION_7_SUMMARY : s));
}

/** Append the Pro Tips subsection to sections 1–6 fetched from the backend. */
function appendProTips(section: Section): Section {
  const num = Number(section.id);
  const tip = PRO_TIPS[num];
  if (!tip) return section;
  // Avoid duplicating if already present (e.g. cached refetch)
  const alreadyHasTip = section.subsections.some(
    (s) => s.subtitle === tip.subtitle,
  );
  if (alreadyHasTip) return section;
  return {
    ...section,
    subsections: [...section.subsections, tip],
  };
}

export function useGetAllSections() {
  const { actor, isFetching } = useActor();
  return useQuery<SectionSummary[]>({
    queryKey: ["sections"],
    queryFn: async () => {
      if (!actor) return [];
      const sections = await actor.getAllSections();
      return applySection7Override(sections);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSection(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Section | null>({
    queryKey: ["section", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      if (id === 7n) return SECTION_7_OVERRIDE;
      const section = await actor.getSection(id);
      return appendProTips(section);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useSearchSections(query: string) {
  const { actor, isFetching } = useActor();
  return useQuery<SearchResult[]>({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchSections(query.trim());
    },
    enabled: !!actor && !isFetching && query.trim().length > 0,
  });
}
