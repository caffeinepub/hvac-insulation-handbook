# HVAC & Insulation Handbook

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- A digital handbook app with 7 topic sections covering HVAC knowledge for a residential business in New York
- A sidebar navigation listing all 7 topic sections for quick access
- Each section displays static, book-like reference content (not dynamically updated)
- Topics:
  1. Heat Pump Condensers (New York)
  2. Heat Pump Air Handlers (New York)
  3. Thermostats
  4. Boilers (Gas/Oil)
  5. Furnaces (Gas/Oil)
  6. HVAC Residential Electric Work
  7. Electric Strip Heat
- Each section contains professional reference content with subsections (overview, components, installation notes, troubleshooting tips, NY-specific considerations where applicable)
- Search functionality to find content across sections
- Clean, readable typography suitable for reference reading

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
- Backend: Store 7 handbook sections with title, description, and subsections (subtitle + body text)
- Backend: Query functions to get all sections, get a section by ID, and search by keyword
- Frontend: Sidebar navigation listing all 7 sections
- Frontend: Main reading pane displaying selected section content
- Frontend: Search bar to filter content across sections
- Frontend: Mobile-responsive layout with collapsible sidebar
