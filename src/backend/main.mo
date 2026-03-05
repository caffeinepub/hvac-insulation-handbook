import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";



actor {
  type Subsection = {
    subtitle : Text;
    body : Text;
  };

  type Section = {
    id : Nat;
    title : Text;
    description : Text;
    subsections : [Subsection];
  };

  type SectionSummary = {
    id : Nat;
    title : Text;
    description : Text;
  };

  type SearchResult = {
    id : Nat;
    title : Text;
  };

  let handbookSections : [Section] = [
    {
      id = 1;
      title = "Heat Pump Condensers (New York)";
      description = "Outdoor unit components, climate considerations, refrigerant types, sizing, installation requirements, maintenance.";
      subsections = [
        {
          subtitle = "Outdoor Unit Components";
          body = "Condensers consist of a compressor, condenser coil, expansion valve, and fan. They extract heat from outside air even in NY winters.";
        },
        {
          subtitle = "NY Climate Considerations";
          body = "Select condensers rated for low temperatures (-5°F or below). Frost buildup is common; ensure proper defrost cycles.";
        },
        {
          subtitle = "Refrigerant Types";
          body = "Most modern units use R-410A refrigerant, replacing older R-22 systems. Check compatibility with existing equipment.";
        },
        {
          subtitle = "Sizing & Installation";
          body = "Proper sizing is crucial for efficiency. Follow NY state codes for clearance, electrical connections, and building permits.";
        },
        {
          subtitle = "Maintenance";
          body = "Maintain regular coil cleaning, refrigerant level checks, and electrical inspections to ensure optimal performance.";
        },
      ];
    },
    {
      id = 2;
      title = "Heat Pump Air Handlers (New York)";
      description = "Indoor unit components, coil types, blower motors, NY-specific installation, common issues.";
      subsections = [
        {
          subtitle = "Indoor Unit Components";
          body = "Air handlers contain an evaporator coil, blower motor, and control board. They distribute heated/cooled air throughout the home.";
        },
        {
          subtitle = "Coil Types";
          body = "Choose between aluminum or copper coils for better heat transfer. Ensure compatibility with the condenser unit.";
        },
        {
          subtitle = "Blower Motors";
          body = "Select variable speed motors for energy efficiency. Proper airflow is essential for optimal performance.";
        },
        {
          subtitle = "NY-Specific Installation";
          body = "Follow NY building codes for ductwork, electrical connections, and condensate drainage. Insulate ductwork to prevent energy loss.";
        },
        {
          subtitle = "Common Issues";
          body = "Watch for frozen coils, airflow restrictions, and control board malfunctions. Regular maintenance helps prevent breakdowns.";
        },
      ];
    },
    {
      id = 3;
      title = "Thermostats";
      description = "Types, wiring, programming, and compatibility information for heat pumps and dual-fuel systems.";
      subsections = [
        {
          subtitle = "Thermostat Types";
          body = "Options include single-stage, multi-stage, and smart thermostats. Choose based on your HVAC system configuration.";
        },
        {
          subtitle = "Wiring";
          body = "Learn about R, C, Y, G, W, and O/B terminals. Proper wiring ensures seamless communication with HVAC equipment.";
        },
        {
          subtitle = "Programming";
          body = "Program temperature schedules to optimize comfort and energy savings. Utilize smart features for remote control.";
        },
        {
          subtitle = "Compatibility";
          body = "Ensure thermostat compatibility with heat pumps, dual-fuel systems, and existing HVAC equipment.";
        },
      ];
    },
    {
      id = 4;
      title = "Boilers (Gas/Oil)";
      description = "Boiler types, components, operation, code requirements, and maintenance information specific to New York.";
      subsections = [
        {
          subtitle = "Boiler Types";
          body = "Choose between steam or hot water boilers based on heating needs. Understand the differences in operation and maintenance.";
        },
        {
          subtitle = "Components";
          body = "Key components include burners, heat exchangers, pumps, and control systems. Proper installation ensures efficiency.";
        },
        {
          subtitle = "Operation";
          body = "Boilers heat water or generate steam to distribute heat through radiators or baseboard systems.";
        },
        {
          subtitle = "NY Code Requirements";
          body = "Follow NY state and local codes for venting, fuel connections, and safety controls.";
        },
        {
          subtitle = "Maintenance";
          body = "Schedule annual maintenance for inspections, cleaning, and efficiency checks.";
        },
      ];
    },
    {
      id = 5;
      title = "Furnaces (Gas/Oil)";
      description = "Heat exchanger, burner, blower, controls, flue venting, code requirements, efficiency ratings, common issues.";
      subsections = [
        {
          subtitle = "Components";
          body = "Furnaces contain a heat exchanger, burner, blower, and control system. Proper sizing ensures efficient operation.";
        },
        {
          subtitle = "Burners";
          body = "Gas and oil burners ignite fuel to generate heat. Regular maintenance is crucial for safe operation.";
        },
        {
          subtitle = "Blower & Controls";
          body = "Blowers distribute heated air through ducts, while controls manage temperature and safety features.";
        },
        {
          subtitle = "Flue Venting";
          body = "Follow NY codes for proper venting to remove combustion byproducts safely.";
        },
        {
          subtitle = "Efficiency Ratings";
          body = "Understand AFUE ratings to select energy-efficient furnaces for cost savings.";
        },
      ];
    },
    {
      id = 6;
      title = "HVAC Residential Electric Work";
      description = "Electrical panel requirements, wire sizing, circuit breakers, disconnects, low voltage wiring, NY codes.";
      subsections = [
        {
          subtitle = "Panel Requirements";
          body = "Ensure sufficient electrical capacity for HVAC systems. Label circuits and follow local code requirements.";
        },
        {
          subtitle = "Wire Sizing";
          body = "Match wire size to HVAC system requirements to prevent overheating and ensure safety.";
        },
        {
          subtitle = "Circuit Breakers";
          body = "Properly size circuit breakers to protect equipment and prevent electrical fires.";
        },
        {
          subtitle = "Low Voltage Wiring";
          body = "Install control wiring for thermostats, zone controls, and communication between system components.";
        },
        {
          subtitle = "NY Electrical Codes";
          body = "Stay up-to-date with state and local codes for electrical installations to ensure compliance.";
        },
      ];
    },
    {
      id = 7;
      title = "Electric Strip Heat";
      description = "Operation, sizing, staging, installation, safety limits, sequencers, wiring for electric resistance heating.";
      subsections = [
        {
          subtitle = "How Strip Heaters Work";
          body = "Electric resistance heating elements supplement heat pump systems during extreme cold.";
        },
        {
          subtitle = "kW Sizing";
          body = "Proper sizing ensures efficient operation and prevents overloading electrical circuits.";
        },
        {
          subtitle = "Staging & Installation";
          body = "Stage strips to balance comfort and energy use. Follow recommended installation practices for safety.";
        },
        {
          subtitle = "Safety Limits & Sequencers";
          body = "Install safety controls to prevent overheating and ensure reliable system operation.";
        },
        {
          subtitle = "Wiring";
          body = "Use proper wiring techniques to meet electrical code requirements and ensure system reliability.";
        },
      ];
    },
  ];

  let calendarNotes = Map.empty<Principal, [Text]>();

  public query ({ caller }) func getAllSections() : async [SectionSummary] {
    handbookSections.map<Section, SectionSummary>(
      func(section) {
        {
          id = section.id;
          title = section.title;
          description = section.description;
        };
      }
    );
  };

  public query ({ caller }) func getSection(id : Nat) : async Section {
    switch (handbookSections.find(func(section) { section.id == id })) {
      case (null) { Runtime.trap("Section not found") };
      case (?section) { section };
    };
  };

  public query ({ caller }) func searchSections(searchQuery : Text) : async [SearchResult] {
    let lowerQuery = searchQuery.toLower();

    let matchingSections = handbookSections.filter(
      func(section) {
        section.title.toLower().contains(#text lowerQuery) or
        section.description.toLower().contains(#text lowerQuery) or
        section.subsections.values().any(
          func(sub) {
            sub.subtitle.toLower().contains(#text lowerQuery) or
            sub.body.toLower().contains(#text lowerQuery)
          }
        )
      }
    );

    matchingSections.map<Section, SearchResult>(
      func(section) {
        {
          id = section.id;
          title = section.title;
        };
      }
    );
  };

  public query ({ caller }) func getCalendarNotes() : async [Text] {
    switch (calendarNotes.get(caller)) {
      case (?notes) { notes };
      case (null) { ["", "", "", "", ""] };
    };
  };

  public shared ({ caller }) func saveCalendarNotes(notes : [Text]) : async () {
    if (notes.size() != 5) {
      return Runtime.trap("Exactly 5 notes required (one for each weekday: Monday through Friday)");
    };

    for (note in notes.values()) {
      if (note.size() > 200) {
        return Runtime.trap("Each note must be <= 200 characters");
      };
    };

    calendarNotes.add(caller, notes);
  };
};
