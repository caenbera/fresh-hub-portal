/**
 * @fileoverview Central configuration for geographic districts.
 * This file defines the static properties of each sales district, including:
 * - Real-world area in square kilometers.
 * - Geographic boundaries defined as a polygon of [longitude, latitude] coordinates.
 * - A collection of named sub-zones within the district.
 * 
 * This data is considered the "source of truth" for calculating prospect density,
 * assigning prospects to districts, and rendering geographic visualizations.
 */

// Interface for a sub-zone (a cell in the 4x3 grid)
export interface SubZone {
  name: string; // e.g., "Blue Island Ave"
}

// Interface for a main district
export interface District {
  name: string; // e.g., "Pilsen / Lower West Side"
  areaKm2: number;
  boundaries: [number, number][]; // Polygon for the entire district
  subZones: Record<string, SubZone>; // e.g., { "CHI-PIL-01": { name: "Blue Island Ave" } }
}

export const districtData: Record<string, District> = {
  "CHI-PIL": {
    name: "Pilsen / Lower West Side",
    areaKm2: 2.1,
    // TODO: Add real GeoJSON polygon coordinates here.
    boundaries: [],
    subZones: {
      "CHI-PIL-01": { name: "Blue Island Ave" },
      "CHI-PIL-02": { name: "Cermak Rd East" },
      "CHI-PIL-03": { name: "18th & Ashland" },
      "CHI-PIL-04": { name: "Damen Ave Corridor" },
      "CHI-PIL-05": { name: "Heart of Pilsen" },
      "CHI-PIL-06": { name: "18th St Commercial" },
      "CHI-PIL-07": { name: "Western Ave Edge" },
      "CHI-PIL-08": { name: "Cullerton St Arts" },
      "CHI-PIL-09": { name: "Benito Juarez Park" },
      "CHI-PIL-10": { name: "Canalport Riverfront" },
      "CHI-PIL-11": { name: "Industrial South" },
      "CHI-PIL-12": { name: "East Residential" },
    }
  },
  "CHI-LV": {
    name: "Little Village / La Villita",
    areaKm2: 3.4,
    boundaries: [],
    subZones: {
        "CHI-LV-01": { name: "26th St (East)" },
        "CHI-LV-02": { name: "26th St (Central)" },
        "CHI-LV-03": { name: "26th St (West)" },
        "CHI-LV-04": { name: "Kedzie Ave Corridor" },
        "CHI-LV-05": { name: "Marshall Square" },
        "CHI-LV-06": { name: "California Ave" },
        "CHI-LV-07": { name: "North Residential" },
        "CHI-LV-08": { name: "South Residential" },
        "CHI-LV-09": { name: "Washtenaw Ave" },
        "CHI-LV-10": { name: "Industrial Park" },
        "CHI-LV-11": { name: "Rockwell St" },
        "CHI-LV-12": { name: "Piotrowski Park" },
    }
  },
  "CHI-AP": {
    name: "Albany Park",
    areaKm2: 2.8,
    boundaries: [],
    subZones: {
        "CHI-AP-01": { name: "Lawrence & Kedzie" },
        "CHI-AP-02": { name: "Lawrence & Kimball" },
        "CHI-AP-03": { name: "Montrose Ave East" },
        "CHI-AP-04": { name: "Pulaski Rd North" },
        "CHI-AP-05": { name: "Kimball Brown Line" },
        "CHI-AP-06": { name: "North Park University" },
        "CHI-AP-07": { name: "River Park" },
        "CHI-AP-08": { name: "Kedzie Residential" },
        "CHI-AP-09": { name: "Wilson Ave" },
        "CHI-AP-10": { name: "Central Park Ave" },
        "CHI-AP-11": { name: "Elston Ave" },
        "CHI-AP-12": { name: "Foster Ave West" },
    }
  },
  "IN-LAF": {
    name: "Lafayette, Indiana",
    areaKm2: 4.5,
    boundaries: [],
    subZones: {
        "IN-LAF-01": { name: "Downtown Core" },
        "IN-LAF-02": { name: "Sagamore Pkwy S" },
        "IN-LAF-03": { name: "SR 26 Corridor" },
        "IN-LAF-04": { name: "Purdue University Area" },
        "IN-LAF-05": { name: "Creasy Ln Commercial" },
        "IN-LAF-06": { name: "South St" },
        "IN-LAF-07": { name: "N 9th St" },
        "IN-LAF-08": { name: "Veterans Memorial" },
        "IN-LAF-09": { name: "North Industrial" },
        "IN-LAF-10": { name: "East Residential" },
        "IN-LAF-11": { name: "South Residential" },
        "IN-LAF-12": { name: "West Residential" },
    }
  },
  // Add other districts here following the same structure.
};
