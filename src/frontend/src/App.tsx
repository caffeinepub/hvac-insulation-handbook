import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock,
  DollarSign,
  DoorOpen,
  Flag,
  Home,
  Loader2,
  Menu,
  Search,
  TrendingUp,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useActor } from "./hooks/useActor";

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
type TabView =
  | "home_page"
  | "handbook"
  | "history"
  | "sales_tips"
  | "in_home_process"
  | "calendar"
  | "financial"
  | "us_history";

interface Subsection {
  subtitle: string;
  body: string;
}

interface HandbookSection {
  id: number;
  title: string;
  description: string;
  subsections: Subsection[];
}

// ----------------------------------------------------------------
// Static Handbook Sections (fully self-contained, no backend needed)
// ----------------------------------------------------------------
const HANDBOOK_SECTIONS: HandbookSection[] = [
  {
    id: 1,
    title: "Heat Pump Condensers (New York)",
    description:
      "Outdoor unit components, climate considerations, refrigerant types, sizing, installation requirements, maintenance.",
    subsections: [
      {
        subtitle: "Outdoor Unit Components",
        body: "The condenser is the outdoor unit in a split heat pump system. It houses the compressor, condenser/evaporator coil, fan motor, and refrigerant reversing valve. In heating mode, the coil absorbs heat from outdoor air; in cooling mode, it rejects heat. The compressor is the heart of the system — it circulates refrigerant and is the most expensive component to replace. Scroll compressors are the standard in residential and light commercial equipment; inverter-driven variable-speed compressors are now common in cold-climate units and offer dramatically better part-load efficiency and quieter operation. Fan motors drive the condenser fan, which moves air across the coil. Variable-speed fan motors are increasingly common and contribute to both efficiency and low-ambient performance. The reversing valve is a solenoid-operated valve that shifts the direction of refrigerant flow between heating and cooling modes — it is a common failure point and should be checked whenever the system heats or cools in the wrong season.",
      },
      {
        subtitle: "NY Climate Considerations",
        body: "New York's climate creates unique demands on heat pump condensers. Temperatures can drop to 0°F or below in upstate regions and occasionally in the outer boroughs, while Long Island and coastal areas are somewhat milder. Standard heat pumps lose capacity as outdoor temperatures drop, and early-generation units were essentially ineffective below 15–20°F. Modern cold-climate heat pumps (defined by NEEP as maintaining rated capacity at 5°F and having minimum capacity rated at -13°F) have changed this picture entirely. Always specify cold-climate rated equipment for any NY installation. Defrost cycles are essential — the outdoor coil will ice over during heating mode. Check that the defrost board is functional and that the defrost termination thermostat is properly positioned. In coastal areas with salt air, coil corrosion is accelerated — look for units with coated or treated coils. Unit placement matters: keep condensers elevated above expected snow accumulation (typically 18–24 inches minimum on a wall bracket or pad riser), with unobstructed airflow clearances and away from prevailing winter winds.",
      },
      {
        subtitle: "Refrigerant Types",
        body: "Most units installed from roughly 2010 through 2024 use R-410A refrigerant, which operates at higher pressures than its predecessor R-22. R-410A has no ozone depletion potential but is a potent greenhouse gas with a GWP of approximately 2,088. Under the AIM Act, R-410A is being phased down beginning in 2025. New equipment is transitioning to lower-GWP refrigerants: R-32 (GWP ~675), R-454B (GWP ~466, used by Carrier as 'Puron Advance'), and R-290 (propane, GWP of 3, used in some smaller units). Technicians must understand that R-32 is mildly flammable (A2L classification), and R-290 is highly flammable (A3) — new safety protocols, tools, and potentially licensing requirements apply. Do not mix refrigerants or attempt to retrofit older R-22 systems with R-410A drop-ins without verifying compatibility.",
      },
      {
        subtitle: "Sizing & Installation",
        body: "Correct sizing is critical. An undersized condenser cannot meet the heating load in design-condition weather; an oversized unit short-cycles, reducing humidity control and equipment life. Manual J load calculations should be the basis for sizing decisions, not rules of thumb. In NY, pay attention to the NEEP cold-climate heat pump directory for verified low-temperature capacity ratings — nameplate tons at 47°F does not tell you what the unit will do at 17°F or 5°F. Installation requirements include: minimum clearances (front, sides, top) per manufacturer specs; concrete or composite pad or wall brackets rated for the unit weight; electrical disconnect within sight of the unit; proper line set sizing and insulation; and vibration isolation between unit and structure. NY requires permits for new installations and replacements — confirm local jurisdiction requirements.",
      },
      {
        subtitle: "Maintenance",
        body: "Annual maintenance should include: cleaning the condenser coil (gentle coil cleaner, low-pressure rinse — never high-pressure wash which bends fins); checking refrigerant charge via superheat and subcooling measurements; inspecting the reversing valve solenoid and testing operation; checking capacitor microfarad ratings (start and run capacitors degrade before failure); inspecting electrical connections, contacts, and contactor condition; verifying defrost operation; testing low ambient controls if installed; and documenting system pressures and temperatures for trend tracking. In NY, coil cleaning is especially important in urban environments where debris, cottonwood seeds, and air pollution foul the coil faster than in suburban settings. Bent fins should be straightened with a fin comb to restore airflow.",
      },
      {
        subtitle: "Pro Tips & Commonly Overlooked",
        body: "One of the most overlooked issues with heat pump condensers in NY is improper refrigerant charge — many techs blame the compressor when low charge is the real culprit. Always verify superheat and subcooling before condemning a compressor. Check that the defrost board is functioning correctly; a stuck defrost relay will keep the unit in defrost and cause ice buildup even in mild weather. Verify that the reversing valve is fully shifting — a partially stuck valve causes complaints of poor heating or cooling with no obvious fault code. Don't overlook dirty or blocked condenser coils; even partial fouling significantly reduces efficiency. In NY winters, make sure the unit is elevated above typical snow accumulation levels — units sitting in ice will short-cycle and trip on low pressure. Always check discharge line temperature as a quick compressor health indicator.",
      },
    ],
  },
  {
    id: 2,
    title: "Heat Pump Air Handlers (New York)",
    description:
      "Indoor unit components, coil types, blower motors, NY-specific installation, common issues.",
    subsections: [
      {
        subtitle: "Indoor Unit Components",
        body: "The air handler is the indoor half of the split heat pump system. It contains the evaporator/condenser coil (which serves both functions depending on season), the blower assembly, the electric auxiliary heat section, the expansion device, and the control board. In heating mode, hot refrigerant from the outdoor unit condenses in the indoor coil and releases heat into the airstream. In cooling mode, cold refrigerant evaporates in the coil, absorbing heat and humidity from the return air. The air handler also typically houses electric strip heaters — these are resistance heaters that supplement the heat pump when outdoor temperatures are extreme or when the heat pump is in defrost. Strip heaters are staged and controlled by the thermostat; proper staging is critical for both comfort and electrical load management.",
      },
      {
        subtitle: "Coil Types",
        body: "Most residential air handlers use aluminum fin / copper tube coil construction, though all-aluminum coils (microchannel design) are increasingly common and offer better corrosion resistance. Coil face area and circuit design determine airflow resistance and refrigerant distribution — a coil that is too small for the airflow will have high air-side pressure drop, reducing system efficiency and potentially causing freeze-ups. Always verify coil match to the outdoor unit — manufacturers publish matched system efficiency ratings, and mismatched equipment is a common source of performance complaints. In NY, formicary corrosion (a pitting pattern caused by formic acid from volatile organic compounds common in newer construction) affects copper tube coils. If a coil develops pinhole leaks and the home has new flooring, cabinets, or cleaning products present, suspect formicary corrosion — aluminum coils are immune.",
      },
      {
        subtitle: "Blower Motors",
        body: "Modern air handlers use either PSC (permanent split capacitor) or ECM (electronically commutated motor) blower motors. ECM motors are dramatically more efficient — typically using 50–75% less energy than PSC motors at comparable airflow — and are required under current federal efficiency standards for most residential air handlers. ECM motors also maintain more consistent airflow across varying external static pressure (duct resistance), which matters significantly in NY homes with older, undersized ductwork. When diagnosing airflow complaints, verify motor type and speed settings. ECM motors can be programmed to different airflow profiles; factory defaults are not always appropriate for the installed duct system. Variable-speed ECM motors (as opposed to multi-speed ECM) allow the system to modulate airflow continuously, providing quieter operation and better humidity control.",
      },
      {
        subtitle: "NY-Specific Installation",
        body: "NY installations must account for: condensate disposal (drain line must comply with local plumbing code; condensate pump required in many basement installs; use of a secondary drain pan with float switch in attic or finished space locations); ductwork insulation requirements (NY energy code requires insulation on ducts outside conditioned space — R-6 minimum, R-8 preferred); filter access (NY energy code requires serviceable filters in accessible locations); and electrical requirements (NEC article 440 governs HVAC electrical; NY may have local amendments). In NYC specifically, Department of Buildings requirements add additional inspection and permit obligations. For installations in existing homes, verify that the existing duct system is adequately sized — a new, correctly sized air handler connected to undersized or leaky ductwork will underperform regardless of equipment quality.",
      },
      {
        subtitle: "Common Issues",
        body: "Frozen coils are a frequent complaint and have multiple causes: low refrigerant charge, insufficient airflow (dirty filter, blocked return, closed registers, undersized ducts), low outdoor temperatures during cooling season, or an oversized system running long cycles at very low load. Always identify the root cause before clearing ice. Airflow restrictions account for the majority of air handler performance complaints — check filter condition, verify all return air grilles are unobstructed, and measure static pressure before diagnosing refrigerant issues. Control board failures are more common than they should be, often caused by power surges, improper grounding, or water from condensate drips. When a control board fails, check the installation quality before assuming manufacturing defect.",
      },
      {
        subtitle: "Pro Tips & Commonly Overlooked",
        body: "Restricted airflow is the most commonly missed cause of poor performance in air handlers. Always check static pressure across the coil and at the unit — high static kills efficiency and can freeze the coil. Dirty evaporator coils are frequently overlooked, especially on units that haven't had filter changes. A clogged condensate drain will trip the safety float switch and shut the unit down — this is often misdiagnosed as an electrical or control issue. Check that auxiliary/emergency heat is wired and staged correctly; many installs leave aux heat unconfigured. On variable-speed air handlers, verify that the ECM motor is receiving the correct control signal — a failed communication wire causes the blower to run at wrong speeds. Inspect the filter rack for bypass air around the filter edges, which allows dirt to coat the coil.",
      },
    ],
  },
  {
    id: 3,
    title: "Thermostats",
    description:
      "Types, wiring, programming, and compatibility information for heat pumps and dual-fuel systems.",
    subsections: [
      {
        subtitle: "Thermostat Types",
        body: "Thermostats fall into four broad categories: electromechanical (mercury bulb/bimetallic strip — still found in older NY homes, no longer installed), single-stage electronic (simple on/off, adequate for single-stage systems), multi-stage/heat pump thermostats (required for heat pump systems — must distinguish between compressor stages and auxiliary/emergency heat), and smart/communicating thermostats (Wi-Fi enabled, learning algorithms, remote access, utility demand response participation). For heat pump installations, the thermostat must be heat-pump-specific — a standard heating/cooling thermostat will not correctly stage the system and will miscontrol auxiliary heat. Communicating thermostats (using proprietary protocols like Daikin, Mitsubishi, or Carrier's system-bus communication) offer additional diagnostics and often tighter control over variable-speed systems.",
      },
      {
        subtitle: "Wiring",
        body: "The standard residential thermostat wiring convention uses letter designations: R = 24VAC power (Rh = heating transformer, Rc = cooling transformer, R = combined); C = common (return to transformer — essential for smart thermostats and reliable operation); Y = compressor/cooling call; Y2 = second stage cooling; G = fan/blower call; W = heating call (gas/oil/electric); W2 = second stage heat or auxiliary heat; O = reversing valve (energized in cooling — most brands); B = reversing valve (energized in heating — Carrier/Bryant). On heat pump systems, the O or B terminal controls the reversing valve — the most critical wiring decision. Getting this wrong causes the system to heat when it should cool and vice versa. Always identify the equipment brand and verify whether O or B is used before completing the wiring.",
      },
      {
        subtitle: "Programming",
        body: "Modern smart thermostats offer scheduling, geofencing, learning, and remote access. For maximum energy savings in NY, use setback temperatures: 68°F daytime heating, 65°F overnight, 60°F when unoccupied. However, setback schedules interact poorly with heat pump systems — large temperature recoveries force the system into auxiliary/emergency heat, which is far less efficient than maintaining a moderate setpoint. For heat pump homes, use modest setbacks (2–3°F maximum) or consider smart thermostats with 'heat pump optimization' modes that recover setpoints slowly using only the compressor. Dual-fuel systems (heat pump + gas/oil backup) should be programmed with a balance point lockout temperature — typically 35–40°F — below which the gas/oil furnace takes over and the heat pump is locked out.",
      },
      {
        subtitle: "Compatibility",
        body: "Thermostat compatibility issues are extremely common in NY service work, particularly with older equipment, heat pump systems, and hybrid setups. Key compatibility checks: Does the system need a C-wire? (Most smart thermostats require one; use an add-a-wire adapter kit if not present — do not use the G wire as a common). Is the system heat-pump or conventional? (Using a conventional thermostat on a heat pump causes reversing valve and auxiliary heat staging errors). Is the system single-stage or multi-stage? (A single-stage thermostat on a two-stage compressor locks the compressor in high stage, wasting energy and causing comfort complaints). Is voltage correct? (Most residential is 24VAC; millivolt systems used with gas fireplaces and some older gravity furnaces are incompatible with standard thermostats). Always check the old thermostat wiring photo before disconnecting anything.",
      },
      {
        subtitle: "Pro Tips & Commonly Overlooked",
        body: "The C-wire (common wire) is the most frequent source of thermostat problems — without a stable 24V common, smart thermostats behave erratically or drain battery power. Always verify C-wire presence and continuity before replacing a thermostat. On heat pump systems, confirm the O/B wire is set correctly for the equipment brand — Carrier/Bryant use B (energized in heating), most others use O (energized in cooling). A misset O/B will cause the system to heat when it should cool and vice versa. Check for loose low-voltage connections at the air handler terminal board — these corrode over time and cause intermittent faults. Verify thermostat location isn't near a supply register, exterior wall, or in direct sunlight, which causes false readings. On dual-fuel systems, confirm the balance point (outdoor lockout temperature) is set correctly to prevent simultaneous gas and heat pump operation.",
      },
    ],
  },
  {
    id: 4,
    title: "Boilers (Gas/Oil)",
    description:
      "Boiler types, components, operation, code requirements, and maintenance information specific to New York.",
    subsections: [
      {
        subtitle: "Boiler Types",
        body: "New York has one of the most diverse boiler landscapes in the country, reflecting its dense, aging housing stock. Single-pipe steam systems dominate the pre-1950 building inventory, particularly in NYC and older upstate cities. These systems use a single pipe for both steam supply and condensate return — a design that requires careful pitch, correct radiator air vent sizing, and precise pressure control (typically 0.5–2.0 PSI). Two-pipe steam systems are more common in larger buildings and offer better control, though they require functional steam traps throughout the distribution system. Hot water (hydronic) systems, which circulate heated water through radiators or baseboard convectors, are the modern standard and the basis for virtually all new boiler installations. Combination boilers ('combi boilers') provide both space heating and domestic hot water from a single compact unit — popular in renovation projects where space is limited.",
      },
      {
        subtitle: "Components",
        body: "A residential boiler consists of: the heat exchanger (where combustion gases transfer heat to water), the burner assembly (nozzle, igniter, combustion air fan), the gas valve or fuel pump, the aquastat/limit controls, the expansion tank (absorbs volume changes as water heats and cools — a waterlogged expansion tank is a very common service issue), the circulator pump(s), the pressure/temperature relief valve (P/T relief — a critical safety device, must be correctly sized and piped to a safe discharge location), and the condensate system on high-efficiency (90%+) boilers. Modern boilers add modulating gas valves, outdoor reset controls, and communicating controls for optimized efficiency.",
      },
      {
        subtitle: "Operation",
        body: "Boiler operation begins with a call for heat from the thermostat. The control system verifies safe conditions (water pressure, limit thermostat, low water cutoff) before energizing the burner. On gas boilers, the gas valve opens and the igniter (hot surface or direct spark) lights the burner. Combustion gases travel through the heat exchanger, heating the water in the system. The circulator pump(s) move hot water to the distribution system — radiators, baseboards, radiant floor loops, or fan coil units. On steam systems, water boils to produce steam, which rises through the piping by pressure differential. Proper steam boiler operation depends on correct water level, minimal pressure, and properly functioning air vents — problems with any of these cause uneven heat, water hammer, or no heat.",
      },
      {
        subtitle: "NY Code Requirements",
        body: "New York State follows the Uniform Fire Prevention and Building Code (Uniform Code) for residential boiler installations. Key requirements include: gas piping must comply with NFPA 54 / ANSI Z223.1; oil piping and tank installation must comply with NFPA 31; combustion air must be provided per NFPA 54 for confined spaces; venting must comply with the manufacturer's installation instructions and applicable standards (Category I-IV for gas, UL 726 for oil); pressure relief valves must be set at the maximum allowable working pressure and piped to discharge within 6 inches of the floor; boilers must be listed and labeled by a nationally recognized testing laboratory. NYC adds Local Law requirements and DEP restrictions on fuel oil sulfur content and eventual phaseout of heavy fuel oil (No. 4 and No. 6) in buildings.",
      },
      {
        subtitle: "Maintenance",
        body: "Annual boiler maintenance should include: oil-fired: replace nozzle, oil filter, and fuel strainer; clean combustion chamber; check and adjust electrodes; perform combustion analysis (CO2, O2, CO, net stack temperature, smoke spot); check heat exchanger integrity. Gas-fired: inspect burner assembly; clean if needed; verify gas pressure at manifold; test safety controls; inspect heat exchanger for cracks or corrosion; verify venting integrity and termination clearances; test P/T relief valve operation. All boilers: verify correct water pressure (typically 12–15 PSI cold, rising to 20–25 PSI at operating temperature); check and service expansion tank; inspect and test low water cutoff; verify circulator pump operation; bleed air from radiators and air separators; test and inspect all zone valves.",
      },
      {
        subtitle: "Pro Tips & Commonly Overlooked",
        body: "Air in the system is one of the most common and overlooked boiler problems — it causes banging, gurgling, and uneven heat distribution. Always bleed radiators and check the auto-vent after any work. Low water cutoff (LWCO) devices are frequently dirty or stuck — a failed LWCO will shut the boiler down and is often misread as a burner or ignition problem. Check expansion tank pressure and bladder condition; a waterlogged expansion tank causes pressure relief valves to weep and the system to over-pressurize. On oil boilers, a dirty or worn nozzle is the leading cause of hard starts, soot buildup, and smoke — replace the nozzle annually. Verify flue draft and combustion air supply; insufficient combustion air causes incomplete combustion and carbon monoxide risk. On steam systems, check steam trap operation — failed traps that are stuck open cause water hammer and uneven heat throughout the building.",
      },
    ],
  },
  {
    id: 5,
    title: "Furnaces (Gas/Oil)",
    description:
      "Heat exchanger, burner, blower, controls, flue venting, code requirements, efficiency ratings, common issues.",
    subsections: [
      {
        subtitle: "Components",
        body: "A forced-air furnace consists of four major subsystems: the heat exchanger assembly (where combustion products heat the airstream without mixing combustion gases with supply air), the burner/ignition assembly, the blower and air distribution system, and the safety/control system. The heat exchanger is the most safety-critical component — a cracked or failed heat exchanger allows carbon monoxide to enter the living space. Inspecting heat exchangers for cracks, holes, or separation is a mandatory part of every furnace service. On 80% AFUE (standard efficiency) furnaces, the heat exchanger is a series of stamped steel or tubular sections; on 90%+ AFUE (high efficiency/condensing) furnaces, there is a primary heat exchanger and a secondary (condensing) heat exchanger that extracts additional heat from the flue gases, causing condensate to form.",
      },
      {
        subtitle: "Burners",
        body: "Gas furnace burners are either inshot (jets of gas fire into a tubular heat exchanger section) or upshot design. The gas valve controls pressure and volume of fuel; manifold pressure should be checked at each service. Ignition is typically via hot surface igniter (silicon carbide or silicon nitride) — these are fragile and degrade over time, often causing intermittent no-heat calls as they age. Direct spark igniters are less common in residential equipment. Oil furnace burners use a gun-type atomizing burner: an oil pump pressurizes fuel oil, which is sprayed through a nozzle and atomized into a fine mist that is ignited by an electric spark. Nozzle condition, electrode gap and position, oil pressure, and combustion air adjustment are all critical to clean, efficient combustion. A dirty or worn nozzle causes soot, hard starts, and smoke — replace annually.",
      },
      {
        subtitle: "Blower & Controls",
        body: "The furnace blower circulates air through the heat exchanger and into the duct system. Blower performance directly affects heat exchanger longevity — insufficient airflow overheats the heat exchanger, accelerating failure. Control systems on modern furnaces include the main control board (integrates all safety and sequencing functions), the inducer control (manages combustion air), pressure switches (verify inducer operation before allowing burner to fire), and limit switches (high temperature safety). On 90%+ furnaces, the combustion process is controlled more tightly — induced draft combustion, sealed combustion air, and pressure-switch monitoring of the condensate trap and secondary heat exchanger.",
      },
      {
        subtitle: "Flue Venting",
        body: "Venting requirements differ dramatically between 80% and 90%+ furnaces. Standard 80% furnaces use Category I venting (negative pressure, flue gas temperatures above dew point) — typically B-vent (double-wall galvanized) rising vertically through the structure to a chimney or direct-to-roof termination. This vent must be correctly sized, sloped, and supported; common errors include undersized vent connectors, horizontal runs that are too long, inadequate rise, and improper chimney liner sizing. High-efficiency 90%+ furnaces use PVC or CPVC direct-vent (Category IV) piping — two plastic pipes, one for combustion air intake and one for flue gas exhaust, typically exiting through the side wall. Installation errors include insufficient termination clearances, incorrect pipe materials, blocked drainage, and inadequate condensate trap depth for the inducer's negative pressure.",
      },
      {
        subtitle: "Efficiency Ratings",
        body: "AFUE (Annual Fuel Utilization Efficiency) measures what percentage of fuel energy ends up as useful heat. Standard furnaces run 80% AFUE — meaning 20% of fuel energy goes up the flue. High-efficiency condensing furnaces run 90–98.5% AFUE by extracting heat from the flue gases until they condense. In NY, choosing between 80% and 90%+ depends on installation specifics: 80% units require a masonry chimney or B-vent; 90%+ units require direct-vent PVC piping and a condensate disposal system. In homes without an existing chimney, 90%+ may be cheaper to install because it avoids chimney liner costs. Federal minimum AFUE standards are 80% for non-weatherized gas furnaces in the northern US; NY code may have additional requirements — verify locally.",
      },
      {
        subtitle: "Pro Tips & Commonly Overlooked",
        body: "Cracked heat exchangers are a serious safety hazard and are frequently missed on visual inspection — use a combustion analyzer and perform a CO test in the supply air before clearing any furnace. Flame rollout switches and high limit switches that have tripped once are often reset and ignored; always investigate the root cause (blocked flue, dirty filter, cracked heat exchanger, inadequate combustion air). Inducer motor bearings fail before the motor stops completely — listen for noise and check amp draw. A partially failing inducer causes pressure switch lockouts that are misdiagnosed as pressure switch failures. On 90%+ furnaces, check the condensate trap and drain for blockages; a clogged trap will cause nuisance pressure switch faults. Verify gas pressure at the manifold — low gas pressure causes ignition problems and poor heat output that is often blamed on the igniter or control board. On oil furnaces, inspect the combustion chamber for erosion and the heat exchanger for cracks or rust annually.",
      },
    ],
  },
  {
    id: 6,
    title: "HVAC Residential Electric Work",
    description:
      "Electrical panel requirements, wire sizing, circuit breakers, disconnects, low voltage wiring, NY codes.",
    subsections: [
      {
        subtitle: "Panel Requirements",
        body: "HVAC systems are significant electrical loads. Before adding a heat pump, air handler with strip heat, or large central AC, verify that the existing electrical service and panel have adequate capacity. A typical 3-ton heat pump with 10kW auxiliary heat requires a 240V circuit rated at approximately 60–70 amps for the combined load. Many NY homes — especially pre-1980 construction — have 100-amp service that cannot support a full electrification package. If a panel or service upgrade is needed, coordinate with a licensed electrician early in the project planning. NY requires a licensed master electrician (or a licensed contractor with a master electrician of record) for panel work and service upgrades. Always label new circuits clearly in the panel directory.",
      },
      {
        subtitle: "Wire Sizing",
        body: "NEC Article 440 governs HVAC wiring. Wire size must be adequate for the circuit's Minimum Circuit Ampacity (MCA) rating, which is listed on the equipment nameplate. Wire must also be protected by overcurrent protection (circuit breaker or fuse) not exceeding the Maximum Overcurrent Protection (MOCP) rating on the nameplate. Common residential HVAC wire: 14 AWG for 15A circuits (low-voltage equipment), 12 AWG for 20A, 10 AWG for 30A, 8 AWG for 40–50A, 6 AWG for 55–65A. In NYC and some other NY jurisdictions, conduit wiring (EMT or rigid conduit) is required for branch circuits — Romex (NM-B) is typically not permitted in NYC. Always use copper conductors; aluminum wiring for HVAC circuits requires listed aluminum-rated terminals and anti-oxidant compound.",
      },
      {
        subtitle: "Circuit Breakers",
        body: "Use only circuit breakers compatible with the panel brand and within the MOCP listed on the equipment nameplate. HVAC equipment typically uses HACR-type breakers (Heating, Air Conditioning, Refrigeration) which tolerate the high inrush current on compressor start. Never upsize a breaker beyond the MOCP to solve nuisance trips — instead, diagnose the root cause (failed capacitor, locked rotor, low voltage, excessive ambient temperature). GFCI protection is required for specific HVAC locations including in crawlspaces and garages under NEC 210.8. AFCI protection requirements vary by jurisdiction and circuit location; check local amendments. For new heat pump installations, install a dedicated circuit and breaker — never share with other loads.",
      },
      {
        subtitle: "Low Voltage Wiring",
        body: "Low voltage (24VAC) thermostat and control wiring is 18-24 AWG, typically multi-conductor thermostat cable. The industry standard is 18/5 or 18/8 (18 AWG, 5 or 8 conductors). For smart thermostats and heat pump systems, 8 conductors allows for all control functions including C-wire, stage 2, auxiliary heat, and emergency heat. Run new thermostat wire if the existing wire is undersized, damaged, or lacks sufficient conductors. Low voltage wiring must not be run in the same conduit as line voltage wiring. Secure thermostat wire at regular intervals; avoid stapling tightly (can crush and short conductors). In NYC, low voltage wiring must comply with NEC Article 725 requirements — in some occupancy types, plenum-rated cable is required for runs in air-handling spaces.",
      },
      {
        subtitle: "NY Electrical Codes",
        body: "New York State adopts the NEC with state amendments published in the Uniform Code. NYC uses a separate electrical code (the New York City Electrical Code, based on NEC with significant local amendments) enforced by the Department of Buildings. Key NY-specific points: licensed electricians required for most work; in NYC, permits required for all HVAC electrical work and inspections required; conduit required in NYC for branch circuits (not NM-B/Romex); specific requirements for work in multiple dwellings under the NYC Multiple Dwelling Law. Always pull permits and schedule inspections — not just for compliance, but to protect yourself and your customer. Unpermitted work creates liability for the contractor and can cause issues with insurance claims and property sales.",
      },
      {
        subtitle: "Pro Tips & Commonly Overlooked",
        body: "Undersized wire is a leading cause of nuisance breaker trips and equipment damage — always verify wire gauge against the equipment's MCA (minimum circuit ampacity) and MOCP (maximum overcurrent protection) ratings on the nameplate. Many techs overlook voltage imbalance on multi-phase equipment — even a small imbalance (over 2%) dramatically shortens compressor life. Check voltage at the equipment terminals under load, not just at the panel. Loose connections are the number one cause of electrical failures in HVAC — terminals oxidize and loosen over time. Inspect and torque all connections at the contactor, capacitor, and disconnect during every service call. The disconnect must be within sight of the equipment and rated for the load — verify this on every install. On heat pump installs, confirm the correct wire size is used for the aux/emergency heat circuit, which is often a much higher amperage circuit than the heat pump compressor circuit.",
      },
    ],
  },
  {
    id: 7,
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
      {
        subtitle: "Pro Tips & Commonly Overlooked",
        body: "The biggest mistake in insulation work is adding insulation without air sealing first — insulation slows conductive heat transfer, but air leaks bypass insulation entirely and account for 30-40% of heating/cooling losses in older NY homes. Always air seal before or during insulation installation. Bypasses in attics (top plates, dropped ceilings, interior wall cavities open to the attic) are invisible from the attic floor and are frequently skipped — these are the largest air leakage paths in most homes. Rim joists in basements are chronically under-insulated; closed-cell spray foam at the rim joist is one of the best bang-for-buck improvements available. Don't compress fiberglass batts — a 6-inch R-19 batt compressed into a 3.5-inch cavity performs closer to R-13. Verify vapor barrier placement: in NY, it goes on the warm-in-winter side (inside face of exterior walls). Installing it on the wrong side traps moisture in the wall cavity and causes mold and rot. On attic insulation jobs, confirm that soffit vents are not blocked by insulation — use baffles to maintain a clear airflow channel.",
      },
    ],
  },
];

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
  section: HandbookSection;
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
  const num = section.id;
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
// Section content panel
// ----------------------------------------------------------------
interface SectionPanelProps {
  sectionIndex: number | null;
}

function SectionPanel({ sectionIndex }: SectionPanelProps) {
  const section =
    sectionIndex !== null ? HANDBOOK_SECTIONS[sectionIndex] : null;

  if (!section) {
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

  const sectionNum = section.id;

  return (
    <motion.div
      key={section.id}
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
// Calendar Page
// ----------------------------------------------------------------
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

type SaveStatus = "idle" | "saving" | "saved" | "error";

function CalendarPage() {
  const { actor, isFetching: actorLoading } = useActor();
  const [notes, setNotes] = useState<[string, string, string, string, string]>([
    "",
    "",
    "",
    "",
    "",
  ]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [notesLoaded, setNotesLoaded] = useState(false);

  // Load notes once actor is ready
  useEffect(() => {
    if (actorLoading || !actor || notesLoaded) return;
    let cancelled = false;
    setIsLoading(true);
    setLoadError(false);
    actor
      .getCalendarNotes()
      .then((fetched) => {
        if (cancelled) return;
        const filled: [string, string, string, string, string] = [
          fetched[0] ?? "",
          fetched[1] ?? "",
          fetched[2] ?? "",
          fetched[3] ?? "",
          fetched[4] ?? "",
        ];
        setNotes(filled);
        setNotesLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [actor, actorLoading, notesLoaded]);

  const handleNoteChange = (idx: number, value: string) => {
    setNotes((prev) => {
      const next = [...prev] as [string, string, string, string, string];
      next[idx] = value.slice(0, 200);
      return next;
    });
    // Reset save status when user edits
    setSaveStatus("idle");
  };

  const handleClear = (idx: number) => {
    setNotes((prev) => {
      const next = [...prev] as [string, string, string, string, string];
      next[idx] = "";
      return next;
    });
    setSaveStatus("idle");
  };

  const handleSave = async () => {
    if (!actor) return;
    setSaveStatus("saving");
    try {
      await actor.saveCalendarNotes([...notes]);
      setSaveStatus("saved");
      // Reset to idle after 3 seconds
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
    }
  };

  return (
    <motion.div
      key="calendar"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-2xl mx-auto px-6 md:px-10 py-10"
    >
      {/* Page header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <CalendarDays
            size={16}
            style={{ color: "oklch(var(--handbook-amber))" }}
          />
          <span
            className="font-mono-code text-xs font-semibold tracking-widest uppercase"
            style={{ color: "oklch(var(--handbook-amber))" }}
          >
            Weekly Planner
          </span>
          <div
            className="h-px flex-1"
            style={{ background: "oklch(var(--handbook-rule))" }}
          />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4 leading-tight">
          Weekly Calendar
        </h1>
        <p
          className="text-base leading-relaxed max-w-lg"
          style={{ color: "oklch(var(--handbook-subtitle-text))" }}
        >
          Write your notes for each day, then hit Save. Notes are private and
          saved to your account.
        </p>
        <div
          className="mt-6 h-px"
          style={{ background: "oklch(var(--handbook-rule))" }}
        />
      </header>

      {/* Loading state */}
      {isLoading && (
        <div
          data-ocid="calendar.loading_state"
          className="flex items-center justify-center gap-3 py-16"
          style={{ color: "oklch(var(--handbook-amber))" }}
        >
          <Loader2 size={20} className="animate-spin" />
          <span className="font-mono-code text-sm">Loading notes…</span>
        </div>
      )}

      {/* Load error */}
      {!isLoading && loadError && (
        <div
          data-ocid="calendar.error_state"
          className="rounded-lg border px-5 py-4 mb-6 text-sm"
          style={{
            borderColor: "oklch(var(--destructive) / 0.4)",
            background: "oklch(var(--destructive) / 0.06)",
            color: "oklch(var(--destructive))",
          }}
        >
          Could not load your saved notes. Please try refreshing.
        </div>
      )}

      {/* Day rows */}
      {!isLoading && (
        <div className="space-y-4">
          {DAYS.map((day, idx) => {
            const charCount = notes[idx].length;
            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.25 }}
                className="group rounded-xl border border-border/60 overflow-hidden transition-shadow hover:shadow-sm"
              >
                {/* Day label row */}
                <div
                  className="flex items-center justify-between px-4 py-2.5"
                  style={{ background: "oklch(var(--sidebar))" }}
                >
                  <span
                    className="font-display text-sm font-semibold tracking-wide"
                    style={{ color: "oklch(var(--handbook-amber))" }}
                  >
                    {day}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className="font-mono-code text-xs"
                      style={{ color: "oklch(var(--muted-foreground))" }}
                    >
                      {charCount}/200
                    </span>
                    <button
                      type="button"
                      data-ocid={`calendar.clear_button.${idx + 1}`}
                      onClick={() => handleClear(idx)}
                      disabled={charCount === 0}
                      className={[
                        "text-xs px-2.5 py-1 rounded-md font-medium transition-all duration-150",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-handbook",
                        charCount > 0
                          ? "hover:bg-destructive/10 hover:text-destructive text-muted-foreground cursor-pointer"
                          : "text-muted-foreground/30 cursor-not-allowed",
                      ].join(" ")}
                      aria-label={`Clear ${day} note`}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Textarea */}
                <textarea
                  data-ocid={`calendar.textarea.${idx + 1}`}
                  value={notes[idx]}
                  onChange={(e) => handleNoteChange(idx, e.target.value)}
                  maxLength={200}
                  rows={3}
                  placeholder={`Notes for ${day}…`}
                  aria-label={`${day} notes`}
                  className={[
                    "w-full px-4 py-3 resize-none bg-background text-foreground text-sm leading-relaxed",
                    "placeholder:text-muted-foreground/40 focus:outline-none transition-colors",
                    "border-t border-border/40",
                  ].join(" ")}
                  style={{ fontFamily: "inherit" }}
                />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Save controls */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex items-center justify-between gap-4"
        >
          {/* Status indicators */}
          <div className="flex items-center gap-2 min-h-[28px]">
            <AnimatePresence mode="wait">
              {saveStatus === "saving" && (
                <motion.span
                  key="saving"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                  data-ocid="calendar.loading_state"
                  className="flex items-center gap-1.5 text-xs font-mono-code"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  <Loader2 size={12} className="animate-spin" />
                  Saving…
                </motion.span>
              )}
              {saveStatus === "saved" && (
                <motion.span
                  key="saved"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                  data-ocid="calendar.success_state"
                  className="text-xs font-mono-code"
                  style={{ color: "oklch(var(--handbook-amber))" }}
                >
                  ✓ Notes saved
                </motion.span>
              )}
              {saveStatus === "error" && (
                <motion.span
                  key="error"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                  data-ocid="calendar.error_state"
                  className="text-xs font-mono-code"
                  style={{ color: "oklch(var(--destructive))" }}
                >
                  ✕ Save failed — please try again
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Save button */}
          <button
            type="button"
            data-ocid="calendar.save_button"
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className={[
              "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold",
              "transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-handbook",
              saveStatus === "saving"
                ? "opacity-60 cursor-not-allowed"
                : "hover:opacity-90 active:scale-95",
            ].join(" ")}
            style={{
              background: "oklch(var(--handbook-amber))",
              color: "white",
            }}
          >
            {saveStatus === "saving" ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving…
              </>
            ) : (
              "Save Notes"
            )}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

// ----------------------------------------------------------------
// Financial Assistant Page
// ----------------------------------------------------------------
interface FinancialTerm {
  term: string;
  definition: string;
}

interface FinancialCategory {
  num: string;
  title: string;
  terms: FinancialTerm[];
}

const FINANCIAL_CATEGORIES: FinancialCategory[] = [
  {
    num: "01",
    title: "Stock Market Fundamentals",
    terms: [
      {
        term: "Bull Market",
        definition:
          "A period when stock prices are rising or are expected to rise, typically defined as a 20% or more increase from recent lows. Bull markets reflect investor optimism, strong economic conditions, and rising corporate earnings. The average bull market lasts several years and can produce substantial wealth for patient, diversified investors.",
      },
      {
        term: "Bear Market",
        definition:
          "A decline of 20% or more from recent highs in a broad market index. Bear markets are often associated with economic recessions, rising unemployment, or financial crises. Historically, bear markets last an average of 9–12 months, though severe examples like 2008–2009 can extend longer. Staying invested through bear markets is one of the most empirically validated long-term strategies.",
      },
      {
        term: "P/E Ratio (Price-to-Earnings)",
        definition:
          "A valuation metric calculated by dividing a company's stock price by its earnings per share. A P/E of 20 means investors pay $20 for every $1 of annual earnings. Higher P/E ratios suggest the market expects faster growth; very high ratios can indicate overvaluation. The S&P 500 historically averages a P/E of roughly 15–20.",
      },
      {
        term: "Market Capitalization",
        definition:
          "The total market value of a company's outstanding shares, calculated as share price × total shares outstanding. Companies are categorized as large-cap (>$10B), mid-cap ($2B–$10B), and small-cap (<$2B). Market cap determines a company's weight in major indexes and broadly correlates with stability (larger = more stable, smaller = more volatile but potentially higher growth).",
      },
      {
        term: "Dividend",
        definition:
          "A portion of a company's profits distributed to shareholders, typically paid quarterly. Dividend-paying stocks are common among established, profitable companies (utilities, consumer staples, financials). Dividends provide income and can signal financial health, though high yields can sometimes indicate a company in distress. Dividend reinvestment (DRIP) accelerates compounding significantly over time.",
      },
      {
        term: "Earnings Per Share (EPS)",
        definition:
          "Net income divided by the number of outstanding shares. EPS is a primary measure of profitability on a per-share basis. Quarterly EPS reports are major market-moving events — beating estimates tends to drive prices up, while missing estimates can cause sharp selloffs even in fundamentally healthy companies.",
      },
      {
        term: "IPO (Initial Public Offering)",
        definition:
          "The first sale of a company's stock to the public. IPOs allow private companies to raise capital and give early investors (founders, employees, VCs) liquidity. IPO stocks are often volatile in early trading; institutional investors typically receive allocations at the offer price. Retail investors should research IPO fundamentals carefully rather than buying solely on hype.",
      },
      {
        term: "Blue Chip Stock",
        definition:
          "Shares of large, well-established, financially stable companies with a long history of reliable performance — think Apple, Microsoft, Johnson & Johnson, Coca-Cola. Blue chips are considered lower risk than smaller companies and often pay dividends. They form the core of most conservative long-term portfolios.",
      },
      {
        term: "Index Fund",
        definition:
          "A fund that passively tracks a market index like the S&P 500 or the total stock market. Instead of trying to pick winning stocks, index funds hold all (or most) of the stocks in the index in proportion to their market weight. They offer broad diversification at very low cost and have consistently outperformed the majority of actively managed funds over 10-year+ periods.",
      },
      {
        term: "ETF (Exchange-Traded Fund)",
        definition:
          "Similar to an index fund but traded on an exchange like an individual stock, allowing intraday buying and selling. ETFs can track indexes, sectors, commodities, bonds, or virtually any strategy. Low-cost broad-market ETFs (such as those from Vanguard, Fidelity, or iShares) are among the most recommended investment vehicles for individual investors.",
      },
      {
        term: "S&P 500",
        definition:
          "A stock market index tracking 500 of the largest publicly traded U.S. companies, weighted by market cap. The S&P 500 is widely considered the best single benchmark for U.S. equity performance and the basis for countless index funds. Its annualized total return including dividends has historically averaged roughly 10% over long periods.",
      },
      {
        term: "Dow Jones Industrial Average",
        definition:
          "One of the oldest and most recognized U.S. stock indexes, tracking 30 large-cap blue-chip companies. The Dow is price-weighted (higher-priced stocks have more influence), which is a notable limitation. It is more of a historical barometer than a comprehensive market measure — the S&P 500 is generally considered a better representation of the overall market.",
      },
      {
        term: "NASDAQ Composite",
        definition:
          "A stock market index comprising more than 3,000 companies listed on the NASDAQ exchange, heavily weighted toward technology and growth companies. The NASDAQ tends to be more volatile than the S&P 500 and both outperforms and underperforms during technology boom and bust cycles respectively.",
      },
      {
        term: "Stock Split",
        definition:
          "When a company increases its total shares outstanding by issuing more shares to existing shareholders proportionally. A 2-for-1 split doubles the number of shares and halves the price. The total market cap doesn't change, but lower share prices can make the stock more accessible to smaller investors. Apple and Tesla have both executed notable splits in recent years.",
      },
      {
        term: "Bid/Ask Spread",
        definition:
          "The difference between the highest price a buyer is willing to pay (bid) and the lowest price a seller will accept (ask). For large-cap liquid stocks, spreads are tiny (fractions of a cent). For illiquid stocks or smaller assets, spreads can be significant — representing a cost that investors pay on every trade. Minimizing round-trip transaction costs is a real component of long-term returns.",
      },
      {
        term: "Stop-Loss Order",
        definition:
          "An order to sell a security automatically if its price falls to a specified level, designed to limit downside. For example, a stop-loss at 10% below purchase price would trigger a sale if the stock falls 10%. Stop-losses can prevent large losses but also lock in losses prematurely on volatile stocks. Professional traders debate their merit extensively.",
      },
    ],
  },
  {
    num: "02",
    title: "Cryptocurrency Terms & Advice",
    terms: [
      {
        term: "Bitcoin (BTC)",
        definition:
          "The first and largest cryptocurrency by market capitalization, created in 2009 by the pseudonymous Satoshi Nakamoto. Bitcoin operates on a decentralized blockchain with a fixed supply capped at 21 million coins. It is often described as 'digital gold' — a store of value and hedge against inflation. Bitcoin's price history is marked by extreme volatility, including multiple 70–80% drawdowns followed by new all-time highs.",
      },
      {
        term: "Ethereum (ETH)",
        definition:
          "The second-largest cryptocurrency, distinguished by its smart contract functionality — programmable code that executes automatically on the blockchain without intermediaries. Ethereum is the foundation for most DeFi protocols, NFTs, and decentralized applications. Unlike Bitcoin's fixed supply, Ethereum's supply is dynamic and has become deflationary at times following protocol upgrades.",
      },
      {
        term: "Altcoin",
        definition:
          "Any cryptocurrency other than Bitcoin. The altcoin market ranges from major, established assets like Ethereum, Solana, and Cardano to thousands of smaller, speculative tokens. Most altcoins carry substantially higher risk than Bitcoin — the majority of historically launched altcoins have lost 95%+ of their value or ceased to exist.",
      },
      {
        term: "Blockchain",
        definition:
          "A distributed digital ledger that records transactions across many computers simultaneously. Once recorded, data cannot be altered retroactively without changing all subsequent blocks and achieving consensus from the network. Blockchain technology underlies all cryptocurrencies and is also being explored for supply chain management, voting, healthcare records, and more.",
      },
      {
        term: "Hot Wallet vs. Cold Wallet",
        definition:
          "A hot wallet is connected to the internet (mobile app, exchange account, browser extension) — convenient but vulnerable to hacks and phishing. A cold wallet stores private keys offline (hardware device like a Ledger or Trezor, or paper wallet) — far more secure for significant holdings. The crypto maxim is: 'Not your keys, not your coins' — if you leave crypto on an exchange, you don't truly control it.",
      },
      {
        term: "Private Key / Public Key",
        definition:
          "A public key is your crypto wallet address — shareable, like a bank account number. A private key is the cryptographic secret that proves ownership and authorizes transactions — never share it with anyone. Losing your private key means losing access to your funds permanently. There is no 'forgot password' option in crypto; this is both its greatest strength and greatest risk.",
      },
      {
        term: "DeFi (Decentralized Finance)",
        definition:
          "Financial services — lending, borrowing, trading, earning yield — conducted through smart contracts on a blockchain, without banks or intermediaries. DeFi protocols like Uniswap, Aave, and Compound allow permissionless financial activity. While revolutionary in concept, DeFi carries significant risks: smart contract bugs, rug pulls, oracle failures, and extreme volatility have caused billions in losses.",
      },
      {
        term: "NFT (Non-Fungible Token)",
        definition:
          "A unique digital token on a blockchain that represents ownership of a specific asset — digital art, music, collectibles, or virtual real estate. Unlike cryptocurrency, which is fungible (one BTC equals another BTC), NFTs are unique. The 2021 NFT boom saw enormous speculation; prices subsequently collapsed dramatically. The underlying technology has real potential applications, but the speculative market was unsustainable.",
      },
      {
        term: "Staking",
        definition:
          "Locking cryptocurrency in a proof-of-stake blockchain network to help validate transactions, earning rewards in return — somewhat analogous to earning interest. Staking yields vary widely by asset and network conditions. Risks include: lockup periods during which you can't sell, price volatility of the staked asset, and smart contract risk on DeFi staking platforms.",
      },
      {
        term: "Dollar-Cost Averaging (DCA) in Crypto",
        definition:
          "Investing a fixed amount in crypto at regular intervals (weekly, monthly) regardless of price, rather than trying to time the market. DCA reduces the impact of volatility — you buy more coins when prices are low and fewer when high. This strategy has been highly effective for Bitcoin over multi-year horizons and is generally recommended over attempting to trade crypto short-term.",
      },
      {
        term: "Gas Fees",
        definition:
          "Transaction fees paid to network validators for processing transactions on Ethereum and similar blockchains. Gas fees fluctuate with network demand — they can be a few cents during quiet periods and tens of dollars during peak activity. High gas fees make small Ethereum transactions impractical and were a major driver of adoption of lower-fee competing blockchains.",
      },
      {
        term: "HODL",
        definition:
          "Crypto slang originating from a misspelled 'hold' — meaning to hold cryptocurrency through volatility rather than selling. HODL has become a community philosophy emphasizing long-term conviction over short-term price movements. Empirically, long-term Bitcoin holders have consistently outperformed traders attempting to time the market, despite gut-wrenching drawdowns along the way.",
      },
      {
        term: "Pump and Dump",
        definition:
          "A market manipulation scheme where the price of an asset is artificially inflated ('pumped') through coordinated buying and promotion, only to have the manipulators sell ('dump') at elevated prices, crashing the price and leaving other buyers with losses. Pump and dump schemes are extremely common in smaller, illiquid cryptocurrencies and in 'meme coins' promoted on social media. Avoid.",
      },
      {
        term: "Critical Warning: Crypto Risk",
        definition:
          "Cryptocurrency is highly speculative. Most crypto assets have experienced drawdowns of 70–90% and many have gone to zero. Regulatory risk, exchange insolvency (as demonstrated by the FTX collapse in 2022), technical failures, and fraud are real, ongoing threats. Never invest more than you can afford to lose entirely. Never put emergency funds or retirement savings into crypto. Never invest because of social media hype or celebrity endorsements.",
      },
    ],
  },
  {
    num: "03",
    title: "Derivatives Explained",
    terms: [
      {
        term: "What Is a Derivative?",
        definition:
          "A financial contract whose value is derived from an underlying asset — a stock, index, commodity, currency, or interest rate. Derivatives allow investors to speculate on price movements, hedge existing positions, or manage risk without owning the underlying asset directly. The global derivatives market is measured in hundreds of trillions of dollars in notional value and is the largest financial market in the world.",
      },
      {
        term: "Futures Contract",
        definition:
          "An agreement to buy or sell an asset at a predetermined price at a future date. Futures are standardized contracts traded on exchanges. They are used by producers (farmers locking in crop prices), corporations (airlines hedging fuel costs), and speculators. Futures require margin — posting a fraction of the contract value — creating leverage that can amplify both gains and losses dramatically.",
      },
      {
        term: "Options Contract",
        definition:
          "A contract giving the buyer the right — but not the obligation — to buy (call) or sell (put) an asset at a specified price (strike price) on or before a specific date (expiration). Options are powerful instruments for hedging, income generation, and speculation. Unlike futures, the maximum loss for an option buyer is limited to the premium paid.",
      },
      {
        term: "Call Option",
        definition:
          "Gives the holder the right to buy an asset at the strike price before expiration. Buyers profit when the underlying asset's price rises above the strike price plus premium paid. Call options are often used to speculate on rising prices with limited capital at risk. Sellers of call options collect the premium but take on unlimited potential loss if the asset rises sharply.",
      },
      {
        term: "Put Option",
        definition:
          "Gives the holder the right to sell an asset at the strike price before expiration. Put buyers profit when the underlying asset falls below the strike price minus the premium. Puts are commonly used as insurance (hedging) against a decline in a portfolio's value. A put option on stocks you own is functionally similar to buying insurance on your position.",
      },
      {
        term: "Strike Price",
        definition:
          "The predetermined price at which an option contract can be exercised. For a call option, the underlying asset must be above the strike price for the option to have intrinsic value. For a put option, the asset must be below the strike price. Options at the strike price are 'at the money,' above are 'in the money' for calls, and below are 'in the money' for puts.",
      },
      {
        term: "Premium",
        definition:
          "The price paid to purchase an options contract. The premium reflects the option's intrinsic value (how far in-the-money it is) plus time value (how long until expiration) plus implied volatility (market's expectation of future price movement). Higher volatility means higher premiums. Options buyers pay premiums; options sellers receive them.",
      },
      {
        term: "Leverage",
        definition:
          "The use of borrowed capital or derivative contracts to control a larger position than your actual capital would normally allow. Leverage multiplies both gains and losses. A 10:1 leveraged position means a 5% move in the underlying creates a 50% gain or loss on invested capital. Leverage is one of the primary reasons individual traders lose money — it transforms manageable drawdowns into account-wiping events.",
      },
      {
        term: "Margin",
        definition:
          "Borrowed money from a brokerage used to increase a position's size, or the collateral posted to hold a leveraged derivatives position. Margin accounts require maintaining a minimum balance; if losses reduce equity below the maintenance margin level, a margin call demands additional funds or forces position liquidation — often at the worst possible time.",
      },
      {
        term: "Hedging",
        definition:
          "Using derivatives or other instruments to reduce risk in an existing position. For example, a farmer growing corn sells corn futures contracts to lock in a price, protecting against a price drop. A portfolio manager buys put options to limit downside. Hedging reduces potential gains in exchange for reducing potential losses — it's portfolio insurance, not a profit strategy.",
      },
      {
        term: "Credit Default Swap (CDS)",
        definition:
          "A financial contract that functions like insurance against the default of a borrower. The buyer pays regular premiums; the seller pays out if the reference entity (a company or government) defaults on its debt. CDS contracts became notorious during the 2008 financial crisis — AIG's massive CDS exposure nearly brought down the global financial system, requiring a government bailout.",
      },
      {
        term: "Derivatives Risk Disclosure",
        definition:
          "Derivatives are complex instruments and carry significant risk of loss, including losses exceeding initial investment. They are primarily used by institutional investors and sophisticated traders. Retail investors who do not fully understand the mechanics, risks, and tax implications of derivatives should avoid them entirely or seek professional guidance before trading. The majority of retail options traders lose money.",
      },
    ],
  },
  {
    num: "04",
    title: "Long vs. Short",
    terms: [
      {
        term: "Going Long",
        definition:
          "The standard investment position — buying an asset with the expectation that its price will rise. When you buy stock, you are long that stock. Your maximum loss is limited to what you paid; your potential gain is theoretically unlimited. Long positions are the foundation of most retail investor portfolios.",
      },
      {
        term: "Going Short (Short Selling)",
        definition:
          "A strategy to profit from a declining asset price. A short seller borrows shares, sells them immediately at the current market price, and hopes to buy them back later at a lower price — returning the borrowed shares and keeping the difference as profit. Short selling is far more complex and risky than going long.",
      },
      {
        term: "Short Selling Mechanics",
        definition:
          "To short a stock, you borrow shares from your broker (who borrows them from other clients' accounts or its own inventory), sell them at the current price, and hold the proceeds. You owe the borrowed shares back. If the price falls, you buy shares at the lower price, return them, and profit. If the price rises, you must buy back at a higher price — a loss.",
      },
      {
        term: "Borrowing Shares",
        definition:
          "Short selling requires a locate — confirmation that shares are available to borrow. 'Hard to borrow' stocks (heavily shorted, low float) have high borrowing fees that eat into potential profits. Shares can also be 'called back' by the lender at any time, forcing the short seller to cover immediately regardless of their position.",
      },
      {
        term: "Margin Account Requirement",
        definition:
          "Short selling requires a margin account. You must maintain a minimum margin balance as collateral for the borrowed shares. If the stock rises significantly, your equity falls and you may receive a margin call requiring you to deposit more funds or close the position. This forced closure at a loss is a defining feature of short selling risk.",
      },
      {
        term: "Short Interest",
        definition:
          "The percentage of a company's float (freely tradable shares) that has been sold short. High short interest (15%+) indicates significant market pessimism about a stock. It can also set up a short squeeze — when rising prices force short sellers to buy back shares, driving prices even higher in a self-reinforcing cycle.",
      },
      {
        term: "Short Squeeze",
        definition:
          "When a heavily shorted stock's price rises rapidly, forcing short sellers to buy back shares to limit losses. This buying pressure drives the price even higher, triggering more short covering in a cascade. Short squeezes can cause explosive, rapid price movements in short periods. The 2021 GameStop situation is the most famous modern example.",
      },
      {
        term: "GameStop (GME) — A Case Study",
        definition:
          "In January 2021, retail investors coordinating on Reddit's WallStreetBets forum collectively bought GameStop shares and call options, driving a massive short squeeze on institutional short sellers including hedge fund Melvin Capital. GME rose from roughly $20 to nearly $500 in weeks before collapsing. It demonstrated the power of retail coordination and the existential risk that short sellers face when a squeeze ignites.",
      },
      {
        term: "Covering a Short",
        definition:
          "Buying back the shorted shares to close the position and return them to the lender. Covering is done when the trade is profitable (stock fell as expected) or as a risk management measure (stock rose unexpectedly). Covering a losing short position locks in the loss but stops the potential for further unlimited losses.",
      },
      {
        term: "Unlimited Loss Potential",
        definition:
          "The most critical distinction between going long and going short: when you buy a stock, you can lose at most 100% of what you paid (the stock goes to zero). When you short a stock, there is theoretically no ceiling on how high the stock can go — meaning short sellers face theoretically unlimited losses. Stocks have risen 1,000%+ while heavily shorted, destroying short sellers in the process.",
      },
      {
        term: "When Professionals Go Short",
        definition:
          "Professional short sellers typically target companies with accounting fraud, flawed business models, excessive debt, or misrepresented financials. Famous short sellers like Jim Chanos identified Enron's accounting fraud years before its collapse. Successful short selling requires deep fundamental research, timing, and the ability to survive temporary price rises against your position. It is extraordinarily difficult to do profitably over time.",
      },
      {
        term: "Retail Investor Caution",
        definition:
          "Short selling is not appropriate for most retail investors. The combination of unlimited loss potential, margin requirements, borrowing costs, and the fundamental headwind of stock markets trending upward over time makes short selling a losing proposition for those without institutional-level research and risk management. Most retail traders who attempt short selling lose money.",
      },
    ],
  },
  {
    num: "05",
    title: "Economic Indicators",
    terms: [
      {
        term: "GDP (Gross Domestic Product)",
        definition:
          "The total monetary value of all goods and services produced within a country in a given period. GDP is the primary measure of economic size and growth. Two consecutive quarters of negative GDP growth is the traditional definition of a recession. The U.S. GDP is approximately $27 trillion annually, making it the world's largest single economy.",
      },
      {
        term: "Inflation (CPI)",
        definition:
          "The Consumer Price Index (CPI) measures the average change in prices paid by consumers for a basket of goods and services. Inflation erodes purchasing power over time — $100 today buys less than $100 bought a decade ago. The Federal Reserve targets 2% annual inflation as a sustainable level. The 2021–2023 inflation surge in the U.S. peaked at 9.1% and was the highest in 40 years.",
      },
      {
        term: "Federal Funds Rate",
        definition:
          "The interest rate at which banks lend money to each other overnight, set by the Federal Reserve's Federal Open Market Committee (FOMC). This rate is the most influential short-term interest rate in the global economy — it affects everything from mortgage rates and car loans to corporate bond yields and savings account interest. Raising rates fights inflation; lowering rates stimulates economic activity.",
      },
      {
        term: "The Federal Reserve (The Fed)",
        definition:
          "The central bank of the United States, operating independently within the government. The Fed has two statutory mandates: maximum employment and stable prices (2% inflation target). It controls monetary policy primarily through setting the federal funds rate and managing its balance sheet. Fed decisions and communications move global financial markets and are closely followed by every professional investor.",
      },
      {
        term: "Interest Rates and Market Relationship",
        definition:
          "Rising interest rates generally hurt stock valuations (higher discount rates reduce the present value of future earnings), hurt bond prices (existing bonds paying lower rates become less attractive), increase borrowing costs for businesses and consumers, and strengthen the dollar. Falling rates do the opposite. The 2022 rate hiking cycle — the fastest since the 1980s — caused the worst simultaneous stock and bond decline in decades.",
      },
      {
        term: "Yield Curve",
        definition:
          "A graph plotting the interest rates of bonds with identical credit quality across different maturity dates. Normally, the yield curve slopes upward — longer-term bonds pay higher yields to compensate for holding them longer. The shape of the yield curve reflects economic expectations and is one of the most watched macroeconomic signals.",
      },
      {
        term: "Inverted Yield Curve",
        definition:
          "When short-term interest rates exceed long-term rates — an unusual condition that historically precedes recessions. An inverted yield curve (specifically when 2-year Treasury yields exceed 10-year yields) has preceded every U.S. recession of the past 50 years, though with variable lead times. The yield curve inverted significantly in 2022–2023 amid Fed rate hikes.",
      },
      {
        term: "Recession",
        definition:
          "Broadly defined as two consecutive quarters of negative GDP growth. The National Bureau of Economic Research (NBER) makes official U.S. recession determinations using multiple indicators including employment, income, production, and sales. Recessions vary greatly in severity — from mild, brief contractions to the deep financial crises of 2008–2009 (Great Recession) and 2020 (COVID recession).",
      },
      {
        term: "Unemployment Rate",
        definition:
          "The percentage of the labor force that is jobless and actively seeking work. The U.S. Bureau of Labor Statistics publishes the monthly unemployment report, which is among the most market-moving economic releases. 'Full employment' is generally considered around 4–5% unemployment — some level of joblessness always exists as people change careers or locations.",
      },
      {
        term: "Consumer Confidence Index",
        definition:
          "A survey-based measure of how optimistic consumers feel about the economy and their personal financial situation. High consumer confidence correlates with increased spending, which drives roughly 70% of U.S. GDP. Sharp drops in consumer confidence often precede or accompany economic slowdowns. It is a forward-looking indicator rather than a measure of current conditions.",
      },
      {
        term: "Quantitative Easing (QE)",
        definition:
          "A monetary policy tool where the Federal Reserve creates money to purchase financial assets (primarily Treasury bonds and mortgage-backed securities), expanding its balance sheet and injecting money into the financial system. QE is used when interest rates are near zero and more stimulus is needed. The Fed used massive QE programs during the 2008 financial crisis and the 2020 COVID pandemic.",
      },
      {
        term: "Stagflation",
        definition:
          "A particularly difficult economic condition combining high inflation, high unemployment, and slow economic growth simultaneously — contradicting the typical relationship where inflation and unemployment move in opposite directions. The U.S. experienced stagflation during the 1970s following oil price shocks. It is considered one of the most challenging environments for monetary policy because the tools to fight inflation (raising rates) worsen unemployment.",
      },
      {
        term: "Fiscal vs. Monetary Policy",
        definition:
          "Fiscal policy is government spending and taxation, controlled by Congress and the President. Monetary policy is management of the money supply and interest rates, controlled by the Federal Reserve. Stimulus programs (fiscal), tax cuts (fiscal), and interest rate changes (monetary) are the primary levers governments use to manage economic cycles. The interaction between the two — especially when they work at cross purposes — shapes market conditions profoundly.",
      },
    ],
  },
  {
    num: "06",
    title: "General Investing Principles",
    terms: [
      {
        term: "Diversification",
        definition:
          "Spreading investments across different asset classes, sectors, geographies, and instruments to reduce the risk that any single investment can devastate your portfolio. A diversified portfolio might hold U.S. stocks, international stocks, bonds, and real estate. The core principle: don't put all your eggs in one basket. Diversification doesn't eliminate risk, but it is the closest thing to a free lunch in investing.",
      },
      {
        term: "Asset Allocation",
        definition:
          "The strategic distribution of investments across different asset classes — stocks, bonds, cash, real estate, commodities. Research consistently shows that asset allocation, not individual security selection, is the primary driver of long-term portfolio returns. A common rule of thumb: subtract your age from 110 to determine your stock percentage (e.g., age 40 → 70% stocks, 30% bonds), though individual risk tolerance should guide the actual decision.",
      },
      {
        term: "Risk Tolerance",
        definition:
          "Your capacity and willingness to endure investment losses without selling at the wrong time. Financial risk tolerance is both psychological (how you react emotionally to losing money) and practical (how long you have until you need the money). Investing more aggressively than your true risk tolerance virtually always leads to panic-selling at market bottoms — the worst possible outcome.",
      },
      {
        term: "Time Horizon",
        definition:
          "The length of time you expect to hold an investment before needing the funds. Longer time horizons justify more risk — a 25-year-old investing for retirement at 65 has 40 years to recover from market downturns. Short-term money (needed within 1–2 years) should not be in stocks. The stock market has never experienced a 20-year period with a negative total return.",
      },
      {
        term: "Compound Interest",
        definition:
          "Earning returns on both your original investment and on previously earned returns — interest on interest. Einstein allegedly called it the eighth wonder of the world. $10,000 growing at 10% annually becomes $17,000 in 6 years, $67,000 in 20 years, and $452,000 in 40 years. Starting early is exponentially more valuable than investing more later — time is the most powerful variable in wealth building.",
      },
      {
        term: "Dollar-Cost Averaging (DCA)",
        definition:
          "Investing a fixed dollar amount at regular intervals regardless of market price. DCA removes the emotional burden of trying to time the market and automatically results in buying more shares when prices are low and fewer when high. Research consistently shows that most attempts at market timing underperform consistent DCA investing. Setting up automatic monthly investments is one of the highest-impact decisions an individual investor can make.",
      },
      {
        term: "Tax-Advantaged Accounts: IRA and 401(k)",
        definition:
          "Individual Retirement Accounts (IRAs) and employer-sponsored 401(k) plans offer powerful tax benefits that dramatically increase long-term wealth accumulation. Traditional versions provide tax deductions now with taxes paid at withdrawal. Roth versions are funded with after-tax dollars but grow completely tax-free. Maximizing contributions to these accounts before investing in taxable accounts is almost universally recommended by financial planners.",
      },
      {
        term: "Portfolio Rebalancing",
        definition:
          "Periodically buying and selling assets to restore your target asset allocation. As stocks rise relative to bonds, your portfolio drifts toward a higher stock percentage than intended. Annual or threshold-based rebalancing (when any asset drifts more than 5% from target) maintains your intended risk level and forces disciplined buying of underperformers and selling of outperformers.",
      },
      {
        term: "Expense Ratios",
        definition:
          "The annual fee charged by a fund, expressed as a percentage of assets under management. A 1% expense ratio on $100,000 costs $1,000 per year — and those costs compound over time. Index funds typically charge 0.03–0.20%. Actively managed funds typically charge 0.5–1.5%. Over 30 years, the difference between a 0.05% and a 1.0% expense ratio on a $50,000 investment is over $100,000 in lost returns.",
      },
      {
        term: "Avoiding Emotional Investing",
        definition:
          "The single greatest threat to individual investor returns is not market crashes or poor security selection — it is behavioral: panic-selling during downturns and chasing performance during rallies. DALBAR's annual studies consistently show that the average equity fund investor significantly underperforms the funds they invest in, primarily because of ill-timed buying and selling. A written investment policy that you commit to before markets move is the most effective defense.",
      },
      {
        term: "Emergency Fund Before Investing",
        definition:
          "Financial planners uniformly recommend establishing 3–6 months of living expenses in an accessible savings account before investing. Without this buffer, an unexpected job loss or medical expense forces you to liquidate investments — potentially at a loss, at the worst possible time. The emergency fund is the foundation upon which all investment activity rests.",
      },
      {
        term: "Never Invest Borrowed Money",
        definition:
          "Investing with borrowed money (outside of specific, understood margin strategies) is one of the most dangerous financial decisions a person can make. If the investment loses value, you still owe the full amount borrowed plus interest. Markets can and do drop 30–50%, and they can stay depressed for years. Borrowed money creates forced selling at the worst times. This principle applies to home equity loans, credit cards, personal loans, and crypto leverage platforms.",
      },
      {
        term: "Due Diligence",
        definition:
          "The process of thoroughly researching an investment before committing capital. For stocks: read financial statements, understand the business model, assess competitive position and management quality, evaluate valuation. For funds: review historical performance, expense ratios, manager tenure, and strategy. The higher the potential return promised, the more scrutiny is required — extraordinary returns almost always come with extraordinary (and often hidden) risks.",
      },
    ],
  },
];

function FinancialAssistantPage() {
  return (
    <motion.div
      key="financial"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-3xl mx-auto px-6 md:px-10 py-10"
    >
      {/* Page header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign
            size={16}
            style={{ color: "oklch(var(--handbook-amber))" }}
          />
          <span
            className="font-mono-code text-xs font-semibold tracking-widest uppercase"
            style={{ color: "oklch(var(--handbook-amber))" }}
          >
            Financial Reference
          </span>
          <div
            className="h-px flex-1"
            style={{ background: "oklch(var(--handbook-rule))" }}
          />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-5 leading-tight">
          Financial Assistant
        </h1>
        <p
          className="text-base leading-relaxed max-w-2xl"
          style={{ color: "oklch(var(--handbook-subtitle-text))" }}
        >
          A comprehensive reference covering stock market fundamentals,
          cryptocurrency terms and advice, derivatives, long vs. short
          strategies, economic indicators, and general investing principles —
          plain-language explanations for every term.
        </p>
        <div
          className="mt-8 h-px"
          style={{ background: "oklch(var(--handbook-rule))" }}
        />
      </header>

      {/* Categories */}
      <div className="space-y-14">
        {FINANCIAL_CATEGORIES.map((category, catIdx) => (
          <motion.section
            key={category.num}
            data-ocid={`financial.category.item.${catIdx + 1}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIdx * 0.06, duration: 0.3 }}
          >
            {/* Category header */}
            <div className="flex items-baseline gap-3 mb-6">
              <span
                className="font-mono-code text-xs font-medium shrink-0"
                style={{ color: "oklch(var(--handbook-section-num))" }}
                aria-hidden="true"
              >
                {category.num}
              </span>
              <h2 className="font-display text-2xl font-semibold text-foreground leading-snug">
                {category.title}
              </h2>
            </div>

            {/* Terms */}
            <div className="space-y-6 pl-9">
              {category.terms.map((item, termIdx) => (
                <motion.div
                  key={item.term}
                  data-ocid={`financial.term.item.${termIdx + 1}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: catIdx * 0.06 + termIdx * 0.03,
                    duration: 0.25,
                  }}
                >
                  <h3
                    className="font-display text-base font-semibold mb-1.5 leading-snug"
                    style={{ color: "oklch(var(--handbook-amber))" }}
                  >
                    {item.term}
                  </h3>
                  <p
                    className="handbook-body-text leading-[1.85] tracking-[0.01em]"
                    style={{ color: "oklch(var(--handbook-body-text))" }}
                  >
                    {item.definition}
                  </p>
                  {termIdx < category.terms.length - 1 && (
                    <div
                      className="mt-5 h-px"
                      style={{
                        background: "oklch(var(--handbook-rule) / 0.4)",
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {catIdx < FINANCIAL_CATEGORIES.length - 1 && (
              <div
                className="mt-10 h-px"
                style={{ background: "oklch(var(--handbook-rule))" }}
              />
            )}
          </motion.section>
        ))}
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------
// US History Page
// ----------------------------------------------------------------
interface HistoryEvent {
  year: string;
  title: string;
  body: string;
}

interface HistoryEra {
  num: string;
  era: string;
  events: HistoryEvent[];
}

const US_HISTORY_ERAS: HistoryEra[] = [
  {
    num: "01",
    era: "Colonial America & The Road to Revolution (1700–1775)",
    events: [
      {
        year: "1700s",
        title: "Colonial Society Takes Shape",
        body: "By 1700 roughly 250,000 English colonists live along the Atlantic seaboard in thirteen distinct colonies. Each colony develops its own legislature, legal tradition, and economic character — New England built on trade and fishing, the Middle Colonies on grain and commerce, the South on tobacco and enslaved labor. The tension between colonial self-governance and British imperial authority quietly takes root in this period.",
      },
      {
        year: "1733",
        title: "The Molasses Act",
        body: "Britain passes the Molasses Act, taxing sugar and molasses imported from non-British Caribbean islands. Colonists largely ignore it through smuggling, establishing an early pattern of resistance to British economic control. The principle that Parliament cannot tax colonists without their consent begins to harden.",
      },
      {
        year: "1754–1763",
        title: "The French and Indian War",
        body: "Britain and France fight for control of North America. The war ends with British victory and the Treaty of Paris in 1763, which grants Britain vast new territory east of the Mississippi. The enormous cost of the war prompts Britain to tax the colonies — triggering the chain of events that will lead to revolution. A young Virginia militia officer named George Washington gains his first military experience in this conflict.",
      },
      {
        year: "1765",
        title: "The Stamp Act",
        body: "Parliament passes the Stamp Act, the first direct tax on the colonies, requiring a revenue stamp on all printed materials. Colonial opposition is fierce — the cry of 'no taxation without representation' unites colonists across regions. The Stamp Act Congress convenes in New York, representing the first major joint action by multiple colonies. Britain repeals the act in 1766 but asserts its right to tax colonists in the Declaratory Act.",
      },
      {
        year: "1770",
        title: "The Boston Massacre",
        body: "On March 5, British soldiers fire into a crowd in Boston, killing five colonists including Crispus Attucks, a mixed-race dockworker. Patriot propagandists, including Paul Revere, use the event to inflame colonial opinion against British military occupation. The incident becomes one of the most potent symbols of British tyranny in the pre-revolutionary period.",
      },
      {
        year: "1773",
        title: "The Boston Tea Party",
        body: "In December, colonists disguised as Mohawk warriors dump 342 chests of British East India Company tea into Boston Harbor to protest the Tea Act. Britain responds with the Coercive Acts (the 'Intolerable Acts') in 1774, closing Boston Harbor and revoking Massachusetts's self-government charter. Rather than isolating Massachusetts, the punitive measures unite the colonies and accelerate the path to war.",
      },
    ],
  },
  {
    num: "02",
    era: "Revolution, Independence & The New Republic (1775–1800)",
    events: [
      {
        year: "1775",
        title: "Lexington and Concord — The Shot Heard 'Round the World'",
        body: "On April 19, British regulars marching to seize colonial arms at Concord, Massachusetts, exchange fire with minutemen at Lexington and Concord. Eight colonists are killed at Lexington in the war's first engagement. The battles mark the beginning of the American Revolutionary War. Within weeks, colonial militias lay siege to British-held Boston.",
      },
      {
        year: "1776",
        title: "The Declaration of Independence",
        body: "On July 4, the Continental Congress adopts the Declaration of Independence, primarily drafted by Thomas Jefferson. Drawing on Enlightenment philosophy — particularly John Locke's theories of natural rights — the Declaration asserts that all men are created equal and endowed with unalienable rights to life, liberty, and the pursuit of happiness. It remains one of the most consequential political documents in world history, though its ideals would take centuries to apply broadly.",
      },
      {
        year: "1777–1778",
        title: "Valley Forge and the French Alliance",
        body: "Washington's Continental Army endures a brutal winter at Valley Forge, Pennsylvania — starved, underequipped, and ravaged by disease. The experience nearly destroys the army but forges a battle-hardened core of survivors. In February 1778, France formally allies with the United States, providing the naval power and financial resources that will prove decisive in achieving independence.",
      },
      {
        year: "1781",
        title: "Yorktown — The War's Decisive Battle",
        body: "A combined American and French force traps British General Cornwallis at Yorktown, Virginia. After a three-week siege, Cornwallis surrenders his army of roughly 8,000 men on October 19 — the largest British surrender of the war. While fighting continues in some areas, Yorktown effectively ends the conflict. The Treaty of Paris in 1783 officially recognizes American independence and grants the new nation all territory east of the Mississippi.",
      },
      {
        year: "1787",
        title: "The Constitutional Convention",
        body: "Fifty-five delegates convene in Philadelphia to revise the Articles of Confederation, the country's weak first governing document. They instead draft an entirely new Constitution establishing a federal government with three branches, a system of checks and balances, and a framework for federal-state relations. The Great Compromise resolves the dispute between large and small states over congressional representation. After ratification by nine states in 1788, the Constitution takes effect in 1789.",
      },
      {
        year: "1789–1797",
        title: "George Washington's Presidency",
        body: "George Washington serves two terms as the first President, establishing precedents that shape the office permanently — including the two-term tradition he voluntarily upheld. Alexander Hamilton as Treasury Secretary and Thomas Jefferson as Secretary of State represent competing visions of national development: a commercially oriented federal government versus an agrarian republic of small landholders. Their conflict defines American politics for decades. In his Farewell Address (1796), Washington warns against permanent foreign alliances and partisan factionalism.",
      },
    ],
  },
  {
    num: "03",
    era: "Expansion, Conflict & The Slavery Crisis (1800–1860)",
    events: [
      {
        year: "1803",
        title: "The Louisiana Purchase",
        body: "President Thomas Jefferson purchases approximately 828,000 square miles of French-controlled territory for $15 million — roughly three cents per acre. The acquisition doubles the size of the United States and opens the vast interior of the continent to American settlement. The expedition of Lewis and Clark (1804–1806) maps much of this new territory, documenting its geography, people, and natural resources.",
      },
      {
        year: "1812–1815",
        title: "The War of 1812",
        body: "The United States goes to war with Britain over trade restrictions, impressment of American sailors, and British support for Native American resistance to westward expansion. The war includes the British burning of Washington D.C. in 1814 and Andrew Jackson's decisive victory at the Battle of New Orleans. The Treaty of Ghent restores the pre-war status quo but establishes the northern border with Canada. The war produces lasting American nationalism and ends Native American armed resistance east of the Mississippi.",
      },
      {
        year: "1823",
        title: "The Monroe Doctrine",
        body: "President James Monroe declares that the Western Hemisphere is closed to future European colonization and that any attempt by European powers to extend their system to this hemisphere will be considered a threat to American security. The Monroe Doctrine becomes a cornerstone of American foreign policy, invoked for over a century to justify U.S. involvement in Latin American affairs.",
      },
      {
        year: "1830",
        title: "Indian Removal Act & The Trail of Tears",
        body: "Congress passes the Indian Removal Act, authorizing the forced relocation of Native American tribes east of the Mississippi to designated 'Indian Territory' west of the river. The Cherokee, who had adopted many Euro-American customs and won a Supreme Court ruling in their favor (Worcester v. Georgia, 1832), are forcibly marched west in 1838–1839 — the 'Trail of Tears.' Approximately 4,000 of the estimated 16,000 Cherokee die during the removal.",
      },
      {
        year: "1846–1848",
        title: "The Mexican-American War",
        body: "Following the annexation of Texas (1845), the United States fights Mexico in a war that ends with the Treaty of Guadalupe Hidalgo. Mexico cedes roughly half its territory — today's California, Nevada, Utah, Arizona, New Mexico, and parts of Colorado and Wyoming — for $15 million. The acquisition of this vast territory immediately reignites the slavery debate, which will dominate American politics for the next decade and a half.",
      },
      {
        year: "1848",
        title: "The California Gold Rush",
        body: "Gold is discovered at Sutter's Mill in California in January 1848. By 1849 more than 80,000 '49ers' have flooded into California from across the United States and around the world. The Gold Rush accelerates California's statehood (1850), transforms San Francisco from a small settlement into a major city, and establishes the United States as a Pacific power. It also fuels explosive demand for transcontinental transportation.",
      },
      {
        year: "1852",
        title: "Uncle Tom's Cabin Published",
        body: "Harriet Beecher Stowe publishes 'Uncle Tom's Cabin,' a novel depicting the brutality of slavery. It sells 300,000 copies in its first year — an extraordinary number for the era — and galvanizes anti-slavery opinion in the North. When Abraham Lincoln reportedly meets Stowe during the Civil War, he is said to have called her 'the little woman who wrote the book that started this great war.'",
      },
      {
        year: "1857",
        title: "Dred Scott Decision",
        body: "The Supreme Court rules in Dred Scott v. Sandford that enslaved people are not citizens and have no right to sue in federal court, and that Congress has no authority to prohibit slavery in U.S. territories. The decision is received with outrage in the North and accelerates the collapse of political compromise on slavery. It is widely regarded as one of the worst decisions in Supreme Court history.",
      },
    ],
  },
  {
    num: "04",
    era: "Civil War & Reconstruction (1861–1877)",
    events: [
      {
        year: "1861",
        title: "The Civil War Begins",
        body: "Following the secession of eleven Southern states over the issue of slavery and states' rights, Confederate forces fire on Fort Sumter in Charleston Harbor on April 12. President Abraham Lincoln calls for 75,000 volunteers. Both sides expect a short war; few anticipate the four-year conflict that will kill approximately 620,000 to 750,000 soldiers — more American deaths than in any other war — and fundamentally transform the nation.",
      },
      {
        year: "1863",
        title: "The Emancipation Proclamation & Gettysburg",
        body: "On January 1, Lincoln issues the Emancipation Proclamation, declaring all enslaved people in Confederate states 'forever free.' The proclamation transforms the war's moral character and prevents Britain and France from recognizing the Confederacy. In July, the Battle of Gettysburg becomes the war's turning point — three days of fighting result in 51,000 casualties and the end of Confederate General Lee's second invasion of the North. Lincoln's Gettysburg Address, delivered at the dedication of the battlefield cemetery, reframes the war as a struggle for human equality.",
      },
      {
        year: "1865",
        title: "The War Ends; Lincoln Assassinated",
        body: "General Lee surrenders at Appomattox Court House on April 9. Five days later, President Lincoln is shot at Ford's Theatre by Confederate sympathizer John Wilkes Booth and dies the following morning. The 13th Amendment, ratified in December, abolishes slavery throughout the United States. The task of rebuilding the shattered South and integrating four million newly freed people into American life — Reconstruction — begins under Lincoln's successor, Andrew Johnson.",
      },
      {
        year: "1865–1877",
        title: "Reconstruction",
        body: "The Reconstruction era reshapes the South's political and social order. The 14th Amendment (1868) grants citizenship and equal protection to all persons born in the United States. The 15th Amendment (1870) guarantees the right to vote regardless of race. Black men serve in Congress and state legislatures for the first time. However, Reconstruction is ultimately undermined by Southern white resistance, Northern fatigue, and the Compromise of 1877, which withdraws federal troops from the South and ends Reconstruction — leaving Black Southerners vulnerable to the Jim Crow era that follows.",
      },
    ],
  },
  {
    num: "05",
    era: "Industrialization, Immigration & Empire (1877–1914)",
    events: [
      {
        year: "1869",
        title: "Transcontinental Railroad Completed",
        body: "The Central Pacific and Union Pacific railroads join at Promontory Summit, Utah, completing the first transcontinental railroad. Built largely by Chinese and Irish immigrant laborers, the railroad knits the continent together, accelerates western settlement, and transforms the American economy. It also precipitates the final destruction of Plains Indian cultures as buffalo herds are decimated and traditional territories are overrun.",
      },
      {
        year: "1880s–1900s",
        title: "The Gilded Age: Steel, Oil & the Robber Barons",
        body: "The post-Civil War decades see explosive industrialization. John D. Rockefeller's Standard Oil dominates the petroleum industry; Andrew Carnegie's steel empire builds the industrial infrastructure of modern America; J.P. Morgan controls vast swaths of American finance. The concentration of wealth is extraordinary — and so is the exploitation of workers, the corruption of politics, and the power of trusts. Reformers and labor organizers push back, planting the seeds of the Progressive Era.",
      },
      {
        year: "1886",
        title: "The Haymarket Affair & Rise of Organized Labor",
        body: "On May 4, a bomb explodes at a labor rally in Chicago's Haymarket Square during a demonstration for the eight-hour workday, killing seven police officers. Eight anarchists are tried and convicted in a process widely criticized as unjust. The event sets back the labor movement but ultimately strengthens calls for workers' rights. The American Federation of Labor, founded the same year by Samuel Gompers, becomes the dominant labor organization of the era.",
      },
      {
        year: "1898",
        title: "The Spanish-American War",
        body: "Following the mysterious explosion of the USS Maine in Havana harbor, the United States declares war on Spain. Within months, American forces defeat Spain in Cuba and the Philippines. The Treaty of Paris grants the United States control of Puerto Rico, Guam, and the Philippines — catapulting America onto the world stage as an imperial power. The war lasts only 10 weeks and produces the Cuban independence the war was ostensibly fought to achieve, while simultaneously establishing American dominance in the Caribbean and Pacific.",
      },
      {
        year: "1903",
        title: "The Wright Brothers Fly at Kitty Hawk",
        body: "On December 17, Orville and Wilbur Wright make the first successful powered airplane flight at Kitty Hawk, North Carolina. The longest of four flights that day lasts 59 seconds and covers 852 feet. Within decades, aviation transforms warfare, commerce, and human civilization. The Wright Brothers' achievement is one of the defining technological events of the 20th century.",
      },
    ],
  },
  {
    num: "06",
    era: "World Wars & The American Century (1914–1945)",
    events: [
      {
        year: "1917–1918",
        title: "World War I: America Enters the War",
        body: "After years of neutrality, the United States enters World War I in April 1917, following Germany's resumption of unrestricted submarine warfare and the revelation of the Zimmermann Telegram — Germany's secret proposal that Mexico attack the United States. American troops, money, and supplies tip the balance decisively in favor of the Allies. The Armistice on November 11, 1918 ends the war. President Wilson's Fourteen Points envision a liberal international order, but the Senate rejects the Treaty of Versailles and membership in the League of Nations. The punitive terms imposed on Germany plant the seeds of the next world war.",
      },
      {
        year: "1920",
        title: "Women's Suffrage: The 19th Amendment",
        body: "The 19th Amendment, ratified on August 18, guarantees women the right to vote — the culmination of over 70 years of organized suffrage campaigning. The suffrage movement was itself deeply intertwined with other reform movements of the era, including temperance and labor rights. The amendment does not extend to women of color in states that use poll taxes and literacy tests to disenfranchise Black voters.",
      },
      {
        year: "1929",
        title: "The Stock Market Crash & The Great Depression",
        body: "On October 24 and 29 ('Black Thursday' and 'Black Tuesday'), the stock market collapses. The crash triggers the Great Depression — the worst economic catastrophe in American history. By 1933, unemployment reaches 25%. Thousands of banks fail. Millions lose their homes and farms. The Depression exposes the structural weaknesses of the unregulated economy of the 1920s and transforms the relationship between citizens and the federal government.",
      },
      {
        year: "1933–1939",
        title: "The New Deal",
        body: "President Franklin D. Roosevelt's New Deal is a sweeping set of programs, reforms, and agencies designed to provide relief, recovery, and reform in response to the Depression. Key programs include the Social Security Act (1935), the creation of the FDIC to insure bank deposits, the Securities and Exchange Commission to regulate financial markets, the Civilian Conservation Corps, and the Works Progress Administration. The New Deal fundamentally reshapes the role of the federal government in American life.",
      },
      {
        year: "1941",
        title: "Pearl Harbor & World War II",
        body: "On December 7, Japan launches a surprise attack on the U.S. naval base at Pearl Harbor, Hawaii, killing 2,403 Americans and destroying or damaging much of the Pacific Fleet. The next day Congress declares war on Japan; Germany and Italy declare war on the United States days later. America mobilizes with staggering speed and scale — converting industrial capacity to war production, drafting millions, and deploying forces across two vast theaters of war simultaneously.",
      },
      {
        year: "1944",
        title: "D-Day: The Normandy Invasion",
        body: "On June 6, Allied forces launch the largest amphibious invasion in history — Operation Overlord — landing on five beaches in Normandy, France. More than 156,000 American, British, and Canadian troops cross the English Channel; 4,414 Allied troops are confirmed dead on the first day alone. The successful landings open the Western Front and begin the liberation of Western Europe from Nazi occupation.",
      },
      {
        year: "1945",
        title: "Victory in Europe and Japan; The Atomic Bomb",
        body: "Germany surrenders on May 8, 1945 (V-E Day). In August, the United States drops atomic bombs on Hiroshima (August 6) and Nagasaki (August 9), killing an estimated 129,000–226,000 people. Japan surrenders on September 2 (V-J Day), ending World War II. The atomic bombings open the nuclear age, fundamentally altering the nature of warfare and international relations. The United States emerges from the war as the world's dominant military, economic, and political power.",
      },
    ],
  },
  {
    num: "07",
    era: "The Cold War & Civil Rights (1945–1975)",
    events: [
      {
        year: "1947–1950",
        title: "The Cold War Begins",
        body: "Following World War II, the United States and Soviet Union emerge as competing superpowers. The Truman Doctrine (1947) pledges American support to nations resisting communist takeover. The Marshall Plan (1948) provides $13 billion to rebuild Western Europe — cementing American economic influence and containing Soviet expansion. NATO is founded in 1949. The Soviet detonation of an atomic bomb in 1949 and the Communist victory in China trigger a major escalation of Cold War tensions. The ideological, military, and economic contest between the two superpowers will define global politics for the next four decades.",
      },
      {
        year: "1950–1953",
        title: "The Korean War",
        body: "When North Korea invades South Korea in June 1950, the United States leads a United Nations force in defense of the South. China enters the war when UN forces approach the Chinese border. The war ends in an armistice in 1953, roughly restoring the pre-war border at the 38th parallel. Approximately 36,500 American soldiers are killed. Korea becomes known as 'the Forgotten War' — overshadowed by World War II and the conflicts that follow. The Korean peninsula remains divided to this day.",
      },
      {
        year: "1954",
        title: "Brown v. Board of Education",
        body: "The Supreme Court rules unanimously in Brown v. Board of Education that racial segregation in public schools is unconstitutional, overturning the 'separate but equal' doctrine established in Plessy v. Ferguson (1896). The decision is a landmark moment in the Civil Rights Movement and sets the legal framework for desegregation, though implementation proceeds slowly and often against fierce resistance over the following decades.",
      },
      {
        year: "1955–1965",
        title: "The Civil Rights Movement",
        body: "The Montgomery Bus Boycott (1955–1956), sparked by Rosa Parks's arrest, launches the career of Martin Luther King Jr. and establishes nonviolent protest as the movement's primary tactic. The sit-in movement, Freedom Rides, and the March on Washington (1963) — where King delivers his 'I Have a Dream' speech before 250,000 people — build relentless pressure for legislative change. The Civil Rights Act of 1964 bans discrimination based on race, color, religion, sex, or national origin. The Voting Rights Act of 1965 eliminates barriers that had disenfranchised Black voters across the South.",
      },
      {
        year: "1961",
        title: "The Space Race: Alan Shepard & The Challenge to Reach the Moon",
        body: "The Soviet Union launches Sputnik in 1957 and sends cosmonaut Yuri Gagarin into orbit in April 1961 — the first human in space. The United States responds with urgency: Alan Shepard becomes the first American in space in May 1961. President Kennedy challenges the nation to land a man on the moon before the end of the decade. NASA's Apollo program mobilizes 400,000 engineers and scientists. On July 20, 1969, Neil Armstrong and Buzz Aldrin land on the moon — one of the defining achievements of the 20th century.",
      },
      {
        year: "1963",
        title: "The Assassination of President Kennedy",
        body: "President John F. Kennedy is shot and killed in Dallas, Texas, on November 22. Lee Harvey Oswald is arrested for the assassination but is shot two days later by Jack Ruby before standing trial. The Warren Commission concludes Oswald acted alone, but conspiracy theories persist. Kennedy's assassination traumatizes the nation and ends a period of youthful optimism associated with his presidency, which he had called the 'New Frontier.'",
      },
      {
        year: "1964–1975",
        title: "The Vietnam War",
        body: "U.S. military involvement in Vietnam escalates sharply after the Gulf of Tonkin Resolution (1964), which grants President Johnson broad authority to use military force. By 1969 more than 500,000 American troops are in Vietnam. Mounting casualties, the My Lai Massacre (1968), and the leaked Pentagon Papers (1971) — revealing systematic government deception — devastate public trust and fuel massive anti-war protests. The last American combat troops leave in 1973; Saigon falls to North Vietnamese forces in April 1975. More than 58,000 Americans are killed; Vietnamese deaths number in the millions. The war's legacy permanently transforms American attitudes toward military intervention.",
      },
    ],
  },
  {
    num: "08",
    era: "Watergate, Reagan & The End of the Cold War (1972–1991)",
    events: [
      {
        year: "1972–1974",
        title: "Watergate & Nixon's Resignation",
        body: "In June 1972, agents connected to President Nixon's reelection campaign are arrested burglarizing Democratic Party headquarters at the Watergate complex in Washington. The subsequent cover-up, revealed through congressional hearings and investigative journalism, exposes widespread abuse of power by the Nixon administration. Facing certain impeachment and conviction, Nixon resigns on August 9, 1974 — the only American president ever to do so. Vice President Gerald Ford assumes the presidency and controversially pardons Nixon, a decision that costs him the 1976 election.",
      },
      {
        year: "1979–1981",
        title: "The Iran Hostage Crisis",
        body: "Following the Iranian Revolution that overthrows the Shah, Iranian students seize the U.S. Embassy in Tehran on November 4, 1979, taking 66 Americans hostage. The crisis lasts 444 days, paralyzes the Carter presidency, and contributes to Carter's defeat by Ronald Reagan in 1980. The hostages are released on January 20, 1981 — minutes after Reagan is inaugurated.",
      },
      {
        year: "1981–1989",
        title: "The Reagan Revolution",
        body: "Ronald Reagan's presidency reorients American politics and economic policy. 'Reaganomics' — cutting income taxes (particularly for the wealthy), reducing domestic spending, deregulating industry, and building up the military — represents a fundamental break from the post-New Deal consensus. Reagan dramatically increases defense spending, deploying the 'peace through strength' doctrine against the Soviet Union. His Strategic Defense Initiative ('Star Wars') accelerates Soviet military spending that they cannot sustain. The Reagan years also see the emergence of the AIDS epidemic, the Iran-Contra scandal, and the beginning of the savings and loan crisis.",
      },
      {
        year: "1989–1991",
        title: "The Berlin Wall Falls & The Cold War Ends",
        body: "In November 1989, the Berlin Wall — the defining symbol of Cold War division — falls as East Germany opens its borders. Germany reunifies in 1990. The Soviet Union itself dissolves on December 25, 1991, when Mikhail Gorbachev resigns and 15 independent republics emerge from its territory. The United States is left as the world's sole superpower — a 'unipolar moment' whose duration and implications will be debated for decades. The Cold War's end is one of the most consequential geopolitical events of the 20th century.",
      },
    ],
  },
  {
    num: "09",
    era: "The Digital Age & Post-Cold War America (1991–2001)",
    events: [
      {
        year: "1991",
        title: "The Gulf War",
        body: "Following Iraq's invasion of Kuwait, a U.S.-led coalition of 34 nations launches Operation Desert Storm on January 17. The ground campaign lasts 100 hours; Iraqi forces are routed and Kuwait is liberated. President George H.W. Bush stops short of invading Iraq and removing Saddam Hussein — a decision that leaves unresolved tensions that will explode a decade later. The Gulf War demonstrates the overwhelming superiority of American 'precision' military technology and temporarily restores confidence in American military power after Vietnam.",
      },
      {
        year: "1990s",
        title: "The Internet Revolution",
        body: "The World Wide Web, developed by Tim Berners-Lee at CERN in 1989–1991, becomes publicly accessible and begins reshaping commerce, communication, and culture. Netscape's browser (1994), Amazon (1994), eBay (1995), and Google (1998) emerge. The dot-com boom of the late 1990s sees enormous speculative investment in internet companies, culminating in the NASDAQ reaching its all-time high in March 2000 before the dot-com crash. The internet permanently transforms the economy, politics, and social life — effects that continue to accelerate through the present.",
      },
      {
        year: "1992–2000",
        title: "The Clinton Presidency",
        body: "Bill Clinton governs during the longest peacetime economic expansion in American history, producing budget surpluses for the first time in a generation. His presidency also includes the passage of NAFTA (1994), the crime bill that accelerates mass incarceration, and ultimately the Monica Lewinsky scandal that leads to his impeachment by the House in 1998. The Senate acquits him. The Clinton years mark the peak of the 'Washington consensus' — free trade, balanced budgets, and confidence in American-led globalization.",
      },
    ],
  },
  {
    num: "10",
    era: "9/11, War on Terror & The Great Recession (2001–2012)",
    events: [
      {
        year: "2001",
        title: "September 11 — The Attacks That Changed Everything",
        body: "On September 11, 19 al-Qaeda terrorists hijack four commercial airplanes. Two are flown into the World Trade Center towers in New York City — both towers collapse. A third strikes the Pentagon. A fourth, United Airlines Flight 93, crashes into a field in Pennsylvania after passengers overpower the hijackers. Nearly 3,000 people are killed — the deadliest terrorist attack in history. The attacks trigger a fundamental reshaping of American domestic and foreign policy, including the creation of the Department of Homeland Security, the PATRIOT Act, and the launch of the War on Terror.",
      },
      {
        year: "2001–2021",
        title: "The War in Afghanistan",
        body: "Within weeks of 9/11, the United States and NATO allies invade Afghanistan to destroy al-Qaeda's base and remove the Taliban government that sheltered them. The Taliban are quickly ousted but reconstitute as an insurgency. The war becomes America's longest — lasting nearly 20 years. Osama bin Laden, the mastermind of 9/11, is killed by U.S. Special Forces in Pakistan in May 2011. The last American forces withdraw in August 2021, and the Taliban recapture Kabul within days.",
      },
      {
        year: "2003–2011",
        title: "The Iraq War",
        body: "In March 2003, the United States invades Iraq, claiming it possesses weapons of mass destruction (WMDs) and has links to al-Qaeda. No WMDs are found. The rapid defeat of Saddam Hussein's army is followed by a prolonged, bloody insurgency. The Abu Ghraib prisoner abuse scandal damages American credibility internationally. The war costs more than $2 trillion and approximately 4,500 American lives; Iraqi civilian deaths number in the hundreds of thousands. The decision to invade Iraq is widely regarded as one of the most consequential strategic mistakes in American history.",
      },
      {
        year: "2008",
        title: "The Great Recession & The First Black President",
        body: "The collapse of the U.S. housing market triggers a global financial crisis — the worst since the Great Depression. Major financial institutions, including Lehman Brothers, fail. The federal government enacts a $700 billion bailout (TARP) and the Federal Reserve takes unprecedented emergency actions. Unemployment peaks at 10% in 2009. In November 2008, Barack Obama is elected president — the first African American to hold the office — on a message of hope and change, sweeping to victory as the financial crisis devastates the incumbent party.",
      },
      {
        year: "2010",
        title: "The Affordable Care Act",
        body: "President Obama signs the Affordable Care Act (ACA) — the most significant expansion of American health coverage since Medicare and Medicaid in 1965. The law extends coverage to approximately 20 million previously uninsured Americans through Medicaid expansion, insurance exchanges, and requirements for insurers to cover pre-existing conditions. It becomes the central battleground of American political debate for the next decade.",
      },
    ],
  },
  {
    num: "11",
    era: "Social Media, Polarization & A Turbulent Decade (2012–2020)",
    events: [
      {
        year: "2012–2016",
        title: "The Rise of Social Media & Political Polarization",
        body: "Facebook reaches one billion users in 2012. Twitter, Instagram, and later Snapchat and TikTok reshape how Americans consume information and form political opinions. Algorithmic content feeds optimize for engagement — often rewarding outrage, sensationalism, and confirmation bias. Political polarization, already growing for decades, accelerates. The proliferation of partisan media and the decline of shared news sources contributes to a fracturing of shared political reality.",
      },
      {
        year: "2013",
        title: "The Snowden Revelations",
        body: "Former NSA contractor Edward Snowden leaks classified documents revealing the U.S. government's vast surveillance programs, including bulk collection of phone records and internet communications of American citizens and foreign leaders. The disclosures trigger worldwide debate about privacy, security, and the limits of government surveillance. Snowden is charged with espionage and flees to Russia, where he remains.",
      },
      {
        year: "2014–2020",
        title: "Black Lives Matter",
        body: "Following the deaths of Trayvon Martin (2012), Michael Brown (2014), Eric Garner (2014), and many others at the hands of police, the Black Lives Matter movement emerges as a nationwide force demanding an end to systemic racism and police brutality. George Floyd's murder by a Minneapolis police officer in May 2020 — captured on video — triggers the largest wave of protests in American history, with demonstrations in all 50 states and dozens of countries.",
      },
      {
        year: "2016",
        title: "The Election of Donald Trump",
        body: "Real estate developer and television personality Donald Trump defeats Democratic nominee Hillary Clinton in a shocking upset. Trump wins the Electoral College 306 to 232 despite losing the popular vote by approximately 3 million votes. His campaign, built on immigration restriction, trade protectionism, and attacks on political elites, signals a fundamental disruption of post-Cold War political consensus in both parties. Russian interference in the election, documented in the Mueller Report (2019), adds a further layer of controversy.",
      },
      {
        year: "2020",
        title: "COVID-19 Pandemic",
        body: "A novel coronavirus originating in Wuhan, China, spreads globally beginning in early 2020. The United States, despite being the world's most medically advanced nation, suffers catastrophically — due to a combination of delayed response, political division over public health measures, and structural inequities in the healthcare system. Over one million Americans ultimately die from COVID-19. Lockdowns and remote work transform the economy; supply chain disruptions trigger inflation. The Pfizer-BioNTech and Moderna mRNA vaccines, authorized in December 2020, represent one of the fastest vaccine developments in history.",
      },
    ],
  },
  {
    num: "12",
    era: "The Contemporary Era (2020–2026)",
    events: [
      {
        year: "2021",
        title: "January 6 Capitol Insurrection",
        body: "On January 6, a mob of Trump supporters — encouraged by the president's false claims that the 2020 election was stolen — storms the U.S. Capitol as Congress certifies Joe Biden's electoral victory. The attack kills five people and injures approximately 140 police officers. It is the first breach of the Capitol since the British attack in 1814. Trump is impeached by the House for a second time — for incitement of insurrection — but acquitted by the Senate. More than 1,000 participants are charged with federal crimes in the largest investigation in DOJ history.",
      },
      {
        year: "2021–2022",
        title: "Biden Presidency: Infrastructure, Inflation & Ukraine",
        body: "President Biden signs the Infrastructure Investment and Jobs Act (2021), the largest infrastructure investment in decades, and the Inflation Reduction Act (2022), the largest climate investment in U.S. history. In February 2022, Russia invades Ukraine — the largest European land war since World War II. The United States and NATO allies provide tens of billions of dollars in military and economic support to Ukraine. Inflation, peaking at 9.1% in mid-2022 — the highest in 40 years — reshapes economic politics as the Federal Reserve raises interest rates aggressively.",
      },
      {
        year: "2022",
        title: "Dobbs v. Jackson: The Overturn of Roe v. Wade",
        body: "In June, the Supreme Court overturns Roe v. Wade in Dobbs v. Jackson Women's Health Organization, eliminating the federal constitutional right to abortion that had stood since 1973. The decision returns abortion regulation to individual states. Within months, more than a dozen states ban or severely restrict abortion. The ruling reshapes American politics, energizing Democratic voters and producing unexpected Republican underperformance in the 2022 midterm elections.",
      },
      {
        year: "2023–2024",
        title: "AI Revolution & The 2024 Election",
        body: "The launch of ChatGPT in November 2022 and the rapid commercialization of large language models triggers what many consider a technological inflection point comparable to the internet revolution. AI tools begin transforming knowledge work, creative industries, and medicine. In the 2024 presidential election, Donald Trump becomes the first former president convicted of felony crimes — 34 counts in New York — and the first to be elected to non-consecutive terms since Grover Cleveland. Trump defeats Vice President Kamala Harris, who replaced President Biden after he withdrew from the race citing age concerns. Harris would have been the first woman and first person of South Asian heritage to serve as president.",
      },
      {
        year: "2025–2026",
        title: "The Trump Second Term & A Nation in Flux",
        body: "Donald Trump returns to the White House in January 2025, enacting sweeping executive orders on immigration, trade, and federal spending. Mass deportation operations, sweeping tariffs — including a 25% tariff on Canadian and Mexican goods and a major trade conflict with China — and efforts to reduce the federal workforce through the Department of Government Efficiency (DOGE) dominate the first months of his second term. Federal courts issue multiple rulings blocking aspects of these actions. The United States' relationships with traditional allies are strained. The country navigates a period of profound uncertainty about its institutions, international role, and domestic direction — a continuation of tensions that have defined American life since at least 2016.",
      },
    ],
  },
];

function USHistoryPage() {
  return (
    <motion.div
      key="us_history"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-3xl mx-auto px-6 md:px-10 py-10"
    >
      {/* Page header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Flag size={16} style={{ color: "oklch(var(--handbook-amber))" }} />
          <span
            className="font-mono-code text-xs font-semibold tracking-widest uppercase"
            style={{ color: "oklch(var(--handbook-amber))" }}
          >
            Historical Timeline
          </span>
          <div
            className="h-px flex-1"
            style={{ background: "oklch(var(--handbook-rule))" }}
          />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-5 leading-tight">
          US History: 1700–2026
        </h1>
        <p
          className="text-base leading-relaxed max-w-2xl"
          style={{ color: "oklch(var(--handbook-subtitle-text))" }}
        >
          A concise timeline of the most important events in American history —
          from the colonial era and the Revolution through the Civil War, world
          wars, Civil Rights, the Cold War, and the turbulent present.
        </p>
        <div
          className="mt-8 h-px"
          style={{ background: "oklch(var(--handbook-rule))" }}
        />
      </header>

      {/* Eras */}
      <div className="space-y-14">
        {US_HISTORY_ERAS.map((era, eraIdx) => (
          <motion.section
            key={era.num}
            data-ocid={`ushistory.era.item.${eraIdx + 1}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: eraIdx * 0.04, duration: 0.3 }}
          >
            {/* Era header */}
            <div className="flex items-baseline gap-3 mb-6">
              <span
                className="font-mono-code text-xs font-medium shrink-0"
                style={{ color: "oklch(var(--handbook-section-num))" }}
                aria-hidden="true"
              >
                {era.num}
              </span>
              <h2 className="font-display text-xl font-semibold text-foreground leading-snug">
                {era.era}
              </h2>
            </div>

            {/* Events */}
            <div
              className="pl-9 space-y-8 border-l-2"
              style={{ borderColor: "oklch(var(--handbook-amber) / 0.2)" }}
            >
              {era.events.map((event, eventIdx) => (
                <motion.div
                  key={`${era.num}-${event.year}`}
                  data-ocid={`ushistory.event.item.${eventIdx + 1}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: eraIdx * 0.04 + eventIdx * 0.03,
                    duration: 0.25,
                  }}
                  className="relative pl-5"
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute -left-[1.125rem] top-1.5 w-3 h-3 rounded-full border-2 shrink-0"
                    style={{
                      background: "oklch(var(--background))",
                      borderColor: "oklch(var(--handbook-amber))",
                    }}
                  />

                  {/* Year badge */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="font-mono-code text-xs font-bold px-2 py-0.5 rounded"
                      style={{
                        background: "oklch(var(--handbook-amber) / 0.1)",
                        color: "oklch(var(--handbook-amber))",
                      }}
                    >
                      {event.year}
                    </span>
                    <h3 className="font-display text-base font-semibold text-foreground leading-snug">
                      {event.title}
                    </h3>
                  </div>

                  <p
                    className="handbook-body-text leading-[1.85] tracking-[0.01em]"
                    style={{ color: "oklch(var(--handbook-body-text))" }}
                  >
                    {event.body}
                  </p>
                </motion.div>
              ))}
            </div>

            {eraIdx < US_HISTORY_ERAS.length - 1 && (
              <div
                className="mt-10 h-px"
                style={{ background: "oklch(var(--handbook-rule))" }}
              />
            )}
          </motion.section>
        ))}
      </div>
    </motion.div>
  );
}

// ----------------------------------------------------------------
// Top Tab Bar
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// Home Page
// ----------------------------------------------------------------
function HomePageView() {
  return (
    <motion.div
      key="home_page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex-1 flex items-center justify-center min-h-full relative overflow-hidden"
      data-ocid="homepage.panel"
    >
      {/* Full-page library background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/library-bg.dim_1920x1080.jpg')",
        }}
        aria-hidden="true"
      />
      {/* Dark overlay to deepen the mood and ensure logo readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.6) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Logo + E centered over background */}
      <div className="relative z-10 flex flex-col items-center gap-0 px-6 py-16">
        {/* Bunny silhouette — white on dark background */}
        <motion.img
          src="/assets/generated/bunny-silhouette-transparent.dim_400x400.png"
          alt="County Comfort Services"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
          className="w-48 h-48 md:w-72 md:h-72 object-contain select-none drop-shadow-2xl"
          style={{ filter: "brightness(0) invert(1)" }}
          draggable={false}
        />

        {/* Letter E */}
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.45, ease: "easeOut" }}
          className="font-display text-5xl md:text-6xl font-semibold tracking-widest leading-none mt-2 drop-shadow-lg"
          style={{
            color: "#ffffff",
            letterSpacing: "0.12em",
            textShadow: "0 2px 20px rgba(0,0,0,0.7)",
          }}
        >
          E
        </motion.span>
      </div>
    </motion.div>
  );
}

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
      id: "home_page",
      label: "Home Page",
      icon: <Home size={14} />,
      ocid: "nav.home_page.tab",
    },
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
      icon: <DoorOpen size={14} />,
      ocid: "nav.in_home_process.tab",
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: <CalendarDays size={14} />,
      ocid: "calendar.tab",
    },
    {
      id: "financial",
      label: "Financial Assistant",
      icon: <DollarSign size={14} />,
      ocid: "nav.financial.tab",
    },
    {
      id: "us_history",
      label: "US History",
      icon: <Flag size={14} />,
      ocid: "nav.us_history.tab",
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
  const [activeTab, setActiveTab] = useState<TabView>("home_page");
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filter handbook sections client-side based on search query
  const filteredSections = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return HANDBOOK_SECTIONS;
    return HANDBOOK_SECTIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.subsections.some(
          (sub) =>
            sub.subtitle.toLowerCase().includes(q) ||
            sub.body.toLowerCase().includes(q),
        ),
    );
  }, [debouncedSearch]);

  // Set of IDs that match the search (for highlight in sidebar)
  const highlightedIds = useMemo(
    () =>
      new Set(
        debouncedSearch.trim()
          ? filteredSections.map((s) => s.id)
          : ([] as number[]),
      ),
    [debouncedSearch, filteredSections],
  );

  const handleSectionClick = useCallback((index: number) => {
    setActiveSectionIndex(index);
    setSidebarOpen(false);
  }, []);

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
            <img
              src="/assets/generated/county-comfort-logo-transparent.dim_400x120.png"
              alt="County Comfort Services"
              className="h-9 w-auto object-contain"
              style={{ maxWidth: "220px" }}
            />
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

      {/* ── Content: Home Page view ────────────────────────── */}
      {activeTab === "home_page" && (
        <div
          className="flex flex-1 overflow-y-auto"
          style={{ height: contentHeight }}
        >
          <AnimatePresence mode="wait">
            <HomePageView key="home_page" />
          </AnimatePresence>
        </div>
      )}

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
                    {filteredSections.length > 0 ? (
                      <>
                        <span className="text-amber font-medium">
                          {filteredSections.length}
                        </span>{" "}
                        match{filteredSections.length !== 1 ? "es" : ""} for "
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
              <nav aria-label="Handbook sections">
                {HANDBOOK_SECTIONS.map((section, idx) => (
                  <SidebarItem
                    key={section.id}
                    section={section}
                    isActive={activeSectionIndex === idx}
                    isHighlighted={highlightedIds.has(section.id)}
                    index={idx + 1}
                    onClick={() => handleSectionClick(idx)}
                  />
                ))}
              </nav>
            </ScrollArea>

            {/* Sidebar footer */}
            <div
              className="px-4 py-3 shrink-0 border-t border-border/50"
              style={{ borderColor: "oklch(var(--handbook-rule))" }}
            >
              <p className="text-xs text-muted-foreground/50 font-mono-code">
                {HANDBOOK_SECTIONS.length} sections
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
            <div
              className="sticky top-0 z-10 flex items-center gap-2 px-6 md:px-10 h-9 border-b border-border/30 text-xs text-muted-foreground"
              style={{ background: "oklch(var(--background) / 0.95)" }}
            >
              <span>Handbook</span>
              <ChevronRight size={12} className="opacity-40" />
              <span className="text-foreground font-medium">
                {HANDBOOK_SECTIONS[activeSectionIndex]?.title ?? ""}
              </span>
            </div>

            <SectionPanel sectionIndex={activeSectionIndex} />

            {/* Footer */}
            <footer className="px-6 md:px-10 py-8 mt-8 border-t border-border/30 text-xs text-muted-foreground/50 flex items-center justify-between gap-4 flex-wrap">
              <span>County Comfort Services — Field Reference</span>
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

      {/* ── Content: Calendar view ────────────────────────────── */}
      {activeTab === "calendar" && (
        <div
          className="flex-1 overflow-y-auto"
          style={{ height: contentHeight }}
        >
          <AnimatePresence mode="wait">
            <CalendarPage key="calendar" />
          </AnimatePresence>
          <footer className="px-6 md:px-10 py-8 border-t border-border/30 text-xs text-muted-foreground/50 flex items-center justify-between gap-4 flex-wrap max-w-2xl mx-auto">
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

      {/* ── Content: Financial Assistant view ─────────────────── */}
      {activeTab === "financial" && (
        <div
          className="flex-1 overflow-y-auto"
          style={{ height: contentHeight }}
        >
          <AnimatePresence mode="wait">
            <FinancialAssistantPage key="financial" />
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

      {/* ── Content: US History view ───────────────────────────── */}
      {activeTab === "us_history" && (
        <div
          className="flex-1 overflow-y-auto"
          style={{ height: contentHeight }}
        >
          <AnimatePresence mode="wait">
            <USHistoryPage key="us_history" />
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
